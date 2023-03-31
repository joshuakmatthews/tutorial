const cds = require("@sap/cds");
const utility = require("./utility");

async function doSplit(srv, req, MsgOrders, MsgSplits, MsgOptions, Ranges, Narratives, Chassis, API_SALES_ORDER_SRV, A_SalesOrderItem) {

    //
    // SPLIT ORDER SCENARIO
    //
    // Important considerations:
    // - An order can be split into multiple ranges all at once, e.g. 1-10 can be split into 1-4, 5, 6-10.
    // - Once a chassis is added to a DTPO it will always stay on it, even after a split.  That means
    //   there can be multiple orders with the same DTPO because they were originally all part of a
    //   single order, then split later.
    // - A message with Action "Split" will be sent for the NEW ranges only, e.g. 5 and 6-10.
    // - A message for the original, delimited range will NOT be sent, e.g. there will NOT be a message
    //   for range 1-4.
    // - A split does not change an order, but there will almost always be UpdateNAMSOrder messages coming
    //   immediately afterwards because they're splitting an order to make changes to some of the chassis
    //   and not the others.
    // - It's possible to receive an UpdateNAMSOrder message for a new split range prior to receiving
    //   the split message itself.
    // - The splits will carry over all the values from the order before the split such as change order
    //   number, but after splitting each range will be independent of each other.  E.g. if the original
    //   order was at change order 16, then the new ranges of 1-4, 5 and 6-10 would also all start of change
    //   order 16, but then if a change was made to range 6-10 its change order would increment to 17 while
    //   the others stayed back at 16.

    let newSplit = req.data;

    // Check if this split was already forced by an update that arrived out-of-sequence (too soon, "update before split" scenario)
    let alreadySplit;
    try {
        alreadySplit = await SELECT.one.from(MsgOrders)
            .where`
                divisionCd      = ${newSplit.divisionCd} and
                DTPONumber      = ${newSplit.DTPONumber} and
                chassisNo       = ${newSplit.chassisNo} and
                startingChassis = ${newSplit.startingChassis} and
                endingChassis   = ${newSplit.endingChassis}`;
    } catch (err) {
        console.error(err);
        req.error(533, err.message);
        return;
    }

    if (alreadySplit) {
        newSplit.completed = true;
        newSplit.completedAt = new Date(Date.now()).toJSON();
        newSplit.splitAfterUpdate = true;
        try {
            await INSERT.into(MsgSplits, [newSplit]);
        } catch (err) {
            console.error(err);
            req.error(534, err.message);
            return;
        }
        req.reply(newSplit);
        return;
    }

    // Split action
    // Find the order this was split from.  We match the endingChassis number because
    // we need to start splitting from the end of the range so we can delimit the order
    // that came before each split.
    let splitFromOrder;
    try {
        splitFromOrder = await SELECT.one.from(MsgOrders)
            .where`
                divisionCd    = ${newSplit.divisionCd} and
                DTPONumber    = ${newSplit.DTPONumber} and
                endingChassis = ${newSplit.endingChassis} and
                current       = true`;
    } catch (err) {
        console.error(err);
        req.error(504, err.message);
        return;
    }

    // If no match was found then we'll put it into a queue to check later since
    // that means one of the following situations has occurred:
    //   1) The insert/update order message hasn't arrived from Biztalk yet.
    //   2) This starting/ending chassis range falls in the middle of the previous
    //      range so we need to wait for other split messages to arrive to fill out the
    //      rest of the range.
    if (splitFromOrder === null) {
        newSplit.completed = false;
        newSplit.updateBeforeSplit = false;
        newSplit.splitAfterUpdate = false;
        try {
            await INSERT.into(MsgSplits, [newSplit]);
        } catch (err) {
            console.error(err);
            req.error(505, err.message);
            return;
        }
        req.reply(newSplit);
        return;

        // If we found the matching order message then we need to generate an order message
        // for the original order in order to delimit the endingChassis, e.g. range 1-4.
        //   1) Copy the previous order, options, chassis, ranges and narratives.
        //   2) Delimit the endingChassis to be 1 less than the new range starting chassis
        //   3) Reset orderSaved to false and timesProcessed to 0 since this is a new
        //      order message.
    } else {

        /**
         * "Expand" the Options, Narratives, Chassis and Ranges
         */
        try {
            splitFromOrder.Options = await SELECT.from(MsgOptions).where`order_ID = ${splitFromOrder.ID}`;
            splitFromOrder.Narratives = await SELECT.from(Narratives).where`order_ID = ${splitFromOrder.ID}`;
            splitFromOrder.Chassis = await SELECT.from(Chassis).where`order_ID = ${splitFromOrder.ID}`;
        } catch (err) {
            console.error(err);
            req.error(507, err.message);
            return;
        }

        // Get unique option IDs
        const opid = utility.getUnique(splitFromOrder.Options, 'ID');

        // Get the option ranges
        let ranges = [];
        try {
            ranges = await SELECT.from(Ranges).where`option_ID in ${opid}`;
        } catch (err) {
            console.error(err);
            req.error(508, err.message);
            return;
        }

        /**
         * Get the sales order items from S4 so we know which items have already been billed (invoiced)
         * and which ones are blocked for invoicing (BLCK vs DELS).
         */
        let salesOrderItems = [];
        if (splitFromOrder.salesOrder) {
            try {
                salesOrderItems = await API_SALES_ORDER_SRV.run(
                    SELECT.from(A_SalesOrderItem, (item) => {
                        item.SalesOrderItem.as('salesOrderItem'),
                            item.Material.as('material'),
                            item.OrderRelatedBillingStatus.as('billingStatus'),
                            item.BillingDocumentDate.as('billingDate'),
                            item.UserStatusShortName.as('invoiceBlockStatus'),
                            item.to_SalesOrder(order => {
                                order.HeaderBillingBlockReason.as('billingBlockCd')
                            })
                    })
                        .where`
                        SalesOrder = ${splitFromOrder.salesOrder}`
                        .orderBy`
                        SalesOrderItem`);
                for (let item of salesOrderItems) item.salesOrderItem = item.salesOrderItem.padStart(6, '0');
            } catch (err) {
                console.error(err);
                req.error(506, err.message);
                return;
            }
        }

        // Connect to ChassisMsgService
        const ChassisMsgService = await cds.connect.to("ChassisMsgService");
        const { Messages: ChassisMsgs } = ChassisMsgService.entities;

        // Get list of chassisNo to use in where clause
        const listOfChassis = splitFromOrder.Chassis.map(c => c.chassisNo);

        // Get billingDate and invoiceBlockStatus from chassis messages
        let chassisMsgs = [];
        try {
            chassisMsgs = await SELECT
                .from(ChassisMsgs)
                .where`
                    divisionCd = ${splitFromOrder.divisionCd} and
                    DTPOControlNumber = ${splitFromOrder.DTPONumber} and
                    chassisNo in ${listOfChassis} and
                    action = 'DELS'`
                .orderBy`
                    chassisNo,
                    createTimestamp desc`;
        } catch (err) {
            console.error(err);
            req.error(540, err.message);
            return;
        }

        /**
         * Make sure we have a record in salesOrderItems for every chassis, constructing
         * missing ones where necessary.
         */
        for (let chassis of splitFromOrder.Chassis) {
            const chassisMsg = chassisMsgs.find(msg => msg.divisionCd === splitFromOrder.divisionCd && msg.DTPOControlNumber === splitFromOrder.DTPONumber && msg.chassisNo === chassis.chassisNo);
            const salesOrderItem = salesOrderItems.find(item => item.material.substring(0, 6) === chassis.chassisNo);
            // Default to BLCK
            if (!chassis.invoiceBlockStatus) chassis.invoiceBlockStatus = 'BLCK';
            // Use the values from the chassis message first, if found.
            if (chassisMsg) {
                chassis.invoiceBlockStatus = chassisMsg.action;
                chassis.billingDate = chassisMsg.invoiceQueueDt;
                if (salesOrderItem) {
                    salesOrderItem.invoiceBlockStatus = chassis.invoiceBlockStatus;
                    salesOrderItem.billingDate = chassis.billingDate;
                }
            // Otherwise, use the values from S4, if found.
            } else if (salesOrderItem) {
                chassis.invoiceBlockStatus = salesOrderItem.invoiceBlockStatus;
                chassis.billingDate = salesOrderItem.billingDate;
            }
            
            if (!salesOrderItem) {
                salesOrderItems.push({
                    salesOrderItem: chassis.salesOrderItem,
                    material: chassis.material,
                    chassisNo: chassis.chassisNo,
                    billingStatus: "",  // The sales order doesn't even exist so it can't possibly be invoiced
                    billingDate: chassis.billingDate,
                    invoiceBlockStatus: chassis.invoiceBlockStatus,
                });
            }
        }

        // Get any other splits on the same order that are waiting in the queue, e.g.:
        // Original order range: 1.......9
        // Queued split range  :  2..5
        // This split range    :      6..9
        let queuedSplits;
        try {
            queuedSplits = await SELECT.from(MsgSplits)
                .where`
                    divisionCd      =  ${newSplit.divisionCd} and
                    DTPONumber      =  ${newSplit.DTPONumber} and
                    startingChassis >= ${splitFromOrder.startingChassis} and
                    endingChassis   <= ${newSplit.endingChassis} and
                    completed       =  false`
                .orderBy`endingChassis desc`;
        } catch (err) {
            console.error(err);
            req.error(509, err.message);
            return;
        }

        // We only want to process splits in the queue that form an unbroken sequence of start/end
        // chassis numbers, so find what the end chassis number should be - if there is one -
        // that would come before this split order.  E.g.:
        //      Original order range: 1.......9
        //      Queued split range  :  2.4
        //      This split range    :      6..9
        // Range 2-4 is in the queue, but the split for 5 is not in the queue yet, so only the current
        // split of 6..9 should be processed.
        let expectedEndingChassis = utility.getChassisOffset(newSplit.startingChassis, -1);

        // Iterate through the split queue
        for (let i = 0; i < queuedSplits.length; i++) {
            // Check that the end chassis comes directly before the start chassis
            if (queuedSplits[i].endingChassis !== expectedEndingChassis) {
                // If not, then skip this and all earlier split ranges by removing them from the array
                queuedSplits.splice(i);
                break;
            }
            // Calculate what the next previous chassis number would be.
            expectedEndingChassis = utility.getChassisOffset(queuedSplits[i].startingChassis, -1);
        }

        // Add the new split to the top of the list
        queuedSplits.splice(0, 0, newSplit);

        // Generate the "missing" split range
        let missingSplit = {
            ID: utility.uuidv4(), // The UUID is already in use by the splitFromOrder
            createdAt: newSplit.createdAt,
            createdBy: newSplit.createdBy,
            modifiedAt: newSplit.modifiedAt,
            modifiedBy: newSplit.modifiedBy,
            changeOrderNo: splitFromOrder.changeOrderNo,
            chassisNo: splitFromOrder.chassisNo,
            createTimestamp: queuedSplits[queuedSplits.length - 1].createTimestamp,
            divisionCd: splitFromOrder.divisionCd,
            DTPONumber: splitFromOrder.DTPONumber,
            endingChassis: utility.getChassisOffset(queuedSplits[queuedSplits.length - 1].startingChassis, -1),
            messageType: splitFromOrder.messageType,
            orderAddDt: splitFromOrder.orderAddDt,
            orderType: splitFromOrder.orderType,
            plantCd: splitFromOrder.plantCd,
            startingChassis: splitFromOrder.startingChassis,
            // OPS processing status comes from the first chassis, so we should carry it over to this "missing" split that contains the first chassis
            procesingStatusCd: splitFromOrder.procesingStatusCd,
            // Change order charge should only be applied to the first chassis in the entire fleet (across split orders) so it needs to stay with item 10, too
            chngOrdChrg: splitFromOrder.chngOrdChrg,
        };
        // Add the missing split range to the bottom of the list
        queuedSplits.splice(queuedSplits.length, 0, missingSplit);

        // Consolidate the already-invoiced line items onto one split which we'll call the "bill collector".
        // The "bill collector" can keep it's full range of starting to ending chassis numbers.  Other
        // already-billed chassis will be moved from their existing ranges to this collector, leaving behind
        // unbilled items since we'll likely continue to receive update order messages for them.  We do this
        // in chassis (reverse array) order since that matches the typical business process of invoicing
        // fleets in chassis order.
        let billCollector;
        for (let i = queuedSplits.length - 1; i >= 0; i--) {
            let thisSplit = queuedSplits[i];
            // CNCL (cancelled) and all of the hold statuses (16CH, 16RH and ICOH) all apply to the whole order, so retain the statuses on split-off ranges, too
            if (['CNCL', '16CH', '16RH', 'ICOH'].some(opsStatus => opsStatus === splitFromOrder.procesingStatusCd)) thisSplit.procesingStatusCd = splitFromOrder.procesingStatusCd;

            // Move chassis from the split-from order to the correct split-off order
            thisSplit.Chassis = [];
            for (let chassis of splitFromOrder.Chassis.filter(function (chassis) {
                // If this is the "missing split" i.e. the one that includes the start of the range,
                // then we want to loop through all chassis on the split-from order up to the
                // endingChassis of this split range, which may include chassis numbers that occur
                // BEFORE the startingChassis (in case of gaps).
                if (thisSplit.startingChassis === splitFromOrder.startingChassis) {
                    return Number(chassis.chassisNo) <= Number(thisSplit.endingChassis);
                    // If this is the last (or only) split of the queue, i.e. the one that includes the
                    // end of the range, then we want to loop through all chassis on the split-from order
                    // from the startingChassis onward, which may include chassis numbers that occur
                    // AFTER the endingChassis (in case of gaps).
                } else if (thisSplit.endingChassis === splitFromOrder.endingChassis) {
                    return Number(chassis.chassisNo) >= Number(thisSplit.startingChassis);
                    // Otherwise, this is a split that was in the queue and falls in the middle of the
                    // split-from order range, so we want to just loop through all the chassis on the
                    // split-from order from starting to endingChassis.
                } else {
                    return Number(chassis.chassisNo) >= Number(thisSplit.startingChassis) &&
                        Number(chassis.chassisNo) <= Number(thisSplit.endingChassis);
                }
            })) {
                // Add the chassisNo to its corresponding split, unless it was already billed in
                // S4, in which case all such billed items must be kept on one sales order together,
                // which I lovingly call the "bill collector".  This will create gaps in chassis
                // ranges, and result in chassis added to splits before or after their corresponding
                // starting/ending ranges.  Wonderful.
                const salesOrderItem = salesOrderItems.find(item => item.material.substring(0, 6) === chassis.chassisNo);

                const newChassis = {
                    salesOrderItem: chassis.salesOrderItem,
                    material: chassis.material,
                    chassisNo: chassis.chassisNo,
                    billingDate: chassis.billingDate,
                    invoiceBlockStatus: chassis.invoiceBlockStatus,
                    order_ID: thisSplit.ID,
                    current: true,
                };

                if (salesOrderItem.billingStatus === 'C') {
                    // This split has the lowest-numbered, already-billed chassis so it becomes the "bill collector"
                    if (!billCollector) billCollector = thisSplit;

                    // Add this already-billed chassis to the bill collector
                    billCollector.Chassis.push(newChassis);

                } else {
                    // Add this not-yet billed chassis to the split
                    thisSplit.Chassis.push(newChassis);
                }
            }
        }

        // Adjust the fleet fields after moving chassis around
        // NOTE: Leave the chassisNo/startingChassis/endingChassis alone so they will match
        // future split and/or update order messages.  If we mess with them then the split
        // logic will likely mistakenly put a split into the queue if there is gap.
        for (let thisSplit of queuedSplits) {
            // All chassis were moved off this split
            if (thisSplit.Chassis.length === 0) {
                thisSplit.merged = true; // Set it to "merged" so we know not to process it later
            } else {
                thisSplit.fleetQty = Number(thisSplit.endingChassis) - Number(thisSplit.startingChassis) + 1;
                thisSplit.fleetGap = thisSplit.Chassis.length !== thisSplit.fleetQty;
            }
        }

        // If no "bill collector" split was identified then default it to the "missing" split
        if (!billCollector) billCollector = queuedSplits[queuedSplits.length - 1];

        // The bill collector needs to be the only split with action = Split, the existing sales
        // order number, and the deleteItems array filled since CPI will use this as the trigger
        // to remove the line items in deleteItems from the sales order.  All other split-off
        // orders will create new sales orders.
        for (let split of queuedSplits) delete split.action; // Remove "Split" action from all splits
        billCollector.action = 'Split'; // Add "Split" action to just the bill collector
        billCollector.salesOrder = splitFromOrder.salesOrder;

        // If the split-from order wasn't saved yet (orderSaved = false) then its deleteItems wouldn't
        // have been removed from the S4 sales order yet, so we'll need to retain them.
        const itemCompare = (utility.getUnique(
            ((salesOrderItems && Array.isArray(salesOrderItems)) ? salesOrderItems.map(item => ({ salesOrderItem: item.salesOrderItem })) : []).concat(
                ((splitFromOrder.deleteItems && Array.isArray(splitFromOrder.deleteItems)) ? splitFromOrder.deleteItems.map(item => ({ salesOrderItem: item.salesOrderItem })) : [])), 'salesOrderItem')).sort();
        billCollector.deleteItems = itemCompare
            .filter(item =>
                !billCollector.Chassis.some(chassis =>
                    chassis.salesOrderItem === item
                )
            )
            .map(item => {
                return { salesOrderItem: item };
            });

        // Make sure the bill collector create timestamp is earlier than any of the other splits so that
        // CPI wil process it first and remove the chassis from the existing sales orders before trying
        // to add them to new sales orders.
        let createTimestamp = new Date(queuedSplits[0].createTimestamp);
        for (let split of queuedSplits) {
            if (split.createTimestamp < createTimestamp) createTimestamp = split.createTimestamp;
        }
        createTimestamp.setMilliseconds(createTimestamp.getMilliseconds() - 1);
        billCollector.createTimestamp = createTimestamp.toJSON();

        // Mark the original order as non-current
        try {
            await srv.setCurrent([splitFromOrder.ID], billCollector.ID, false);
        } catch (err) {
            console.error(err);
            req.error(510, err.message);
            return;
        }

        // Retain the billing block from the split-from order
        if (salesOrderItems[0]?.to_SalesOrder?.billingBlockCd)
            splitFromOrder.billingBlockCd = salesOrderItems[0].to_SalesOrder.billingBlockCd;

        // Iterate through all of the splits in startingChassis order (reverse array order) -- including the new split,
        // queued splits, and the "missing" split and copy them to new order messages
        let nowJSON;
        splitFromOrder.splitOrder_ID = (splitFromOrder.salesOrder || !splitFromOrder.splitOrder_ID) // Has a sales order or isn't a split of a split
            ? splitFromOrder.ID // Refer to the ID of the split-from order
            : splitFromOrder.splitOrder_ID; // The split-from order is a split itself, and is unsaved, so adopt _its_ splitOrder_ID (the so-called "grandparent" [or older]) since it is the one that will have the sales order
        for (let i = queuedSplits.length - 1; i >= 0; i--) {
            if (!queuedSplits[i].merged) { // Don't process splits that were merged into another
                nowJSON = new Date(Date.now()).toJSON();
                splitFromOrder.ID = queuedSplits[i].ID;
                splitFromOrder.createdAt = nowJSON;
                splitFromOrder.createdBy = queuedSplits[i].createdBy;
                splitFromOrder.modifiedAt = nowJSON;
                splitFromOrder.modifiedBy = queuedSplits[i].modifiedBy;
                splitFromOrder.action = queuedSplits[i].action;
                splitFromOrder.chassisNo = queuedSplits[i].chassisNo;
                splitFromOrder.material = utility.getMaterialFromChassis(queuedSplits[i].chassisNo, splitFromOrder.orderAddDt, splitFromOrder.division);
                splitFromOrder.createTimestamp = queuedSplits[i].createTimestamp;
                splitFromOrder.messageType = queuedSplits[i].messageType;
                splitFromOrder.startingChassis = queuedSplits[i].startingChassis;
                splitFromOrder.endingChassis = queuedSplits[i].endingChassis;
                splitFromOrder.fleetOrder = true; // By definition, you can only split a fleet order
                splitFromOrder.fleetQty = queuedSplits[i].fleetQty;
                splitFromOrder.deleteItems = queuedSplits[i].deleteItems;
                splitFromOrder.fleetGap = queuedSplits[i].fleetGap;
                splitFromOrder.Chassis = queuedSplits[i].Chassis;
                splitFromOrder.current = true;
                splitFromOrder.newerMessage_ID = null;
                splitFromOrder.orderSaved = false;
                splitFromOrder.timesProcessed = 0;
                // Sales order only follows the bill collector
                splitFromOrder.salesOrder = queuedSplits[i].salesOrder;
                // OPS processing status and change order fee only stay with the first chassis
                splitFromOrder.procesingStatusCd = queuedSplits[i].procesingStatusCd;
                splitFromOrder.chngOrdChrg = queuedSplits[i].chngOrdChrg ?? 0;

                for (let option of splitFromOrder.Options) {
                    let newOptionID = utility.uuidv4();
                    // Remove a couple of virtual columns
                    delete option.OPSLine1Description;
                    delete option.OPSLine2Description;
                    // Copy the ranges, too
                    option.Ranges = ranges
                        .filter(range => range.option_ID === option.ID) // Just include ranges for this option
                        .map(range => {
                            range.option_ID = newOptionID;
                            return range;
                        }); // Use the new option ID on the range
                    option.ID = newOptionID;
                    option.order_ID = splitFromOrder.ID;
                }

                for (let narrative of splitFromOrder.Narratives) {
                    narrative.ID = utility.uuidv4();
                    narrative.order_ID = splitFromOrder.ID;
                }

                try {
                    await INSERT(splitFromOrder).into(MsgOrders);
                } catch (err) {
                    console.error(err);
                    req.error(511, err.message);
                    return;
                }
            }

            // Remove queued splits from the queue (not the 1st or last item in the array, which are the new split that is not
            // in the queue, and the generated "missing" split).
            if (i !== 0 && i !== queuedSplits.length - 1) {
                try {
                    await UPDATE(MsgSplits, queuedSplits[i].ID).with({
                        completed: true,
                        completedAt: new Date(Date.now()).toJSON(),
                        merged: queuedSplits[i].merged,
                    });
                } catch (err) {
                    console.error(err);
                    req.error(512, err.message);
                    return;
                }
            }
        }

        newSplit.completed = true;
        newSplit.completedAt = new Date(Date.now()).toJSON();
        delete newSplit.deleteItems;
        delete newSplit.Chassis;
        delete newSplit.fleetGap;
        delete newSplit.salesOrder;
        delete newSplit.chngOrdChrg;
        try {
            await INSERT.into(MsgSplits, [newSplit]);
        } catch (err) {
            console.error(err);
            req.error(535, err.message);
            return;
        }
        req.reply(splitFromOrder); // Use req.reply instead of return; see https://cap.cloud.sap/docs/node.js/services#srv-on
        return;
    }

}

module.exports = doSplit;