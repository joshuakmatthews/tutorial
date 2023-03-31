const cds = require("@sap/cds");
const utility = require("./utility");

module.exports = cds.service.impl(async (srv) => {

    const ManageService = await cds.connect.to("ManageService");
    const { MsgOrders } = ManageService.entities;

    srv.on("GetMismatches", async (req) => {
        return srv.run(`
            SELECT
                DISTINCT o.id
            FROM order_msg_orders AS o
            INNER JOIN order_msg_chassis AS c ON
            	c.order_ID = o.ID
            INNER JOIN cv_ops_recon AS recon ON
                recon.division = o.division AND
                recon.chassis = c.chassisno AND
                recon.dtpo_number = o.dtponumber
            WHERE
                o.divisioncd = ? AND
                o.current = true AND
                (	recon.yn_chassis_net_price = 'N' OR
                    recon.yn_tax_amount = 'N' )`,
            [
                req.data.divisionCd
            ])
            .then(mismatches => mismatches.map(mismatch => mismatch.ID));
    });

    srv.on("RepriceMismatches", async (req) => {

        let ids = req.data.ids;
        let repricedOrders = [];

        while (ids.length > 0) {
            // Break into blocks of 1000 to stay within the limits of the where clause max length
            idsSub = ids.splice(0, 1000);
            const orders = await SELECT`
                ID,
                action,
                actualDeliveryDt,
                allocationDt,
                auxTransCd,
                bodyHgt,
                bodyLadenCpcty,
                bodyLgth,
                bodyType,
                bumperLength,
                cabAxleDimeension,
                cabEOFDimeension,
                cabLineSequenceNo,
                cabScheduleDt,
                CARAmt,
                CARNumber,
                CARPct,
                changeOrderDtTm,
                changeOrderNo,
                chasHwyPct,
                Chassis {
                    chassisNo,
                    material,
                    salesOrderItem
                },
                chassisNo,
                chassisPrevNo,
                chassisStatusComment,
                chassisSystemStatus,
                chasMetricCustmryInd,
                chasOpsClassBPct,
                chasOpsClassCPct,
                chasOpsClassDPct,
                chngOrdChrg,
                cornerRadius,
                costModelCd,
                createTimestamp,
                credInDtTm,
                credOutDtTm,
                ctrlnAxle,
                cuPoNo,
                custNo,
                customerNm,
                customerStockCd,
                dealerCd,
                deleteItems,
                divisionCd,
                dlrBasePriceAmt,
                dlrPoPresentId,
                DTPONumber,
                endingChassis,
                engineCd,
                engineClassCd,
                estimatedDeliveryDt,
                exchangeRateAmt,
                FETExemptAmt,
                FETInd,
                FETGSTCd,
                FET,
                fifthWheelCd,
                firmScheduleDt,
                fleetGap,
                fleetOrder,
                fleetQty,
                frameCd,
                frameLineSequenceNo,
                frameScheduleDt,
                frgtRateAmt,
                frontAxleBOCDimeension,
                frontAxleCd,
                frontAxleLoad,
                gawrFirstRear,
                gawrFront,
                gawrRear,
                gawrSecRear,
                gcw,
                gvwr,
                interCompDisc,
                interDivDisc,
                invcTermDays,
                kingPinSet,
                listPrice,
                mainTransCd,
                marketingFee,
                maxGradePct,
                messageType,
                modelCd,
                Narratives {
                    approvalCd,
                    cd,
                    text
                },
                noTrlrAxle,
                operAreaDesc,
                operAreaHgt,
                operAreaLgth,
                operAreaWidth,
                Options {
                    status,
                    text
                },
                orderAddDt,
                orderCancelDt,
                orderReceivedDt,
                orderSaved,
                orderType,
                plantCd,
                priceEffectiveDt,
                priceProtAmt,
                procesingStatusCd,
                prodConvChrg,
                promoAmt,
                promoProgCd,
                promoProgDesc,
                promoProgPct,
                rearAxleCd,
                rearAxleLoad,
                rearAxleRatio,
                rearAxleRatioCd,
                releaseWriter,
                requestedDeliveryDt,
                salesOrder,
                salesOrg,
                shippingDestination,
                spclRqmntCd1,
                spclRqmntCd2,
                spclRqmntCd3,
                spclRqmntCd4,
                splitOrder_ID,
                startingChassis,
                stateProvinceCd,
                statusCode,
                stdDlrDiscPct,
                surchargesNSTD,
                surchargesZH00,
                surchargesZISF,
                surchargesZMAD,
                suspensionCd,
                tentativeScheduleDt,
                tireFET,
                tireRollRadius,
                trlrHgt,
                trlrLgth,
                trlrType,
                unitTypeCd,
                warrOptAmt,
                weight,
                wheelbase`
                .from(MsgOrders)
                .where`
                current = true and
                ID in ${idsSub}`;

            repricedOrders.push(...await _reprice(cds, srv, { error: req.error, info: req.info }, ManageService, MsgOrders, orders));
        }

        return repricedOrders;

    });

});

async function _reprice(cds, srv, req, ManageService, MsgOrders, orderMsgs) {

    const { Chassis, MDFreight, MDModelDiscount, MDOptionsRanges, MsgOptions, Narratives, PromoCodes, Ranges } = ManageService.entities;

    const MapService = await cds.connect.to("MapService");
    const { SalesDocTypes, Plants } = MapService.entities;

    const API_SALES_ORDER_SRV = await cds.connect.to('API_SALES_ORDER_SRV');
    const { A_SalesOrder } = API_SALES_ORDER_SRV.entities;

    const enrichOrder = require("./enrichOrder");

    let repricedOrders = [];

    // Get the active orders
    try {

        // Selected dimensions are required by enrichOrder in order to copy from the existing order
        // Selected measures are required to determine after enrichment if any pricing changed
        //const orderMsgs = await ManageService.run(selectQuery);

        // If there were no more records to retrieve then return
        //if (orderMsgs.length === 0) {
        //    req.info("No more data");
        //    return repriceResults;
        //};

        // Reprice each active order
        for (let currentOrder of orderMsgs) {

            // Keep a copy of some of the values from the existing order for later comparison
            const currentOrderSave = {
                ID: currentOrder.ID,
                FETExemptAmt: currentOrder.FETExemptAmt,
                frgtRateAmt: currentOrder.frgtRateAmt,
                listPrice: currentOrder.listPrice,
                marketingFee: currentOrder.marketingFee,
                priceProtAmt: currentOrder.priceProtAmt,
                promoAmt: currentOrder.promoAmt,
                stdDlrDiscPct: currentOrder.stdDlrDiscPct,
                surchargesNSTD: currentOrder.surchargesNSTD,
                surchargesZH00: currentOrder.surchargesZH00,
                surchargesZISF: currentOrder.surchargesZISF,
                surchargesZMAD: currentOrder.surchargesZMAD,
                tireFET: currentOrder.tireFET,
                warrOptAmt: currentOrder.warrOptAmt,
                weight: currentOrder.weight
            };

            // Remove most of the comparison values prior to letting the standard enrichment run
            // Some are retained since they are supplied by OPS but overwritten:  priceProtAmt and stdDlrDiscPct
            delete currentOrder.FETExemptAmt;
            delete currentOrder.frgtRateAmt;
            delete currentOrder.listPrice;
            delete currentOrder.marketingFee;
            delete currentOrder.promoAmt;
            delete currentOrder.surchargesNSTD;
            delete currentOrder.surchargesZH00;
            delete currentOrder.surchargesZISF;
            delete currentOrder.surchargesZMAD;
            delete currentOrder.tireFET;
            delete currentOrder.warrOptAmt;
            delete currentOrder.weight;

            // Assing new IDs since we're not going through the POST process that would normally
            // auto-assign them through the cuid aspect of @sap/cds/common.
            currentOrder.ID = utility.uuidv4();
            for (let option of currentOrder.Options) {
                option.ID = utility.uuidv4();
                option.order_ID = currentOrder.ID;
            }
            for (let narrative of currentOrder.Narratives) {
                narrative.ID = utility.uuidv4();
                narrative.order_ID = currentOrder.ID;
            }
            for (let chassis of currentOrder.Chassis) {
                chassis.ID = utility.uuidv4();
                chassis.order_ID = currentOrder.ID;
            }

            // Enrich order with all pricing by sending it through the same processing as it
            // would go through if it arrived from OPS itself.
            await enrichOrder(
                cds,
                srv,
                { error: req.error, data: currentOrder },
                currentOrder,
                Chassis,
                API_SALES_ORDER_SRV, A_SalesOrder,
                MDFreight,
                MDOptionsRanges,
                PromoCodes,
                Plants,
                MDModelDiscount,
                SalesDocTypes
            );

            // If there is a difference in the pricing then post the new message.
            if (_pricingDifferencesExist(currentOrderSave, currentOrder)) {

                // Set the current order as not current
                try {
                    await ManageService.setCurrent([currentOrderSave.ID], currentOrder.ID, false);
                } catch (err) {
                    console.error(err);
                    req.error(501, err.message);
                    throw err;
                }

                // Just do a deep insert.  No need to do a srv.post which would go through
                // all the same enrichment we just did.
                currentOrder.orderSaved = false;
                await INSERT.into(MsgOrders, currentOrder);
                repricedOrders.push({
                    divisionCd: currentOrder.divisionCd,
                    chassisNo: currentOrder.chassisNo,
                    DTPONumber: currentOrder.DTPONumber,
                    old: {
                        ID: currentOrderSave.ID,
                        FETExemptAmt: currentOrderSave.FETExemptAmt,
                        frgtRateAmt: currentOrderSave.frgtRateAmt,
                        listPrice: currentOrderSave.listPrice,
                        marketingFee: currentOrderSave.marketingFee,
                        priceProtAmt: currentOrderSave.priceProtAmt,
                        promoAmt: currentOrderSave.promoAmt,
                        stdDlrDiscPct: currentOrderSave.stdDlrDiscPct,
                        surchargesNSTD: currentOrderSave.surchargesNSTD,
                        surchargesZH00: currentOrderSave.surchargesZH00,
                        surchargesZISF: currentOrderSave.surchargesZISF,
                        surchargesZMAD: currentOrderSave.surchargesZMAD,
                        tireFET: currentOrderSave.tireFET,
                        warrOptAmt: currentOrderSave.warrOptAmt
                    },
                    new: {
                        ID: currentOrder.ID,
                        FETExemptAmt: currentOrder.FETExemptAmt,
                        frgtRateAmt: currentOrder.frgtRateAmt,
                        listPrice: currentOrder.listPrice,
                        marketingFee: currentOrder.marketingFee,
                        priceProtAmt: currentOrder.priceProtAmt,
                        promoAmt: currentOrder.promoAmt,
                        stdDlrDiscPct: currentOrder.stdDlrDiscPct,
                        surchargesNSTD: currentOrder.surchargesNSTD,
                        surchargesZH00: currentOrder.surchargesZH00,
                        surchargesZISF: currentOrder.surchargesZISF,
                        surchargesZMAD: currentOrder.surchargesZMAD,
                        tireFET: currentOrder.tireFET,
                        warrOptAmt: currentOrder.warrOptAmt
                    }
                });
            }

        }

    } catch (err) {
        console.error(err);
        req.error(520, err.message);
        throw err;
    }

    return repricedOrders;

}

function _pricingDifferencesExist(existing, reprice) {
    if ((Number(existing.FETExemptAmt) === Number(reprice.FETExemptAmt) || (existing.FETExemptAmt === null && reprice.FETExemptAmt === null)) &&
        (Number(existing.frgtRateAmt) === Number(reprice.frgtRateAmt) || (existing.frgtRateAmt === null && reprice.frgtRateAmt === null)) &&
        (Number(existing.listPrice) === Number(reprice.listPrice) || (existing.listPrice === null && reprice.listPrice === null)) &&
        (Number(existing.marketingFee) === Number(reprice.marketingFee) || (existing.marketingFee === null && reprice.marketingFee === null)) &&
        (Number(existing.promoAmt) === Number(reprice.promoAmt) || (existing.promoAmt === null && reprice.promoAmt === null)) &&
        (Number(existing.priceProtAmt) === Number(reprice.priceProtAmt) || (existing.priceProtAmt === null && reprice.priceProtAmt === null)) &&
        (Number(existing.stdDlrDiscPct) === Number(reprice.stdDlrDiscPct) || (existing.stdDlrDiscPct === null && reprice.stdDlrDiscPct === null)) &&
        (Number(existing.surchargesNSTD) === Number(reprice.surchargesNSTD) || (existing.surchargesNSTD === null && reprice.surchargesNSTD === null)) &&
        (Number(existing.surchargesZH00) === Number(reprice.surchargesZH00) || (existing.surchargesZH00 === null && reprice.surchargesZH00 === null)) &&
        (Number(existing.surchargesZISF) === Number(reprice.surchargesZISF) || (existing.surchargesZISF === null && reprice.surchargesZISF === null)) &&
        (Number(existing.surchargesZMAD) === Number(reprice.surchargesZMAD) || (existing.surchargesZMAD === null && reprice.surchargesZMAD === null)) &&
        (Number(existing.tireFET) === Number(reprice.tireFET) || (existing.tireFET === null && reprice.tireFET === null)) &&
        (Number(existing.warrOptAmt) === Number(reprice.warrOptAmt) || (existing.warrOptAmt === null && reprice.warrOptAmt === null))
    ) return false
    else return true;
}

function _getWhere(selections) {

    /*
This function converts a select-options like structure into object literal syntax
that can be used in CDS WHERE clause.  It is kept here for future reference in
case a RepriceByRanges type function is ever implemented.

JSON.parse() can take a JSON object stored in a string and convert it to a JSON
object.  Note that within the string, double quotes need to be escaped with a
back slash.  This is kept for future reference in case a RepriceWhere type
function is ever implemented again.

Use with these type declarations in the x-svc.cds file:
type selOp {
    compOp    : String(7); // =, !=, <, <=, >, >=, between
    value     : String(30);
    highValue : String(30);
}

type selection {
    field  : String(30);
    selOps : array of selOp;
}

type selections : array of selection;
    */

    // Default OpenOrder = 'Y' if not specified
    if (!selections.some((sel) => sel.field === "OpenOrder"))
        selections.splice(0, 0, {
            field: "OpenOrder",
            selOps: [{ compOp: "=", value: "Y" }],
        });

    // Rules:
    // 1. Restrictions on the same field are joined with "or"
    // 2. Restrictions on different fields are joined with "and"
    let where = {};
    let _and = where;
    let _or = where;

    for (let [isel, sel] of selections.entries()) {
        for (let [iop, op] of sel.selOps.entries()) {
            if (iop === 0) {
                if (isel === 0) {
                    _and[sel.field] =
                        op.compOp.substring(0, 1) === "="
                            ? op.value
                            : op.compOp.toLowerCase() === "between"
                                ? { between: op.value, and: op.highValue }
                                : { [op.compOp]: op.value };
                    _or = _and;
                } else {
                    _and.and = {
                        [sel.field]:
                            op.compOp.substring(0, 1) === "="
                                ? op.value
                                : op.compOp.toLowerCase() === "between"
                                    ? { between: op.value, and: op.highValue }
                                    : { [op.compOp]: op.value }
                    };
                    _and = _and.and;
                    _or = _and;
                }
            } else {
                _or.or = {
                    [sel.field]:
                        op.compOp.substring(0, 1) === "="
                            ? op.value
                            : op.compOp.toLowerCase() === "between"
                                ? { between: op.value, and: op.highValue }
                                : { [op.compOp]: op.value }
                };
                _or = _or.or;
            }
        }
    }

    return where;
}
