const utility = require('./utility');

module.exports = async function (
    cds,
    srv,
    req,
    currentOrder,
    Chassis,
    API_SALES_ORDER_SRV,
    A_SalesOrder,
    MDFreight,
    MDOptionsRanges,
    PromoCodes,
    Plants,
    MDModelDiscount,
    SalesDocTypes
) {
    const BusinessPartner = require('./BusinessPartner');
    const bp = new BusinessPartner();

    //Connect to MDMaintService
    const md = await cds.connect.to("MDMaintService");
    const {
        CostModels,
        DefaultDiscount,
        MarketingFees,
        SpecialRanges,
    } = md.entities;

    //Connect to OMSService
    const oms = await cds.connect.to("OMSService");
    const { SalesOption } = oms.entities;

    // Default to non-fleet order, then try to determine if it is actually a fleet order
    req.data.fleetOrder = false;

    // Copy some values from the original order that were determined/filled before.
    if (currentOrder != null) {
        // Copy the S4 fields from the previous current order.
        req.data.salesOrder = currentOrder.salesOrder;
        req.data.salesOrg = currentOrder.salesOrg;

        // Copy the fleet flag from the original order.  This is important in case this is a single chassis that was split off of a bigger fleet order,
        // because it should still be considered a fleet order even though it has a quantity of 1.
        req.data.fleetOrder = currentOrder.fleetOrder;
        req.data.fleetGap = currentOrder.fleetGap;

        // For generated splits the Chassis array will be passed in, copy it
        if (
            Array.isArray(currentOrder.Chassis) &&
            currentOrder.Chassis.length > 0
        )
            req.data.Chassis = currentOrder.Chassis;
        // For update orders no Chassis array will be passed so get it from the current order
        else
            req.data.Chassis = await SELECT.from(Chassis)
                .where`order_ID = ${currentOrder.ID}`;

        // Fill in the new order ID on the copied Chassis, and default to current = true
        if (Array.isArray(req.data.Chassis)) {
            for (let chassis of req.data.Chassis) {
                chassis.order_ID = req.data.ID;
                chassis.current = true;
            }
        }

        // If the current order is an uprocessed Split then we should retain that
        if (currentOrder.action === "Split") {
            if (currentOrder.orderSaved === false) {
                req.data.action = currentOrder.action;
                req.data.deleteItems = currentOrder.deleteItems;
            }
            req.data.splitOrder_ID = currentOrder.splitOrder_ID;
            req.data.ignoreSplit = true;
        }

        // If the current order is not saved then we need to retain some values
        if (currentOrder.orderSaved === false) {
            req.data.billingBlockCd = currentOrder.billingBlockCd;
            req.data.splitOrder_ID = currentOrder.splitOrder_ID;
        }
    }

    // Fleet quantity > 1 means it's a fleet order.  Even if the fleet quantity is 1 it could still be part of a fleet order since it might just be
    // 1 chassis that was split off a larger fleet.  That's why we copy the fleetOrder flag from the original order when present (see above).
    if (req.data.fleetQty > 1) req.data.fleetOrder = true;

    // Get existing OPS processing status code in S4 so CPI can decide whether to update it into S4 or not.
    // When it's currently 16CH/16RH/ICOH in S4 but OPS is sending something new then CPI will update it.
    if (req.data.salesOrder) {
        try {
            const s4StatusCode = await API_SALES_ORDER_SRV.run(
                SELECT`
                            OPSProcessingStatus`.from(A_SalesOrder).where`
                            SalesOrder = ${req.data.salesOrder}`
            );
            if (Array.isArray(s4StatusCode) && s4StatusCode.length > 0)
                req.data.s4StatusCode = s4StatusCode[0].OPSProcessingStatus;
        } catch (err) {
            console.error(err);
            req.error(548, err.message);
            throw err;
        }
    }

    // Mark this incoming message as the current one for this chassis/DTPO
    req.data.current = true;
    for (let narrative of req.data.Narratives) {
        narrative.current = true;
    }

    // Initialize calculated amounts to 0 if they are nullish
    req.data.FETExemptAmt = req.data.FETExemptAmt ?? 0;
    req.data.frgtRateAmt = req.data.frgtRateAmt ?? 0;
    req.data.hasFifthWheel = false;
    req.data.hasPusher = false;
    req.data.listPrice = req.data.listPrice ?? 0;
    req.data.marketingFee = req.data.marketingFee ?? 0;
    req.data.promoAmt = req.data.promoAmt ?? 0;
    req.data.surchargesNSTD = req.data.surchargesNSTD ?? 0;
    req.data.surchargesZH00 = req.data.surchargesZH00 ?? 0;
    req.data.surchargesZISF = req.data.surchargesZISF ?? 0;
    req.data.surchargesZMAD = req.data.surchargesZMAD ?? 0;
    req.data.tireFET = req.data.tireFET ?? 0;
    req.data.warrOptAmt = req.data.warrOptAmt ?? 0;
    req.data.weight = req.data.weight ?? 0;
    req.data.gvwrTemp = req.data.gvwrTemp ?? 0;

    /*
      Enrich the incoming order and options data from master data, and with other business logic
    */
    // Enrich order with weight unit
    // chasMetricCustmryInd is irrelevant, OPS always stores GVWR in KG.  The indicator is observed
    // to almost always contain "C" (for metric), a couple of "M", and no "S" (for standard).
    req.data.weightUnit = "KG";

    // S4 division code
    req.data.division = await utility.OPSToS4Division(req.data.divisionCd);

    // S4 material number
    req.data.material = utility.getMaterialFromChassis(
        req.data.chassisNo,
        req.data.orderAddDt,
        req.data.division
    );

    // If not copied from the existing order, fill in the Chassis
    if (!req.data.Chassis) {
        req.data.Chassis = [];
        for (
            let chassisNo = req.data.startingChassis ?? req.data.chassisNo;
            Number(chassisNo) <=
            Number(req.data.endingChassis ?? req.data.chassisNo);
            chassisNo = utility.getChassisOffset(chassisNo, 1)
        ) {
            // Add this already-billed chassis to the bill collector
            req.data.Chassis.push({
                order_ID: req.data.ID,
                chassisNo: chassisNo,
                salesOrderItem: (
                    (Number(chassisNo) -
                        Number(req.data.startingChassis ?? req.data.chassisNo) +
                        1) *
                    10
                )
                    .toString()
                    .padStart(6, "0"), // Keeps potential gaps in item numbers
                material: utility.getMaterialFromChassis(
                    chassisNo,
                    req.data.orderAddDt,
                    req.data.division
                ),
                current: true,
            });
        }
        req.data.fleetGap =
            Number(req.data.endingChassis ?? req.data.chassisNo) -
                Number(req.data.startingChassis ?? req.data.chassisNo) +
                1 !==
            Number(req.data.fleetQty);
    }

    // Sort Chassis by chassisNo since if they're returned out-of-order then CPI will
    // wrongly assign the ZE00 Change Order Fee to whichever one comes first, e.g.
    // sales order 34520 item 870 for chassis 321357 in PA0.
    req.data.Chassis.sort((a, b) => a.chassisNo > b.chassisNo ? 1 : -1 );

    // Enrich order with class, marketing class and reporting class
    // For management reporting purposes, some models are always reported as a particular class, even if options
    // change the GVWR to the point to push the specific truck up/down to a different class.
    let costModel;
    if (req.data.costModelCd) {
        // Order type "S" doesn't have a costModelCd so avoid errors
        try {
            costModel = await SELECT.one.from(CostModels)
                .where`divisionCd = ${req.data.divisionCd} and
                    costModelCd = ${req.data.costModelCd}`;
        } catch (err) {
            console.error(err);
            req.error(514, err.message);
            throw err;
        }
    }

    // Default cab type to "DAY"
    req.data.cabType = "DAY";

    if (costModel && costModel.class) {
        req.data.defaultClass = costModel.class;
        // Cab type (SLEEPER, DAY) - for Peterbilt only, Kenworth determined from option range
        if (req.data.divisionCd === "P") req.data.cabType = costModel.cabType;
    }

    // Early in the order process no GVWR is available, so we will default to the reporting class.
    req.data.gvwr = Number(req.data.gvwr);
    if (req.data.gvwr === 0) {
        req.data.class = req.data.defaultClass;
        // After GVWR is available we will use thresholds to determine the actual class.
        // NOTE: Meeting on 2/8/2022 with Laura Harding, George Strasser, Sumathi Nagarajan, Joshua Matthews, James Whitman
        // EASOP sends GVWR in lbs to OPS, then OPS converts it to KG using a rate of 0.4536.
        // Agreed on the below thresholds in KG, which are the equivalent of the familiar values in LBS using the OPS conversion rate 0.4536.
    } else {
        req.data.gvwrLbs = req.data.gvwr / 0.4536;
        if (req.data.gvwr > 14968.8) {
            // 33,000 LBS * 0.4536 = 14,968.8 KG
            req.data.class = "8";
        } else if (req.data.gvwr > 11793.6) {
            // 26,000 LBS * 0.4536 = 11,793.6 KG
            req.data.class = "7";
        } else if (req.data.gvwr > 8845.2) {
            // 19,500 LBS * 0.4536 = 8,845.2 KG
            req.data.class = "6";
        } else {
            req.data.class = "5";
        }
    }

    // Enrich order with marketing class
    if (req.data.class === "8") {
        req.data.marketingClass = "8";
    } else {
        req.data.marketingClass = "7"; //For marketing fees, classes 5 and 6 fall under class 7
    }

    // Enrich with product type
    if (req.data.unitTypeCd === "3") {
        req.data.productType = "GLIDER";
    } else if (req.data.defaultClass === "8") {
        req.data.productType = "HEAVY";
    } else {
        req.data.productType = "MEDIUM";
    }

    // Enrich order with currency
    req.data.exchangeRateAmt = req.data.exchangeRateAmt
        ? Number(req.data.exchangeRateAmt)
        : 0;
    req.data.currency = utility.getCurrency(req.data.exchangeRateAmt);

    try {
        // Marketing fee
        // Marketing fee should only be applied once GVWR is assigned, and for gliders.
        if (req.data.gvwr > 0 || req.data.unitTypeCd === "3") {
            // Get the marketing fee that was effective on the orderReceivedDt
            try {
                const marketingFees = await SELECT`
                    unitTypeCd,
                    effectiveDt,
                    fee`
                .from(MarketingFees)
                .where`
                    divisionCd = ${req.data.divisionCd} and
                    class = ${req.data.marketingClass} and
                    (
                        unitTypeCd = ${req.data.unitTypeCd} or
                        unitTypeCd = '*'
                    ) and
                    effectiveDt <= ${req.data.orderReceivedDt}`
                .orderBy`
                    unitTypeCd desc,
                    effectiveDt desc`;
                // Populate marketing fee
                // First look for a marketing fee for this specific unitTypeCd (1 = Tractor, 2 = Truck, 3 = Glider)
                // Then default to generic unitTypeCd = '*'
                const mf = marketingFees.find(f => f.unitTypeCd === req.data.unitTypeCd) || marketingFees.find(f => f.unitTypeCd === '*');
                if (mf) req.data.marketingFee = mf.fee;
            } catch (err) {
                console.error(err);
                req.error(516, err.message);
                throw err;
            }
        }

        // Freight
        // Note: Option codes could contain prepaid freight (range RFFC) which will be adjusted later.
        try {
            const f = await SELECT.one`frgtRateAmt`.from(MDFreight, {
                divisionCd: req.data.divisionCd,
                dlrNo: req.data.dealerCd,
                pltCd: req.data.plantCd,
                modelNo: req.data.modelCd,
            });
            if (f) req.data.frgtRateAmt = f.frgtRateAmt;
        } catch (err) {
            console.error(err);
            req.error(517, err.message);
            throw err;
        }

        // Sold-to country
        try {
            req.data.soldToCountry = (await bp.getAddressFor(req.data.dealerCd))?.country;
        } catch (err) {
            console.error(err);
            req.error(518, err.message);
            throw err;
        }

        // Sales org
        req.data.salesOrg = utility.getSalesOrg(req.data.soldToCountry);

        // Dealer Owner Group
        req.data.dealerOwnerGrp = " ";
        try {
            req.data.dealerOwnerGrp = await bp.getOwnerGroupFor(req.data.dealerCd, req.data.salesOrg, req.data.division);
        } catch (err) {
            console.error(err);
            req.error(519, err.message);
            throw err;
        }

        // Option ranges
        // Option codes can be part of multiple ranges simultaneously, we need to record all of them.
        // For example, the SLEEPER range overlaps ranges for CAB, GHGCAB, GHGSLEEPER and SLEEPRSIZE
        // Get all of the options ranges for the division (currently there are < 400 ranges each for KW and PB)
        let r;
        try {
            r = await SELECT.from(MDOptionsRanges)
                .where`divisionCd = ${req.data.divisionCd}`;
        } catch (err) {
            console.error(err);
            req.error(521, err.message);
            throw err;
        }

        // Special option ranges
        let sr;
        try {
            sr = await SELECT.from(SpecialRanges)
                .where`divisionCd = ${req.data.divisionCd}`;
        } catch (err) {
            console.error(err);
            req.error(522, err.message);
            throw err;
        }

        // Get unique list of option codes, including the base model option code
        const oc = Array.isArray(req.data.Options)
            ? utility.getUnique(
                  req.data.Options.concat({ text: req.data.modelCd }),
                  "text"
              )
            : [req.data.modelCd];

        // Price Protection Amount
        // Price protection is the difference between the truck price today, versus what it was on the "price effective date".
        // If priceEffectiveDt is provided, then we have to calculate price protection amount.  OPS sends priceProtAmt, but
        // not reliably so that's why we have to do this step.
        if (req.data.priceEffectiveDt) req.data.priceProtAmt = 0; // Override to 0, we'll calculate it from the options

        // Prices and weight
        // Since the calc views takes input parameters we have to use native HANA SQL to call it with placeholders:  https://answers.sap.com/questions/13450613/querying-parameterized-views-on-sap-hana-in-nodejs.html
        // Pass placeholder values via arguments as prescribed: https://cap.cloud.sap/docs/node.js/services#srv-run-sql
        // We can't use WHERE...IN with a single comma-separated list of option codes
        // (see https://blogs.sap.com/2019/01/17/passing-multi-value-input-parameter-from-calculation-view-to-table-function-in-sap-hana-step-by-step-guide/)
        // so we have to use a trick to pass the list of option codes to the WHERE clause, basically we add one ? placeholder to the IN clause for each option
        // code, then include the option codes in the arguments list so they get replaced.  This way we can still avoid SQL injection by not concatenating
        // together option codes into a SELECT string ourselves.
        let prices;
        try {
            prices = await srv.run(
                `
                        SELECT
                            "SALES_OPTION_CODE",
                            "LIST_PRICE_NOW",
                            "WEIGHT_DIFFERENCE",
                            "PROSPECTOR_STATUS_KEY",
                            "LIST_PRICE_EFF_DT",
                            "PRICE_PROTECTION_AMOUNT"
                        FROM "OMS_CV_PRICE_PROTECTION"(
                            placeholder."$$IP_DIVISION_CODE$$"=>?, 
                            placeholder."$$IP_BASE_MODEL_OPTION$$"=>?, 
                            placeholder."$$IP_PRICE_EFFECTIVE_DATE$$"=>?)
                        WHERE
                            "SALES_OPTION_CODE" in(?${",?".repeat(
                                oc.length - 1
                            )})
                        ORDER BY
                            "SALES_OPTION_CODE"
                        `,
                [
                    req.data.divisionCd,
                    req.data.modelCd,
                    req.data.priceEffectiveDt,
                ].concat(oc)
            );
        } catch (err) {
            console.error(err);
            req.error(523, err.message);
            throw err;
        }

        // Promo option codes (stored in OPS only, contain descriptions and prices)
        let promoPrices;
        try {
            promoPrices = await SELECT`salesOptnNo,sOptDesc1,sOptDesc2,promoPrcAmt`.from(
                PromoCodes
            ).where`divisionCd = ${req.data.divisionCd}
                               and salesOptnModNo = ${req.data.modelCd}
                               and salesOptnNo in ${oc}
                               and promoStDt <= ${req.data.orderReceivedDt}
                               and promoEndDt >= ${req.data.orderReceivedDt}`
                .orderBy`salesOptnNo`;
        } catch (err) {
            console.error(err);
            req.error(524, err.message);
            throw err;
        }

        // Sales Options Master Data
        let salesOptions;
        try {
            salesOptions = await SELECT`SALES_OPTION_CODE, OPS_LINE_1_DESCRIPTION, OPS_LINE_2_DESCRIPTION, FET_EXEMPT, TPN, TQ, AWGT`.from(
                SalesOption
            ).where`DIVISION_CODE = ${req.data.divisionCd}
                               and SALES_OPTION_CODE in ${oc}`
                .orderBy`SALES_OPTION_CODE`;
        } catch (err) {
            console.error(err);
            req.error(525, err.message);
            throw err;
        }

        // Plants and tire FET
        // plantCd may not be supplied since a plant is not assigned until later in the sales process
        // so we allow users to enter "*" as the plant in the Map Plants app.  We retrieve the first option
        // that matches the plant code or *, and order by plantCd descending so we get the non-* entry
        // first if one exists, otherwise we get the * entry.
        try {
            const mapPlant = await SELECT.one.from(Plants).where`divisionCd = ${
                req.data.divisionCd
            } 
                               and (    plantCd = ${
                                   req.data.plantCd ? req.data.plantCd : "*"
                               } 
                                     or plantCd = '*' )`.orderBy`plantCd desc`;
            if (mapPlant) {
                req.data.plant =
                    req.data.soldToCountry === "US"
                        ? mapPlant.USPlant
                        : mapPlant.CAPlant;
                req.data.FETPlant = mapPlant.FETPlant;
            }
        } catch (err) {
            console.error(err);
            req.error(526, err.message);
            throw err;
        }
        const tiresFET = await _getTiresFET(
            salesOptions,
            srv,
            utility.getDBDate(new Date()),
            req.data.FETPlant
        );

        // Get the base model description
        const baseSalesOption = _getSalesOption(
            salesOptions,
            req.data.modelCd,
            promoPrices
        );
        if (
            baseSalesOption.OPS_LINE_1_DESCRIPTION ||
            baseSalesOption.OPS_LINE_2_DESCRIPTION
        )
            req.data.std_des = baseSalesOption.OPS_LINE_1_DESCRIPTION.trim()
                .concat(" ", baseSalesOption.OPS_LINE_2_DESCRIPTION.trim())
                .trim()
                .substring(0, 200);

        // Initialize some variables before iterating through options
        let isWarrantyReplacement = false,
            promoCd = "",
            promoDesc = "",
            tireQty = 0,
            wheelQty = 0,
            rearTires = {
                list_price_amt: 0,
                priceProtAmt: 0,
                wgt_diff_qty: 0,
                tireFET: 0,
            },
            rearWheels = {
                list_price_amt: 0,
                priceProtAmt: 0,
                wgt_diff_qty: 0,
            };

        // Collector for promo codes
        promoCodes = {};

        // Iterate through options
        for (let option of req.data.Options) {
            option.current = true;

            let thisSalesOption = _getSalesOption(
                salesOptions,
                option.text,
                promoPrices
            );

            option.FETExempt = thisSalesOption.FET_EXEMPT === "Y";

            // List price, weight and publication status code
            let price = prices.find( p => p.SALES_OPTION_CODE === option.text );

            // If it's not in the OMS option model prices, then maybe it's an OPS promo code
            if (!price) {
                let thisPromoPrice = promoPrices
                    .filter( d => d.salesOptnNo === option.text )
                    .map((promo) => {
                        return {
                            SALES_OPTION_CODE: promo.salesOptnNo,
                            LIST_PRICE_NOW: promo.promoPrcAmt ?? 0,
                            WEIGHT_DIFFERENCE: 0,
                            PROSPECTOR_STATUS_KEY: "  ",
                            LIST_PRICE_EFF_DT: promo.promoPrcAmt ?? 0,
                            PRICE_PROTECTION_AMOUNT: 0,
                        };
                    });
                if (Array.isArray(thisPromoPrice) && thisPromoPrice.length > 0)
                    price = thisPromoPrice[0];
            }

            // If it's not in OMS or OPS then initialize it
            if (!price)
                price = {
                    SALES_OPTION_CODE: option.text,
                    LIST_PRICE_NOW: 0,
                    WEIGHT_DIFFERENCE: 0,
                    PROSPECTOR_STATUS_KEY: "  ",
                    LIST_PRICE_EFF_DT: 0,
                    PRICE_PROTECTION_AMOUNT: 0,
                };

            option.wgt_diff_qty = price.WEIGHT_DIFFERENCE ?? 0;
            option.publicationStatus = price.PROSPECTOR_STATUS_KEY ?? " ";

            // By default, each option should be added to list price and weight, unless they're part
            // of a different option range that gets counted elsewhere/later.
            let addItToListPrice = true;
            let addItToWeight = true;

            // By default options in the FETONLY range will go to surchargesNSTD unless they're in
            // a special surcharges range, in which case they'll go to that special condition instead.
            let isSpecialSurcharge = false;

            // We need to calculate tire FET, but if these are rear tires then we need to wait until
            // after we've found out how many pairs of rear tires there are before adding it to the
            // tireFET total on the order header.
            let isRearTires = false;

            // Check the "special" ranges first since some of these influence the "regular" ranges from OPS.
            let specials = sr
                // Include ranges that contain this option code
                .filter( range => (range.fromValue <= option.text) && (range.toValue >= option.text) )
                // Remove duplicate range names
                .filter((range, index, ranges) => {
                    return (
                        ranges.findIndex(
                            (r) => r.rangeNameText === range.rangeNameText
                        ) === index
                    );
                })
                // Finally do two things:
                // 1) Implement range-specific logic
                // 2) Reformat to match the Ranges entity definition
                .map(
                    function (range) {
                        // 1) Range-specific logic
                        switch (true) {
                            case range.rangeNameText.indexOf("CAB-WIDTH-") ===
                                0:
                                req.data.cabWidth = range.rangeNameDesc;
                                break;

                            case range.rangeNameText.indexOf("CANCEL-") === 0:
                                req.data.cancellationReplacement = range.rangeNameText.split(
                                    "-"
                                )[1];
                                break;

                            case range.rangeNameText.indexOf("ENGINE-") === 0:
                                req.data.engineType = range.rangeNameDesc;
                                break;

                            case range.rangeNameText.indexOf("SURCHARGES-") ===
                                0:
                                // Some surcharges are included in special ranges so that they can be broken out into their own pricing conditions.
                                // These special ranges overlap the FETONLY normal range, so we flag them here as special surcharges so we can
                                // exclude them from surchargesNSTD where all other surcharges will get counted.
                                let cond = range.rangeNameText.split("-")[1];
                                switch (cond) {
                                    case "ZH00":
                                    case "ZMAD":
                                        isSpecialSurcharge = true;
                                        addItToListPrice = false;
                                        if (req.data.priceEffectiveDt) {
                                            option.list_price_amt = price.LIST_PRICE_EFF_DT;
                                        } else {
                                            option.list_price_amt = price.LIST_PRICE_NOW;
                                        }
                                        if (cond === "ZH00") {
                                            req.data.surchargesZH00 += option.list_price_amt;
                                        } else if (cond === "ZMAD") {
                                            req.data.surchargesZMAD += option.list_price_amt;
                                        }
                                        break;
                                }
                                break;

                            case range.rangeNameText === "WARRANTY-REPLACEMENT":
                                isWarrantyReplacement = true;
                                break;
                        }

                        // 2) Reformat to match the SpecialRanges entity definition
                        return {
                            option_ID: option.ID,
                            rangeNameText: range.rangeNameText,
                            rangeNameDesc: range.rangeNameDesc,
                        };
                    }
                );

            // Concatenate special ranges into option for convenience
            for (let range of specials) {
                if (option.specialRangeNameText) {
                    option.specialRangeNameText =
                        option.specialRangeNameText + "," + range.rangeNameText;
                    option.specialRangeNameDesc =
                        option.specialRangeNameDesc + "," + range.rangeNameDesc;
                } else {
                    option.specialRangeNameText = range.rangeNameText;
                    option.specialRangeNameDesc = range.rangeNameDesc;
                }
            }

            // Populate the Ranges association
            // And implement range-specific logic
            option.Ranges = r
                // Include ranges that contain this option code
                .filter( range => (range.fromValue <= option.text) && (range.toValue >= option.text) )
                // Remove duplicate range names -- it can happen, right now there are 84 examples for Peterbilt in the AERO, GHGAERO and GHGPUSHERTIRES range
                // names that produce duplicates.
                .filter((range, index, ranges) => {
                    return (
                        ranges.findIndex( r => r.rangeNameText === range.rangeNameText ) === index
                    );
                })
                // Finally do two things:
                // 1) Implement range-specific logic
                // 2) Reformat to match the Ranges entity definition
                .map(
                    function (range) {
                        // 1) Range-specific logic
                        switch (range.rangeNameText) {
                            // Surcharges/options not subject to discounts
                            case "FETONLY":
                                // Only add it if it's not part of a special surcharge range
                                if (!isSpecialSurcharge) {
                                    addItToListPrice = false;
                                    if (req.data.priceEffectiveDt) {
                                        option.list_price_amt = price.LIST_PRICE_EFF_DT;
                                    } else {
                                        option.list_price_amt = price.LIST_PRICE_NOW;
                                    }
                                    req.data.surchargesNSTD += option.list_price_amt;
                                }
                                break;

                            // Fifth Wheel
                            case "FIFTHWHEEL":
                                req.data.hasFifthWheel = true;
                                break;

                            // Axles
                            case "FRONTAXLE":
                            case "REARAXLE":
                                option.axleWeight = thisSalesOption.AWGT;
                                if (option.axleWeight)
                                    req.data.gvwrTemp += option.axleWeight;
                                break;

                            // International support fee
                            case "ISF":
                                addItToListPrice = false;
                                if (req.data.priceEffectiveDt) {
                                    option.list_price_amt = price.LIST_PRICE_EFF_DT;
                                } else {
                                    option.list_price_amt = price.LIST_PRICE_NOW;
                                }
                                req.data.surchargesZISF += option.list_price_amt;
                                break;

                            // Pseudo-codes for rear tire quantities
                            // The last 2 digits of the tire quantity option codes indicates the number of tires
                            // E.g. 4900008 means 8 tires
                            case "PCTIREQTY":
                                addItToListPrice = false;
                                tireQty = parseInt(
                                    option.text.slice(
                                        option.text.length - 2
                                    ),
                                    10
                                );
                                break;

                            // Pseudo-codes for rear wheel quantities
                            case "PCWHEELQTY":
                                addItToListPrice = false;
                                wheelQty = parseInt(
                                    option.text.slice(
                                        option.text.length - 2
                                    ),
                                    10
                                );
                                break;

                            // Promotions
                            case "PROMOTIONS":
                                addItToListPrice = false;
                                if (req.data.priceEffectiveDt) {
                                    option.list_price_amt = price.LIST_PRICE_EFF_DT;
                                } else {
                                    option.list_price_amt = price.LIST_PRICE_NOW;
                                }
                                req.data.promoAmt += option.list_price_amt;

                                promoCodes[option.text] = option.text;

                                // Keep track of promotions in case this is a warranty replacement, since then the promo
                                // represents the unique discount code for the warranty claim.
                                promoCd = option.text;
                                if (
                                    thisSalesOption
                                        .OPS_LINE_1_DESCRIPTION ||
                                    thisSalesOption.OPS_LINE_2_DESCRIPTION
                                )
                                    promoDesc = thisSalesOption.OPS_LINE_1_DESCRIPTION.trim()
                                        .concat(
                                            " ",
                                            thisSalesOption.OPS_LINE_2_DESCRIPTION.trim()
                                        )
                                        .trim()
                                        .substring(0, 200);

                                break;

                            // Pusher - these 3 ranges confirmed with Sumathi on 5/25/2022
                            case "PUSHER":
                            case "PUSHERATTR":
                            case "PUSHERTAG":
                                req.data.hasPusher = true;
                                break;

                            // Rear tires
                            case "REARTIRES":
                                // We'll add it later after we find out how many pairs there are and multiply
                                addItToListPrice = false;
                                addItToWeight = false;
                                isRearTires = true;
                                option.list_price_amt = price.LIST_PRICE_NOW;
                                option.priceProtAmt = price.PRICE_PROTECTION_AMOUNT;
                                rearTires = option;
                                break;

                            // Rear wheels
                            case "REARWHEELS":
                                // We'll add it later after we find out how many pairs there are and multiply
                                addItToListPrice = false;
                                addItToWeight = false;
                                option.list_price_amt = price.LIST_PRICE_NOW;
                                option.priceProtAmt = price.PRICE_PROTECTION_AMOUNT;
                                rearWheels = option;
                                break;

                            // Prepaid freight (credit)
                            case "RFFC":
                                addItToListPrice = false;
                                // Credit freight that was calculated earlier
                                if (req.data.priceEffectiveDt) {
                                    option.list_price_amt = price.LIST_PRICE_EFF_DT;
                                } else {
                                    option.list_price_amt = price.LIST_PRICE_NOW;
                                }
                                req.data.frgtRateAmt -= option.list_price_amt;
                                break;

                            // Sleeper cab type (for Kenworth only, Peterbilt determined from Cost Model Code)
                            case "SLEEPER":
                                if (req.data.divisionCd === "K")
                                    req.data.cabType = range.rangeNameText;
                                break;

                            // Extended warranty options
                            case "SS WARRNTY":
                            case "WARRANTIES":
                            case "WARRANTY2":
                                addItToListPrice = false;
                                if (req.data.priceEffectiveDt) {
                                    option.list_price_amt = price.LIST_PRICE_EFF_DT;
                                } else {
                                    option.list_price_amt = price.LIST_PRICE_NOW;
                                }
                                req.data.warrOptAmt += option.list_price_amt;
                                break;
                        }

                        // 2) Reformat to match the Ranges entity definition
                        return {
                            option_ID: option.ID,
                            rangeNameText: range.rangeNameText,
                            rangeNameDesc: range.rangeNameDesc,
                            current: true,
                        };
                    }
                );

            // Concatenate ranges into option for convenience
            for (let range of option.Ranges) {
                if (option.rangeNameText) {
                    option.rangeNameText =
                        option.rangeNameText + "," + range.rangeNameText;
                    option.rangeNameDesc =
                        option.rangeNameDesc + "," + range.rangeNameDesc;
                } else {
                    option.rangeNameText = range.rangeNameText;
                    option.rangeNameDesc = range.rangeNameDesc;
                }
            }

            // Non-rear tires (front, pusher, spare, etc.) get tire quantity (TQ) from OMS master data.
            if (thisSalesOption.TQ) {
                option.TQ = thisSalesOption.TQ;
            }

            if (thisSalesOption.TPN || isRearTires) {
                // Get the tire part number
                if (thisSalesOption.TPN)
                    option.TPN = thisSalesOption.TPN.substring(0, 200);
                // Get the tire FET
                option.tireFET = (tiresFET && option.TPN)
                    ? Number( tiresFET.find( tire => tire.ORDERED_PROD === option.TPN )?.AMOUNT ) || 0
                    : 0;
                // For non-rear tires (front, pusher, spare, etc.) add tireFET to the order total
                // For rear tires we have to wait until after we've processed all option codes since
                // the rear tire quantity comes in a separate pseudo-option code for PCTIREQTY.
                if (!isRearTires) {
                    // Multiply tire FET by tire quantity
                    if (option.TQ) {
                        option.tireFET *= option.TQ;
                    }
                    // Add to total tire FET
                    req.data.tireFET += option.tireFET;
                }
            }

            // Options that weren't added to other amounts get added to the order list price by default.
            if (addItToListPrice) {
                // FET exempt options get added at effective amount
                if (option.FETExempt) {
                    option.list_price_amt = price.LIST_PRICE_EFF_DT;
                    // All others get added at current price
                } else {
                    option.list_price_amt = price.LIST_PRICE_NOW;
                    // And keep track of Price Protection
                    if (req.data.priceEffectiveDt) {
                        req.data.priceProtAmt += price.PRICE_PROTECTION_AMOUNT;
                    }
                }
                req.data.listPrice += option.list_price_amt;
            }

            // Add the option weight to the order weight
            if (addItToWeight) req.data.weight += option.wgt_diff_qty;

            // FET Exempt amount
            if (option.FETExempt) {
                req.data.FETExemptAmt += option.list_price_amt;
            }
        }

        // Multiply the list price and weight of the rear tires/wheels by the number of pairs.
        rearTires.list_price_amt = (rearTires.list_price_amt * tireQty) / 2;
        rearTires.priceProtAmt = (rearTires.priceProtAmt * tireQty) / 2;
        rearTires.wgt_diff_qty = (rearTires.wgt_diff_qty * tireQty) / 2;
        rearTires.TQ = tireQty; // Overwrite OMS tire quantity with pseudo-code rear tire quantity
        rearTires.tireFET *= rearTires.TQ;
        rearWheels.list_price_amt = (rearWheels.list_price_amt * wheelQty) / 2;
        rearWheels.priceProtAmt = (rearWheels.priceProtAmt * wheelQty) / 2;
        rearWheels.wgt_diff_qty = (rearWheels.wgt_diff_qty * wheelQty) / 2;

        // Add the rear tires and wheels to the order list price, weight and tireFET totals.
        req.data.listPrice +=
            rearTires.list_price_amt + rearWheels.list_price_amt;
        req.data.weight += rearTires.wgt_diff_qty + rearWheels.wgt_diff_qty;
        req.data.tireFET += rearTires.tireFET;

        if (req.data.priceEffectiveDt) {
            req.data.priceProtAmt +=
                rearTires.priceProtAmt + rearWheels.priceProtAmt;
            delete rearTires.priceProtAmt;
            delete rearWheels.priceProtAmt;
        }

        // stdDlrDiscPct in order message is not used (may be old value from sales tool, unknown).
        // Override it from the default discount percentage for the base model
        req.data.stdDlrDiscPct = 0;
        try {
            const e = SELECT.one`max(effectiveDt) as effectiveDt`.from(
                MDModelDiscount
            )
                .where`divisionCd = ${req.data.divisionCd} and modelNo = ${req.data.modelCd} and effectiveDt <= ${req.data.priceEffectiveDt}`;
            const d = await SELECT.one.from(MDModelDiscount)
                .where`divisionCd = ${req.data.divisionCd} and modelNo = ${req.data.modelCd} and effectiveDt = ${e}`;
            if (d !== null) {
                req.data.stdDlrDiscPct = Number(d.discPct); // Comes in as e.g. 73 which is actually 27% discount ( 100 - 73 ), so no need to invert it here
                // Fall back to default discount percentage per division code
            } else {
                const e = SELECT.one`max(effectiveDt) as effectiveDt`.from(
                    DefaultDiscount
                )
                    .where`divisionCd = ${req.data.divisionCd} and effectiveDt <= ${req.data.priceEffectiveDt}`;
                const d = await SELECT.one.from(DefaultDiscount)
                    .where`divisionCd = ${req.data.divisionCd} and effectiveDt = ${e}`;
                if (d !== null) req.data.stdDlrDiscPct = Number(d.discPct);
            }
        } catch (err) {
            console.error(err);
            req.error(542, err.message);
            throw err;
        }

        // Adjust for standard dealer discount
        req.data.priceProtAmt =
            0 -
            Math.round((req.data.priceProtAmt * req.data.stdDlrDiscPct) / 100);

        // Adjust for standard dealer discount and CAR or program percent
        req.data.CARPct = req.data.CARPct ? Number(req.data.CARPct) : 0.0;
        req.data.promoProgPct = req.data.promoProgPct
            ? Number(req.data.promoProgPct)
            : 0.0;
        const CARProgDiscPct =
            1 - (req.data.CARPct + req.data.promoProgPct) / 100;
        req.data.FETExemptAmt = Math.round(
            ((req.data.FETExemptAmt * req.data.stdDlrDiscPct) / 100) *
                CARProgDiscPct
        );

        // Enrich with FET flag considering unit type and GVWR
        if (
            req.data.FETInd === "Y" &&
            req.data.unitTypeCd === "2" && // truck (not tractor)
            req.data.gvwrTemp > 0 &&
            req.data.gvwrTemp <= 33000 && // medium duty according to temp GVWR based on axle weight
            req.data.hasFifthWheel === false && // can't pull a semi trailer
            req.data.hasPusher === false // no pusher axle either
        ) {
            req.data.FETIndUnitType = "N";
        } else {
            req.data.FETIndUnitType = req.data.FETInd;
        }

        // S4 sales document type
        let dt;
        try {
            dt = await SELECT.one`salesDocType`.from(SalesDocTypes)
                .where`divisionCd = ${req.data.divisionCd} and 
                            isWarrRepl = ${isWarrantyReplacement} and 
                            ( dealerOwnerGrp = ${req.data.dealerOwnerGrp} or dealerOwnerGrp = '*' ) and 
                            ( dealerCd = ${req.data.dealerCd} or dealerCd = '*')`
                .orderBy`seq`;
            if (dt) req.data.salesDocType = dt.salesDocType;
        } catch (err) {
            console.error(err);
            req.error(527, err.message);
            throw err;
        }
        
        // Concatenate all of the promo option codes together
        req.data.promoCodes = Object.keys(promoCodes).join().substring(0, 200);

        // If this is a warranty replacement order (as found in the special option ranges) then move all of
        // the promo info to the warranty replacement fields.
        if (isWarrantyReplacement) {
            req.data.warrReplOptCd = promoCd;
            req.data.warrReplOptDesc = promoDesc;
        }
    } catch (err) {
        console.error(err);
        req.error(502, err.message);
        throw err;
    }
};

async function _getTiresFET(salesOptions, srv, priceEffectiveDate, plant) {
    // Get distinct tire part numbers (TPN)
    const tpn = utility.getUnique(salesOptions, "TPN");

    // Get tire FET
    if (Array.isArray(tpn) && tpn.length > 0)
        return srv.run(
            `
        SELECT
            *
        FROM "CV_DIM_PRODUCT_FET"
        WHERE
            "CONTRACT_VALID_FROM" <= ? AND
            "CONTRACT_VALID_TO" >= ? AND
            "PROC_ORG" = 'O 50000616' AND
            "CONDITION_VALID_FROM" <= ? AND
            "CONDITION_VALID_TO" >= ? AND
            "PLANT" = ? AND
            "ORDERED_PROD" in(?${",?".repeat(tpn.length - 1)})
        ORDER BY
            "CONTRACT",
            "NUMBER_INT"`,
            [
                priceEffectiveDate,
                priceEffectiveDate,
                priceEffectiveDate,
                priceEffectiveDate,
                plant,
            ].concat(tpn)
        );
}

function _getSalesOption(salesOptions, optionCode, promoPrices) {
    // Copy some sales option master data
    let thisSalesOption = salesOptions.find(
        (d) => d.SALES_OPTION_CODE === optionCode
    );

    // If it's not in the OMS sales options, then maybe it's an OPS promo code
    if (!thisSalesOption) {
        let thisPromoOption = promoPrices
            .filter( d => d.salesOptnNo === optionCode )
            .map((promo) => {
                return {
                    SALES_OPTION_CODE: promo.salesOptnNo,
                    OPS_LINE_1_DESCRIPTION: promo.sOptDesc1 ?? "",
                    OPS_LINE_2_DESCRIPTION: promo.sOptDesc2 ?? "",
                    FET_EXEMPT: "",
                    TPN: "",
                    TQ: 0,
                    AWGT: 0,
                };
            });
        if (Array.isArray(thisPromoOption) && thisPromoOption.length > 0)
            thisSalesOption = thisPromoOption[0];
    }

    // If it's not in OMS or OPS then initialize it
    if (!thisSalesOption)
        thisSalesOption = {
            SALES_OPTION_CODE: optionCode,
            OPS_LINE_1_DESCRIPTION: "",
            OPS_LINE_2_DESCRIPTION: "",
            FET_EXEMPT: "",
            TPN: "",
            TQ: 0,
            AWGT: 0,
        };

    return thisSalesOption;
}
