const utility = require("./utility");

module.exports = async function (srv, req, MsgSplits, MsgOrders) {

    // Check if we're receiving an update message before its split message
    let unsplit;
    try {
        unsplit = await srv.run(`
                SELECT
                    o.ID AS "ID",
                    o.divisionCd AS "divisionCd",
                    o.chassisNo AS "chassisNo",
                    o.DTPONumber AS "DTPONumber",
                    o.startingChassis AS "startingChassis",
                    o.endingChassis AS "endingChassis",
                    o.changeOrderNo AS "changeOrderNo",
                    o.createTimestamp AS "createTimestamp",
                    o.orderAddDt AS "orderAddDt",
                    o.orderType AS "orderType",
                    o.plantCd AS "plantCd"
                FROM order_msg_orders AS o
                INNER JOIN order_msg_chassis AS c ON
                    c.order_ID = o.ID
                WHERE
                    o.divisionCd = ? AND
                    c.chassisNo  = ? AND
                    o.DTPONumber = ? AND
                    o.current    = true AND
                    (
                        o.startingChassis != ? OR
                        o.endingChassis   != ?
                    )
            `,
            [
                req.data.divisionCd,
                req.data.chassisNo,
                req.data.DTPONumber,
                req.data.startingChassis ?? req.data.chassisNo,
                req.data.endingChassis ?? req.data.chassisNo,
            ]);
    } catch (err) {
        console.error(err);
        req.error(528, err.message);
        throw err;
    }

    // Generate missing splits if the update arrived before the split message did
    if (Array.isArray(unsplit) && unsplit.length > 0) {

        let queuedSplits;
        try {
            queuedSplits = await SELECT.from(MsgSplits)
                .where`divisionCd    =  ${req.data.divisionCd}
                    and DTPONumber       =  ${req.data.DTPONumber}
                    and startingChassis  >= ${req.data.startingChassis ?? req.data.chassisNo} // In case this split is already in the queue
                    and endingChassis    <= ${unsplit[0].endingChassis}
                    and completed        =  false`
                .orderBy`startingChassis`;
        } catch (err) {
            console.error(err);
            req.error(529, err.message);
            throw err;
        }

        // Is this an update to a split that's already in the queue?
        let updateOfQueuedSplit = false;
        if (queuedSplits.length > 0 && queuedSplits.some(q => q.startingChassis === req.data.startingChassis)) updateOfQueuedSplit = true;

        // Insert the update with the other queued splits so we can accurately identify
        // where gaps exist in the starting/ending chassis ranges, but only if the split
        // wasn't already in the queue.
        if (!updateOfQueuedSplit) {
            queuedSplits.splice(
                queuedSplits.findIndex(q => q.startingChassis > (req.data.endingChassis ?? req.data.chassisNo)),
                0,
                {
                    action: "Split",
                    changeOrderNo: req.data.changeOrderNo,
                    chassisNo: req.data.chassisNo,
                    createTimestamp: req.data.createTimestamp,
                    divisionCd: req.data.divisionCd,
                    DTPONumber: req.data.DTPONumber,
                    endingChassis: req.data.endingChassis ?? req.data.chassisNo,
                    messageType: req.data.messageType,
                    orderAddDt: req.data.orderAddDt,
                    orderType: req.data.orderType,
                    plantCd: req.data.plantCd,
                    startingChassis: req.data.startingChassis ?? req.data.chassisNo,
                    updateBeforeSplit: true,
                }
            );
        }

        // Iterate through the queued splits (including the new update).  Do this in ascending
        // order since we want to add all the missing entries to the queue first, and then when
        // the last range gets added it will trigger the split logic to post them all as order
        // messages.
        for (let [i, split] of queuedSplits.entries()) {

            // NOTE: Some entries can satisfy both scenarios 1 and 3, i.e. when the update we
            // received is the last (or only) entry in the queue, but there's still a gap to
            // the ending chassis of the unsplit range.  That's why the 3 scenarios are kept
            // as 3 separate IF statements, and why it's important to process them in the
            // sequence below.

            // Scenario 1: Range for the update before split, but not if it's at the start of the unsplit range,
            // and not if there's already a split in the queue for this range.
            if (split.startingChassis === (req.data.startingChassis ?? req.data.chassisNo) && // This is the record we just spliced into the queue array
                (req.data.startingChassis ?? req.data.chassisNo) !== unsplit[0].startingChassis && // But not at the start of the unsplit range (in a normal split scenario no split is sent that includes original starting chassis)
                !updateOfQueuedSplit) { // And not if there's already a split in the queue for this range
                try {
                    await srv.create(MsgOrders).entries(split); // Generate a split
                } catch (err) {
                    console.error(err);
                    req.error(530, err.message);
                    throw err;
                }
            }

            // Scenario 2: Gap between 2 ranges in queue
            if (i < (queuedSplits.length - 1) && // Not the last in the queue
                parseInt(queuedSplits[i + 1].startingChassis) - parseInt(split.endingChassis) > 1) { // Gap between this ending chassis and the next starting chassis
                try {
                    await srv.create(MsgOrders).entries({
                        action: "Split",
                        changeOrderNo: unsplit[0].changeOrderNo,
                        chassisNo: utility.getChassisOffset(split.endingChassis, 1),
                        startingChassis: utility.getChassisOffset(split.endingChassis, 1),
                        endingChassis: utility.getChassisOffset(queuedSplits[(i + 1)].startingChassis, -1),
                        createTimestamp: unsplit[0].createTimestamp,
                        divisionCd: unsplit[0].divisionCd,
                        DTPONumber: unsplit[0].DTPONumber,
                        messageType: req.data.messageType,
                        orderAddDt: unsplit[0].orderAddDt,
                        orderType: unsplit[0].orderType,
                        plantCd: unsplit[0].plantCd,
                        updateBeforeSplit: true,
                    });
                } catch (err) {
                    console.error(err);
                    req.error(531, err.message);
                    throw err;
                }
            }

            // Scenario 3: Last entry but there's a gap to the ending chassis of the unsplit order
            if (i === (queuedSplits.length - 1) && // Last entry in the queue
                split.endingChassis < unsplit[0].endingChassis) { // Gap between this ending chassis and the ending chassis of the existing order
                try {
                    await srv.create(MsgOrders).entries({
                        action: "Split",
                        changeOrderNo: unsplit[0].changeOrderNo,
                        chassisNo: utility.getChassisOffset(split.endingChassis, 1),
                        startingChassis: utility.getChassisOffset(split.endingChassis, 1),
                        endingChassis: unsplit[0].endingChassis,
                        createTimestamp: unsplit[0].createTimestamp,
                        divisionCd: unsplit[0].divisionCd,
                        DTPONumber: unsplit[0].DTPONumber,
                        messageType: req.data.messageType,
                        orderAddDt: unsplit[0].orderAddDt,
                        orderType: unsplit[0].orderType,
                        plantCd: unsplit[0].plantCd,
                        updateBeforeSplit: true,
                    });
                } catch (err) {
                    console.error(err);
                    req.error(532, err.message);
                    throw err;
                }
            }

        }

        // Adjust the created/updated timestamps so it doesn't look like this update
        // came in after the splits we just got done creating.
        req.data.createdAt = new Date(Date.now()).toJSON();
        req.data.modifiedAt = req.data.createdAt;

    }
}