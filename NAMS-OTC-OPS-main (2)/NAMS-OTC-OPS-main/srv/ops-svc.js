const cds = require("@sap/cds");

var xsenv = require("@sap/xsenv");
xsenv.loadEnv(); // Required for local testing with a default-env.json file

const utility = require("./utility");
const Select = require('./Select');

let msgOrdersSelect;

/*
    https://cap.cloud.sap/docs/node.js/services#srv-impls
    Add global constants like SELECT and INSERT, provides code assist
*/
module.exports = cds.service.impl(async (srv) => {

    const {
        Chassis,
        ChassisFilesCSV,
        ChassisFiles,
        MDFreight,
        MDOptionsRanges,
        MDModelDiscount,
        MsgOptions,
        MsgOrders,
        MsgSplits,
        Narratives,
        PromoCodes,
        Ranges,
        ReconFilesCSV,
        ReconFiles,
    } = srv.entities;

    // Connect to database
    const db = await cds.connect.to("db");

    //Connect to MapService
    const map = await cds.connect.to("MapService");
    const { SalesDocTypes, Plants, BaseModel } = map.entities;

    const API_SALES_ORDER_SRV = await cds.connect.to('API_SALES_ORDER_SRV');
    const { A_SalesOrder, A_SalesOrderItem } = API_SALES_ORDER_SRV.entities;

    const ChassisMsgService = await cds.connect.to('ChassisMsgService');
    const { Messages: ChassisMsgs } = ChassisMsgService.entities;

    const ZC_CHASSISLIST_CDS = await cds.connect.to('ZC_CHASSISLIST_CDS');
    const { ZC_ChassisList } = ZC_CHASSISLIST_CDS.entities;

    /* --------------------------------------------------------------------
      Check division authorization for CREATE
      @restrict does not check attribute values during CREATE event (because there is no "WHERE" clause in an INSERT statement)
      https://launchpad.support.sap.com/#/incident/pointer/002075129400000525242022
      https://cap.cloud.sap/docs/guides/authorization#instance-based-auth:
      "This means that, the condition applies following standard CDS events only:
          READ (as result filter)
          UPDATE (as reject condition)
          DELETE (as reject condition)"
    -------------------------------------------------------------------- */
    srv.before("CREATE", ["ChassisFiles", "MsgOptions", "MsgOrders", "MsgSplits", "MDOptionsRanges", "MDFreight", "MDModelDiscount", "ReconFiles"], (req) => {
        const divisionCd = req.data.divisionCd ?
            req.data.divisionCd :
            req.data.order.divisionCd;
        if (
            !req.user.is("Admin") &&
            !req.user.is("system-user") &&
            !(
                req.user.attr.Division &&
                (req.user.attr.Division === "$UNRESTRICTED" ||
                    req.user.attr.Division.includes(divisionCd))
            )
        )
            req.reject(403, `User ${req.user.id} is not authorized to ${req.event} entity ${req.entity} for division ${req.data.divisionCd}`);
    });
    /* --------------------------------------------------------------------
      End of division authorization check for CREATE
    -------------------------------------------------------------------- */

    /*---------------------------------------------------------------------
      ORDERS
    ---------------------------------------------------------------------*/
    srv.before("CREATE", "MsgOrders", async (req) => {

        // Do nothing for Action=Split
        if (req.data.action === "Split") return req;

        // Update before split logic
        const updateBeforeSplit = require("./updateBeforeSplit");
        try {
            await updateBeforeSplit(srv, req, MsgSplits, MsgOrders);
        } catch (err) {
            return;
        }

        /*
            Sometimes updates in OPS happen very rapidly, for example when users run macros,
            and this may increment an order through change order numbers quickly, for example
            from 1 to 2 to 3.  When this happens, the trigger for OPS to send the message
            happens asynchronously, and so the order may already be at change order number 3
            before any of the 3 messages get triggered, so OPS will wind up sending 3 messages
            all for change order 3.  It will never send a message for change order 1 or 2.
            There is also no guarantee in which order Biztalk (and Apigee) will deliver the
            messages, so OPS has added field createTimestamp to the message and we should not
            process a message that is older than one that was previously process for the same
            order (chassis + DTPO).
        */

        // Get the current message
        let currentOrder;
        try {
            currentOrder = await SELECT.one.from(MsgOrders)
                .where`chassisNo = ${req.data.chassisNo}
                   and divisionCd = ${req.data.divisionCd}
                   and DTPONumber = ${req.data.DTPONumber}
                   and current = true`;
        } catch (err) {
            console.error(err);
            req.error(513, err.message);
            return;
        }

        // The incoming order is older than the current one, mark the incoming order as non-current so that it's not processed
        if (new Date(req.data.createTimestamp) < new Date(currentOrder?.createTimestamp)) {
            req.data.current = false;
            req.data.newerMessage_ID = currentOrder.ID;
            for (let option of req.data.Options) { option.current = false; }
            for (let narrative of req.data.Narratives) { narrative.current = false; }

            // The incoming order is newer, or there is no older order
        } else {
            if (currentOrder != null) {
                // Set the current order as not current
                try {
                    await srv.setCurrent([currentOrder.ID], req.data.ID, false);
                } catch (err) {
                    console.error(err);
                    req.error(501, err.message);
                    return;
                }
            }

            try {
                const enrichOrder = require("./enrichOrder");
                await enrichOrder(
                    cds,
                    srv,
                    req,
                    currentOrder,
                    Chassis,
                    API_SALES_ORDER_SRV, A_SalesOrder,
                    MDFreight,
                    MDOptionsRanges,
                    PromoCodes,
                    Plants,
                    MDModelDiscount,
                    SalesDocTypes);
            } catch (err) {
                console.error(err);
                req.error(503, err.message);
                return;
            }
        }
    });

    srv.on("CREATE", "MsgOrders", async (req, next) => {

        // Split the order
        if (req.data.action === "Split" && !req.data.ignoreSplit) {
            const doSplit = require('./orderSplitter');
            return doSplit(srv, req, MsgOrders, MsgSplits, MsgOptions, Ranges, Narratives, Chassis, API_SALES_ORDER_SRV, A_SalesOrderItem);
            // Delegate down the chain to the next handler
        } else {
            return next();
        }

    });

    // Handle markSaved
    srv.on("markSaved", "MsgOrders", async (req) => {
        // For users with Writer role make sure they're authorized for the division code
        const pass =
            req.user.is("Admin") ||
            req.user.is("system-user") ||
            (req.user.is("Writer") &&
                req.user.attr.Division.includes(req.data.divisionCd));
        if (!pass) {
            req.reject(403, `User ${req.user.id} is not authorized to ${req.event} entity ${req.entity} for division ${req.data.divisionCd}`);
            return;
        }

        // Get the order message ID
        const ID = req.params[0];

        try {
            await UPDATE(MsgOrders, {
                ID: ID,
                divisionCd: req.data.divisionCd,
            }).with({
                orderSaved: req.data.orderSaved,
                salesOrder: req.data.salesOrder,
                timesProcessed: req.data.timesProcessed,
            });
        } catch (err) {
            console.error(err);
            req.error(549, err.message);
            return false;
        }

        // For any order messages that came in after this one, we need to carry forward the sales order so that
        // they will do an update rather than create a new, duplicate order.

        // Find all order messages for this same DTPO number
        let DTPOOrders;
        try {
            const dtpoNumber = SELECT.one`DTPONumber`.from(MsgOrders, ID);
            DTPOOrders = await SELECT`ID, newerMessage_ID, salesOrder, salesOrg`.from(MsgOrders).where`DTPONumber = ${dtpoNumber}`;
        } catch (err) {
            console.error(err);
            req.error(550, err.message);
            return false;
        }

        // Follow the trail of message to newer message to newer message, etc.
        if (Array.isArray(DTPOOrders) && DTPOOrders.length > 0) {

            let subsOrders = [];
            const thisOrder = DTPOOrders.find(o => o.ID === ID);

            let nextOrder = thisOrder;
            while (nextOrder.newerMessage_ID !== null) {
                nextOrder = DTPOOrders.find(o => o.ID === nextOrder.newerMessage_ID);
                subsOrders.push(nextOrder.ID);
                // Oh no, a newer message already got a different sales order assigned.  There are now likely 2 sales orders in S4 that have the
                // same truck material on them.
                if (nextOrder.salesOrder && nextOrder.salesOrder !== req.data.salesOrder) {
                    req.error(552, `Newer order message ID ${nextOrder.newerMessage_ID} found with conflicting sales order ${nextOrder.salesOrder}`);
                    return false;
                }
            }

            // Update the trail of newer messages with the same sales order and sales org, but don't overwrite
            if (subsOrders.length > 0) {
                try {
                    await UPDATE(MsgOrders)
                        .with({
                            salesOrder: req.data.salesOrder
                        })
                        .where`
                            ID in ${subsOrders} and
                            salesOrder is null`;
                } catch (err) {
                    console.error(err);
                    req.error(551, err.message);
                    return false;
                }
            }

        }

        return true;

    });

    srv.before("READ", "MsgOrders", (req) => {
        /**
         * Add temp columns that are needed to calculate other requested columns
         */
        msgOrdersSelect = new Select(req.query.SELECT);
        if (msgOrdersSelect.includesColumn('salesOrder')) msgOrdersSelect.addTempColumn('material');
        if (msgOrdersSelect.includesColumn('deleteItems')) {
            msgOrdersSelect.addTempColumn('salesOrder');
            msgOrdersSelect.addTempExpand('Chassis', [{ ref: ['salesOrderItem'] }]);
        }
        if (msgOrdersSelect.includesColumn('salesOrg')) msgOrdersSelect.addTempColumn('soldToCountry');
        if (msgOrdersSelect.includesColumn('soldToCountry')) msgOrdersSelect.addTempColumn('dealerCd');
        if (msgOrdersSelect.includesColumn('orderStatus') || msgOrdersSelect.includesColumn('orderCriticality')) {
            msgOrdersSelect.addTempColumn('orderSaved');
            msgOrdersSelect.addTempColumn('current');
            msgOrdersSelect.addTempColumn('timesProcessed');
        }
        if (msgOrdersSelect.expands.Chassis?.includesColumn('materialClass')) {
            msgOrdersSelect.addTempColumn('divisionCd');
            msgOrdersSelect.addTempColumn('modelCd');
            msgOrdersSelect.addTempColumn('std_des');
            msgOrdersSelect.addTempColumn('costModelCd');
            msgOrdersSelect.addTempColumn('class');
            msgOrdersSelect.addTempColumn('productType');
            msgOrdersSelect.addTempColumn('engineType');
            msgOrdersSelect.addTempColumn('cabWidth');
            msgOrdersSelect.addTempColumn('cabType');
            msgOrdersSelect.addTempColumn('CARNumber');
            msgOrdersSelect.addTempColumn('promoProgCd');
            msgOrdersSelect.addTempColumn('promoCodes');
            msgOrdersSelect.addTempColumn('cancellationReplacement');
            msgOrdersSelect.addTempColumn('marketingClass');
            msgOrdersSelect.expands.Chassis.addTempColumn('material');
        }
        if (msgOrdersSelect.expands.Chassis?.includesColumn('salesOrder')) msgOrdersSelect.addTempColumn('salesOrder');
        if (msgOrdersSelect.expands.Chassis?.includesColumn('updateIndicator')) {
            msgOrdersSelect.addTempColumn('salesOrder');
            msgOrdersSelect.expands.Chassis.addTempColumn('salesOrder');
            msgOrdersSelect.expands.Chassis.addTempColumn('salesOrderItem');
        }
        if (msgOrdersSelect.expands.Chassis?.includesColumn('billingDate') || msgOrdersSelect.expands.Chassis?.includesColumn('invoiceBlockStatus')) {
            msgOrdersSelect.addTempColumn('divisionCd');
            msgOrdersSelect.addTempColumn('DTPONumber');
            msgOrdersSelect.addTempColumn('salesOrder');
            msgOrdersSelect.expands.Chassis.addTempColumn('salesOrder');
            msgOrdersSelect.expands.Chassis.addTempColumn('salesOrderItem');
        }
    });

    //Converted from a per-row handler in order to enable async (it worked fine when getting by ID, but not when using $filter)
    //Old per-row handler info:  Naming the event or param "each" is a convenience shortcut for a per-row "READ" handler, see: https://cap.cloud.sap/docs/node.js/services#srv-after
    srv.after("READ", "MsgOrders", async (orders, req) => {

        // If it's not an array such as when querying by the ID, then convert it to one so we can use consistent logic
        const asArray = x => Array.isArray(x) ? x : [x];

        const BusinessPartner = require('./BusinessPartner');
        const bp = new BusinessPartner();

        // Get the chassis messages
        let chassisMsgs = [];
        if (msgOrdersSelect.expands.Chassis?.includesColumn('billingDate') || msgOrdersSelect.expands.Chassis?.includesColumn('invoiceBlockStatus')) {
            const chassis = utility.getUnique(asArray(orders)
                .filter(order => (order.Chassis && Array.isArray(order.Chassis) && order.Chassis.length > 0))
                .flatMap(order => order.Chassis.map(chassis => ({ "chassisNo": chassis.chassisNo }))),
                'chassisNo');
            if (chassis && Array.isArray(chassis) && chassis.length > 0) {
                try {
                    chassisMsgs = await ChassisMsgService.run(
                        SELECT
                            .columns(chassis => {
                                chassis.divisionCd,
                                    chassis.DTPOControlNumber.as('DTPONumber'),
                                    chassis.chassisNo,
                                    chassis.action,
                                    chassis.invoiceQueueDt
                            })
                            .from(ChassisMsgs)
                            .where`
                                action = 'DELS' and
                                chassisNo in ${chassis}`
                            .orderBy`divisionCd, DTPOControlNumber, chassisNo, createTimestamp desc`
                    );
                } catch (err) {
                    console.error(err);
                    req.error(563, err.message);
                    return;
                }
            }
        }

        // Get the sales order items
        const salesOrders = asArray(orders).filter(order => order.salesOrder).map(order => order.salesOrder);
        let salesOrderItems = [];
        if (salesOrders && Array.isArray(salesOrders) && salesOrders.length > 0) {
            try {
                salesOrderItems = await API_SALES_ORDER_SRV.run(
                    SELECT
                        .columns(item => {
                            item.SalesOrder.as('salesOrder'),
                                item.SalesOrderItem.as('salesOrderItem'),
                                item.BillingDocumentDate.as('billingDate'),
                                item.UserStatusShortName.as('invoiceBlockStatus')
                        })
                        .from(A_SalesOrderItem)
                        .where`SalesOrder in ${salesOrders}`
                        .orderBy`SalesOrder, SalesOrderItem`);
                for (let item of salesOrderItems) {
                    item.salesOrder = item.salesOrder.padStart(10, '0')
                    item.salesOrderItem = item.salesOrderItem.padStart(6, '0')
                };
            } catch (err) {
                console.error(err);
                req.error(563, err.message);
                return;
            }
        }

        /**
         * Check ONE LAST TIME that there isn't already a sales order in S4 for this chassis.
         * This can happen when CPI has already started processing one order message and 
         * has already finished saving it into S4 but is delayed calling the markSaved action
         * (like when the service is temporarily down or unreachable) and then a second
         * message comes in for the same order then CPI can pick up this second message
         * and - since it will look like a new order - create another sales order.
         */
        if (msgOrdersSelect.includesColumn('salesOrder')) {
            const checkOrderIds = asArray(orders).filter(order => !order.salesOrder).map(order => order.ID);
            if (checkOrderIds.length > 0) {
                const previousOrders = await
                    SELECT
                        .columns(col => {
                            col.newerMessage_ID
                        })
                        .from(MsgOrders)
                        .where({
                            newerMessage_ID: { in: checkOrderIds }, and: {
                                orderSaved: false
                            }
                        });
                const materials = asArray(orders).filter(order => !order.salesOrder && previousOrders.some(prev => prev.newerMessage_ID === order.ID)).map(order => order.material);
                let salesOrders = [];
                if (materials.length > 0) {
                    try {
                        const ChassisList = require('./ChassisList');
                        const chassisList = new ChassisList();
                        salesOrders = await chassisList.getSalesOrdersForMultiple(materials);
                        for (let order of asArray(orders).filter(order => !order.salesOrder && previousOrders.some(prev => prev.newerMessage_ID === order.ID))) {
                            const salesOrder = salesOrders.find(salesOrder => salesOrder.material === order.material);
                            if (salesOrder) order.salesOrder = salesOrder.salesOrder;
                        };
                    } catch (err) {
                        console.error(err);
                        req.error(563, err.message);
                        return;
                    }
                }
            }
        }

        // Sometimes we get an update to a split so quickly that the sales order has been
        // saved but database commit in S4 has not yet completed, so we get an empty array []
        // (not null) in the deleteItems field.  When this happens, we must recalculate
        // deleteItems to avoid creating duplicate chassis orders.
        if (msgOrdersSelect.includesColumn('deleteItems')) {
            for (let order of asArray(orders).filter(order =>
                order.action === 'Split' &&
                order.salesOrder &&
                order.Chassis &&
                Array.isArray(order.Chassis) &&
                order.Chassis.length > 0 &&
                order.deleteItems &&
                Array.isArray(order.deleteItems) &&
                order.deleteItems.length === 0)) {

                // Calculate the deleteItems array
                order.deleteItems = salesOrderItems
                    .filter(item =>
                        !order.Chassis.some(chassis =>
                            chassis.salesOrderItem === item.salesOrderItem
                        )
                    )
                    .map(item => {
                        return { salesOrderItem: item.salesOrderItem };
                    });

                // Update the newly calculated deleteItems in the database
                if (order.deleteItems && Array.isArray(order.deleteItems) && order.deleteItems.length > 0) {
                    try {
                        await UPDATE(MsgOrders, order.ID).with({ deleteItems: order.deleteItems });
                    } catch (err) {
                        console.error(err);
                        req.error(564, err.message);
                        return false;
                    }
                };

            };
        };

        //
        // Get material characteristics
        //
        let matClass = [];
        if (msgOrdersSelect.expands.Chassis?.includesColumn('materialClass')) {

            // Get list of materials
            const materials = utility
            .getUnique(asArray(orders)
                .filter(order => (order.Chassis && Array.isArray(order.Chassis) && order.Chassis.length > 0))
                .flatMap(order => order.Chassis.map(chassis => ({ "material": chassis.material }))),
                'material');

            if (materials.length > 0) {

                // Connect to the material classification service
                const API_CLFN_PRODUCT_SRV = await cds.connect.to('API_CLFN_PRODUCT_SRV');
                const { A_ProductCharcValue } = API_CLFN_PRODUCT_SRV.entities;

                // Get all characteristics for all materials in packets since there is a limit to the statement size
                // and/or the number of parameters that are accepted.  Fetching in packets balances the number of SELECT
                // statements so we don't send one SELECT for each material, but we also don't exceed the limits.
                while (materials.length > 0) {
                    const matListSub = materials.splice(0, 1000);
                    try {
                        const matClassSub = await API_CLFN_PRODUCT_SRV.run(
                            SELECT`
                                Product,
                                CharcValue,
                                CharcFromDate,
                                Characteristic,
                                CharcDataType`
                                .from(A_ProductCharcValue)
                                .where`
                                Product in ${matListSub}`
                        );
                        matClass.push(...matClassSub); // ... is spread syntax which expands the array so its elements can be pushed to the end of the existing array
                    } catch (err) {
                        console.error(err);
                        req.error(545, err.message);
                        return;
                    }
                }
            }
        }

        // Get mapping from base models to sales model families - there are only 36 records so just get them all since CPI retrieves 100 orders at a time * fleetQty
        let baseModels;
        if (msgOrdersSelect.expands.Chassis?.includesColumn('materialClass')) {
            try {
                baseModels = await SELECT`divisionCd, baseModelCd, salesModelFamily`.from(BaseModel);
            } catch (err) {
                console.error(err);
                req.error(546, err.message);
                return;
            }
        }

        // Get country per dealer: if the customer didn't exist in S4 at the time the order message came
        // in then the country will be blank and the sales org will be defaulted to 1010.
        let dealerAddresses = [];
        if (msgOrdersSelect.includesColumn('soldToCountry') || msgOrdersSelect.includesColumn('salesOrg')) {
            const dealers = utility.getUnique(asArray(orders).filter(order => !order.soldToCountry || order.soldToCountry === ' ').map(order => ({ dealerCd: order.dealerCd })), 'dealerCd');
            try {
                dealerAddresses = await bp.getAddressForMultiple(dealers);
            } catch (err) {
                console.error(err);
                req.error(518, err.message);
                throw err;
            }
        }

        // Iterate through the orders in the array
        for (let order of asArray(orders)) {

            // If a customer hasn't been created yet when an order for that dealerCd comes in then soldToCountry will be blank
            // since it couldn't be found in S4.  Check if the customer exists yet and if so update soldToCountry.
            if (msgOrdersSelect.includesColumn('soldToCountry') && (!order.soldToCountry || order.soldToCountry === ' ')) {
                order.soldToCountry = (dealerAddresses.find(address => address.customer === order.dealerCd))?.country;
            }

            // Similarly, the salesOrg will be blank or wrong because there was no soldToCountry.
            if (msgOrdersSelect.includesColumn('salesOrg') && order.soldToCountry && order.soldToCountry !== ' ') {

                // Check if the already assigned salesOrg is right
                const checkSalesOrg = utility.getSalesOrg(order.soldToCountry);

                if (!order.salesOrg || order.salesOrg !== checkSalesOrg) {
                    order.salesOrg = checkSalesOrg;
                    try {
                        await UPDATE(MsgOrders, order.ID).with({ soldToCountry: order.soldToCountry, salesOrg: order.salesOrg });
                    } catch (err) {
                        console.error(err);
                        req.error(565, err.message);
                        return false;
                    }
                }

            }

            //Calculate order status and criticality based on save state and number of times processed
            //so that the order status will show up in green/yellow/red in Fiori
            if (msgOrdersSelect.includesColumn('orderStatus') || msgOrdersSelect.includesColumn('orderCriticality')) {
                if (order.orderSaved === true && order.current === true) {
                    if (msgOrdersSelect.includesColumn('orderStatus')) order.orderStatus = "Saved/Current";
                    if (msgOrdersSelect.includesColumn('orderCriticality')) order.orderCriticality = 3; //Positive (green)
                } else if (order.orderSaved === true) {
                    if (msgOrdersSelect.includesColumn('orderStatus')) order.orderStatus = "Saved/Superseded";
                    if (msgOrdersSelect.includesColumn('orderCriticality')) order.orderCriticality = 3; //Positive (green)
                } else if (order.timesProcessed === 0) {
                    if (msgOrdersSelect.includesColumn('orderStatus')) order.orderStatus = "New";
                    if (msgOrdersSelect.includesColumn('orderCriticality')) order.orderCriticality = 2; //Critical (yellow)
                } else {
                    if (msgOrdersSelect.includesColumn('orderStatus')) order.orderStatus = "Error";
                    if (msgOrdersSelect.includesColumn('orderCriticality')) order.orderCriticality = 1; //Negative (red)
                }
            }

            if (order.Chassis) {
                for (let chassis of order.Chassis) {

                    // Fill virtual Chassis.salesOrder
                    if (msgOrdersSelect.expands.Chassis?.includesColumn('salesOrder')) chassis.salesOrder = order.salesOrder;

                    // Fill virtual Chassis.updateIndicator
                    if (msgOrdersSelect.expands.Chassis?.includesColumn('updateIndicator'))
                        chassis.updateIndicator = (salesOrderItems.some(item => item.salesOrder === order.salesOrder && item.salesOrderItem === chassis.salesOrderItem))
                            ? 'U' // (U)pdate when item already exists in S4
                            : 'I'; // (I)nsert when it doesn't e.g. due to unexpected deletion

                    // Fill virtual Chassis.billingDate
                    if (msgOrdersSelect.expands.Chassis?.includesColumn('billingDate') || msgOrdersSelect.expands.Chassis?.includesColumn('invoiceBlockStatus')) {
                        const chassisMsg = chassisMsgs.find(msg => msg.divisionCd === order.divisionCd && msg.DTPOControlNumber === order.DTPONumber && msg.chassisNo === chassis.chassisNo);
                        const salesOrderItem = salesOrderItems.find(item => item.salesOrder === order.salesOrder && item.salesOrderItem === chassis.salesOrderItem);
                        // Default to BLCK
                        if (msgOrdersSelect.expands.Chassis?.includesColumn('invoiceBlockStatus') && !chassis.invoiceBlockStatus) chassis.invoiceBlockStatus = 'BLCK';
                        // Use the values from the chassis message first, if found.
                        if (chassisMsg) {
                            if (msgOrdersSelect.expands.Chassis?.includesColumn('invoiceBlockStatus')) chassis.invoiceBlockStatus = chassisMsg.action;
                            if (msgOrdersSelect.expands.Chassis?.includesColumn('billingDate')) chassis.billingDate = chassisMsg.invoiceQueueDt;
                            // Otherwise, use the values from S4, if found.
                        } else if (salesOrderItem) {
                            if (msgOrdersSelect.expands.Chassis?.includesColumn('invoiceBlockStatus')) chassis.invoiceBlockStatus = salesOrderItem.invoiceBlockStatus;
                            if (msgOrdersSelect.expands.Chassis?.includesColumn('billingDate')) chassis.billingDate = salesOrderItem.billingDate;
                        }
                    }

                    // Add the existing characteristics and values for this material
                    if (msgOrdersSelect.expands.Chassis?.includesColumn('materialClass')) {
                        chassis.materialClass = matClass
                            .filter(m => m.Product === chassis.material)
                            .map((c) => {
                                return {
                                    characteristic: c.Characteristic,
                                    value: (c.CharcDataType === 'DATE')
                                        ? c.CharcFromDate.substring(5, 7) + '/' + c.CharcFromDate.substring(8, 10) + '/' + c.CharcFromDate.substring(0, 4)
                                        : c.CharcValue,
                                };
                            });

                        // Update the material classification characteristic values from the order
                        const charMake = order.divisionCd === "K" ? "KENWORTH TRUCKS" : order.divisionCd === "P" ? "PETERBILT TRUCKS" : order.divisionCd;
                        updateCharacteristic(chassis.materialClass, "MAKE", charMake);
                        updateCharacteristic(chassis.materialClass, "MODELCODE", order.modelCd ?? '');
                        updateCharacteristic(chassis.materialClass, "MODELDESCRIPTION", order.std_des ?? '');
                        updateCharacteristic(chassis.materialClass, "CC-MODEL", order.costModelCd ?? '');
                        updateCharacteristic(chassis.materialClass, "CLASS", order.class ?? '');
                        updateCharacteristic(chassis.materialClass, "PRODUCT_TYPE", order.productType ?? '');
                        const salesModelFamily = (baseModels.find(b => (b.divisionCd === order.divisionCd) && (b.baseModelCd === order.modelCd)) ?? { salesModelFamily: "" }).salesModelFamily;
                        updateCharacteristic(chassis.materialClass, "SALESMODELFAMILY", salesModelFamily ?? '');
                        updateCharacteristic(chassis.materialClass, "ENGINE_TYPE", order.engineType ?? '');
                        updateCharacteristic(chassis.materialClass, "CAB_WIDTH", order.cabWidth ?? '');
                        updateCharacteristic(chassis.materialClass, "CAB_TYPE", order.cabType ?? '');
                        updateCharacteristic(chassis.materialClass, "CAR_NUMBER", order.CARNumber ?? '');
                        updateCharacteristic(chassis.materialClass, "MARKETING_NUMBER", order.promoProgCd ?? '');
                        updateCharacteristic(chassis.materialClass, "PROMOTIONS", order.promoCodes ?? '');
                        updateCharacteristic(chassis.materialClass, "CANCEL_REPLACE_CODE", order.cancellationReplacement ?? '');
                        updateCharacteristic(chassis.materialClass, "MARKETING_CLASS", order.marketingClass ?? '');
                    }
                }
            }
        }
    });

    // Set "current" to false in all order tables so that we can use it for data tiering by creating
    // column-loadable partitions where current = true and page-loadable partitions where current = false.
    srv.on("setCurrent", async (req) => {
        await UPDATE(MsgOrders).with({ current: req.data.current, newerMessage_ID: req.data.newerMessageId }).where`ID in ${req.data.orderIds}`;
        await UPDATE(MsgOptions).set`current = ${req.data.current}`.where`order_ID in ${req.data.orderIds}`;
        const options = SELECT`ID`.from(MsgOptions).where`order_ID in ${req.data.orderIds}`;
        await UPDATE(Ranges).set`current = ${req.data.current}`.where`option_ID in ${options}`;
        await UPDATE(Narratives).set`current = ${req.data.current}`.where`order_ID in ${req.data.orderIds}`;
        await UPDATE(Chassis).set`current = ${req.data.current}`.where`order_ID in ${req.data.orderIds}`;
        return true;
    });

    /*---------------------------------------------------------------------
      CHASSIS
     
      Note: "Chassis" should have been a separate service, and then all of
            these event handlers would go in their own file, but they were
            included in the same "manage" service so the handlers are included
            here.  In order to modularize the code, and keep the size of this
            file down, all the code for these event handlers is contained in
            functions in a separate chassis.js module.
    ---------------------------------------------------------------------*/
    srv.before("CREATE", "ChassisFiles", async (req) => {
        const chassis = require("./chassis");
        return await chassis.beforeCreateChassisFiles(srv, req, API_SALES_ORDER_SRV, A_SalesOrderItem);
    });

    // Process chassis file CSV
    srv.on("process", "ChassisFilesCSV", async (req) => {
        const chassis = require("./chassis");
        return await chassis.onProcessChassisCSV(srv, req, ChassisFilesCSV, ChassisFiles, API_SALES_ORDER_SRV, A_SalesOrderItem);
    });

    srv.on("truncateChassisFiles", async (req) => {
        await DELETE.from(ChassisFiles).where`divisionCd = ${req.data.divisionCd}`;
        return true;
    });

    srv.on("archiveChassisFiles", async (req) => {
        const chassis = require("./chassis");
        return await chassis.onArchiveChassisFiles(req, db);
    });

    srv.on("prepareChassisParallel", async (req) => {
        const chassis = require("./chassis");
        return await chassis.onPrepareChassisParallel(req, db);
    });

    srv.on("getNextChassisPacket", async (req) => {
        const chassis = require("./chassis");
        return await chassis.onGetNextChassisPacket(req, ChassisFiles);
    });

    srv.on("getOldestChassisError", async (req) => {
        const chassis = require("./chassis");
        return await chassis.onGetOldestChassisError(req, ChassisFiles);
    });

    // Handle updateChassisFiles
    srv.on("updateChassisFiles", async (req) => {
        for (let chassis of req.data.chassisFiles) {
            try {
                await UPDATE(ChassisFiles, chassis.ID).with({
                    materialSaved: chassis.materialSaved,
                    salesOrderSaved: chassis.salesOrderSaved,
                    timesProcessed: chassis.timesProcessed,
                    businessError: chassis.businessError,
                    materialReturn_TYPE: chassis.materialReturn_TYPE,
                    materialReturn_ID: chassis.materialReturn_ID,
                    materialReturn_NUMBER: chassis.materialReturn_NUMBER,
                    materialReturn_MESSAGE: chassis.materialReturn_MESSAGE,
                    materialReturn_LOG_NO: chassis.materialReturn_LOG_NO,
                    materialReturn_LOG_MSG_NO: chassis.materialReturn_LOG_MSG_NO,
                    materialReturn_MESSAGE_V1: chassis.materialReturn_MESSAGE_V1,
                    materialReturn_MESSAGE_V2: chassis.materialReturn_MESSAGE_V2,
                    materialReturn_MESSAGE_V3: chassis.materialReturn_MESSAGE_V3,
                    materialReturn_MESSAGE_V4: chassis.materialReturn_MESSAGE_V4,
                    materialReturn_PARAMETER: chassis.materialReturn_PARAMETER,
                    materialReturn_ROW: chassis.materialReturn_ROW,
                    materialReturn_FIELD: chassis.materialReturn_FIELD,
                    materialReturn_SYSTEM: chassis.materialReturn_SYSTEM,
                    salesOrderReturns: chassis.salesOrderReturns,
                });
            } catch (err) {
                console.error(err);
                req.error(538, err.message);
                return false;
            }
        }
        return true;
    });

    /*---------------------------------------------------------------------
      RECON
     
      Note: "Recon" should have been a separate service... but it's not.
    ---------------------------------------------------------------------*/
    // Transform OPS recon file for comparison to S4
    srv.before("CREATE", "ReconFiles", async (req) => {
        const recon = require("./recon");
        return await recon.beforeCreateReconFiles(req);
    });

    // Process recon file CSV
    srv.on("process", "ReconFilesCSV", async (req) => {
        const recon = require("./recon");
        return await recon.onProcessReconFilesCSV(req, ReconFiles, ReconFilesCSV);
    });

    // Handle truncateRecon action.  This is an unbound action since it must act on the data set
    // as a whole rather than a single record (as a bound action would do).  Files are processed
    // in CPI per division, so this action deletes records associated with a single division code
    // at a time rather than truncating the whole table.
    srv.on("truncateRecon", async (req) => {
        await DELETE.from(ReconFiles).where`divisionCd = ${req.data.divisionCd}`;
        return true;
    });

    /*---------------------------------------------------------------------
      OTHER
    ---------------------------------------------------------------------*/
    srv.on("truncateFreight", async (req) => {
        await DELETE.from(MDFreight).where`divisionCd = ${req.data.divisionCd}`;
        return true;
    });

    srv.on("truncatePromoCodes", async (req) => {
        await DELETE.from(PromoCodes).where`divisionCd = ${req.data.divisionCd}`;
        return true;
    });

});

function updateCharacteristic(matClassArr, char, val) {
    const idx = matClassArr.findIndex((mc) => mc.characteristic === char);
    if (idx > -1) {
        matClassArr[idx].value = val;
    } else {
        matClassArr.push({ characteristic: char, value: val });
    }
}
