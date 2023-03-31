const cds = require("@sap/cds");
const jobsClient = require("@sap/jobs-client");
const utility = require("./utility");

module.exports = cds.service.impl(async (srv) => {

    const ReconService = await cds.connect.to("ReconService");
    const {
        RemoteSnapshot,
        S4Snapshot
    } = ReconService.entities;

    const ManageService = await cds.connect.to("ManageService");
    const { MsgOrders } = ManageService.entities;

    srv.on("takeSnapshot", async (req) => {

        if (typeof req.headers["x-sap-scheduler-host"] !== "undefined") {
            // Request headers indicate that it's a job

            const job = {
                jobId: req.headers["x-sap-job-id"],
                scheduleId: req.headers["x-sap-job-schedule-id"],
                runId: req.headers["x-sap-job-run-id"],
                schedulerUrl: req.headers["x-sap-scheduler-host"],
                runAt: req.headers["x-sap-run-at"],
            };
            takeSnapshotJob(RemoteSnapshot, S4Snapshot, MsgOrders, job, req.data.division); // Without "await" to run asynchronously
            req.res.set("Content-Type", "text/plain");
            req.res.status(202).send("ACCEPTED"); // 202 not 200
        } else {
            // Not a job
            try {
                await takeSnapshot(RemoteSnapshot, S4Snapshot, MsgOrders, req.data.division); //With "await" to run synchronously
                return true;
            } catch (err) {
                return false;
            }
        }
    });
});

async function takeSnapshotJob(RemoteSnapshot, S4Snapshot, MsgOrders, job, division) {
    try {
        await takeSnapshot(RemoteSnapshot, S4Snapshot, MsgOrders, division);
        await setJobSchedulerStatus(job, { success: true, message: "OK" });
        return true;
    } catch (err) {
        await setJobSchedulerStatus(job, {
            success: false,
            message: err.message,
        });
        console.error(err);
        throw err;
    }
}

async function takeSnapshot(RemoteSnapshot, S4Snapshot, MsgOrders, division) {
    
    try {
        // 1. Delete existing S4 snapshot data
        const recon = await cds.connect.to('ZC_OPSRECON_CDS');
        await DELETE.from(S4Snapshot).where`DIVISION = ${division}`;
        // 2. Insert new snapshot by reading S4 (remote)
        const packageSize = 5000;
        for (let skip = 0; true; skip += packageSize) {
            // Get a packet of snapshot records from S4
            const activeItems = await recon.run(
                SELECT`
                    SALES_ORDER,
                    SALES_ORDER_ITEM,
                    BLOCKED,
                    CHASSIS,
                    DIVISION,
                    DOCUMENT_CURRENCY,
                    DTPO_NUMBER,
                    ENDING_CHASSIS,
                    OPS_PROCESSING_STATUS,
                    ORDER_ADD_DATE,
                    PLANT,
                    STARTING_CHASSIS,
                    SALES_ORGANIZATION,
                    CHASSIS_NET_PRICE,
                    EXCHANGE_RATE,
                    TAX_AMOUNT,
                    FREIGHT,
                    OPS_CHASSIS_NO,
                    SOLD_TO,
                    FIRM_SCHEDULE_DATE,
                    TENTATIVE_SCHEDULE_DATE`
                .from(RemoteSnapshot)
                .where`
                    DIVISION = ${division} AND
                    OpenOrder = 'Y' AND
                    RejectionReason = ''`
                .limit(packageSize, skip)
            );

            // If there were no more records to retrieve then exit the loop
            if (activeItems.length === 0) break;

            // Enrich the snapshot with change order number from the most recent corresponding order message
            const salesOrders = utility.getUnique(activeItems, 'SALES_ORDER');
            const orderMsgs = await SELECT`salesOrder, changeOrderNo`.from(MsgOrders).where`salesOrder in ${salesOrders} and current = true`;
            for (let item of activeItems) {
                // Add change order number from current OPS order message
                const msg = orderMsgs.find( msg => msg.salesOrder === item.SALES_ORDER );
                if (msg) item.CHANGE_ORDER_NUMBER = msg.changeOrderNo;
                // Translate billing block to credit status
                if (item.BLOCKED === 'Y') item.CREDIT_STATUS = 'CH' //Credit Hold
                else if (item.BLOCKED === 'N') item.CREDIT_STATUS = 'CL'; //Cleared
                delete item.BLOCKED;
            }

            // Insert the packet into the snapshot table
            await INSERT.into(S4Snapshot).entries(...activeItems);    
        }
        return true;
    } catch (err) {
        console.error(err);
        return err;
    }
}

function setJobSchedulerStatus(job, status) {
    console.log(
        "===> REPLICATION: job: " +
        JSON.stringify(job) +
        " status: " +
        JSON.stringify(status)
    );
    return new Promise((resolve, reject) => {
        const scheduler = new jobsClient.Scheduler();
        const options = {
            jobId: job.jobId,
            scheduleId: job.scheduleId,
            runId: job.runId,
            data: status,
        };
        scheduler.updateJobRunLog(options, (err, result) => {
            if (err) {
                reject(new Error(err));
            } else {
                resolve(result);
            }
        });
    });
}
