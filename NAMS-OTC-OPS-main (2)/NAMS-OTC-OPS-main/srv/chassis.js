const utility = require("./utility");

async function beforeCreateChassisFiles(srv, req, API_SALES_ORDER_SRV, A_SalesOrderItem) {
    let chassArr = [req.data];
    chassArr = await _enrichChassis(srv, req, chassArr, API_SALES_ORDER_SRV, A_SalesOrderItem);
    return chassArr[0];
}

async function onProcessChassisCSV(srv, req, ChassisFilesCSV, ChassisFiles, API_SALES_ORDER_SRV, A_SalesOrderItem) {

    const filename = req.params[0];
    let chassisFile;
    try {
        chassisFile = await SELECT.one`csv`.from(ChassisFilesCSV, filename);
    } catch (err) {
        console.error(err);
        req.error(553, err.message);
        return false;
    }

    let chassisPacket = [];
    while (chassisFile.csv) {
        let newLineIdx = chassisFile.csv.indexOf('\n') > -1 ? chassisFile.csv.indexOf('\n') : chassisFile.csv.length;
        chassisPacket = [];
        while (chassisFile.csv && chassisPacket.length < 1000) {
            const chassisFields = chassisFile.csv.substring(0, newLineIdx)
                .split(',')
                .map(field => field = (field.trim() && field.trim().replace(/[\x00]/g, '')) ? field.trim().replace(/[\x00]/g, '') : null);

            chassisPacket.push({
                "divisionCd": chassisFields[0],
                "chassisNo": chassisFields[1],
                "vinMfgCd": chassisFields[2] ? chassisFields[2].substring(0, 3) : null,
                "vinModelCd": chassisFields[2] ? chassisFields[2].substring(3, 4) : null,
                "vinAxleCd": chassisFields[2] ? chassisFields[2].substring(4, 5) : null,
                "vinEngineCd": chassisFields[2] ? chassisFields[2].substring(5, 6) : null,
                "vinGVWRCd": chassisFields[2] ? chassisFields[2].substring(6, 7) : null,
                "vinUnuseCd": chassisFields[2] ? chassisFields[2].substring(7, 8) : null,
                "vinCheckDigitCd": chassisFields[2] ? chassisFields[2].substring(8, 9) : null,
                "vinYrCd": chassisFields[2] ? chassisFields[2].substring(9, 10) : null,
                "pltCd": chassisFields[3],
                "engineSerNo": chassisFields[4],
                "vehActlWgt": chassisFields[5] ? Number(chassisFields[5]) : null,
                "DTPONumber": chassisFields[6],
                "orderAddDt": chassisFields[7] ? chassisFields[7].substr(6, 4) + '-' + chassisFields[7].substr(0, 2) + '-' + chassisFields[7].substr(3, 2) : null,
                "tentSchedDt": chassisFields[8] ? chassisFields[8].substr(6, 4) + '-' + chassisFields[8].substr(0, 2) + '-' + chassisFields[8].substr(3, 2) : null,
                "firmSchedDt": chassisFields[9] ? chassisFields[9].substr(6, 4) + '-' + chassisFields[9].substr(0, 2) + '-' + chassisFields[9].substr(3, 2) : null,
                "frameSchedDt": chassisFields[10] ? chassisFields[10].substr(6, 4) + '-' + chassisFields[10].substr(0, 2) + '-' + chassisFields[10].substr(3, 2) : null,
                "cabSchedDt": chassisFields[11] ? chassisFields[11].substr(6, 4) + '-' + chassisFields[11].substr(0, 2) + '-' + chassisFields[11].substr(3, 2) : null,
                "actlDlvryDt": chassisFields[12] ? chassisFields[12].substr(6, 4) + '-' + chassisFields[12].substr(0, 2) + '-' + chassisFields[12].substr(3, 2) : null,
                "reqDelDt": chassisFields[13] ? chassisFields[13].substr(6, 4) + '-' + chassisFields[13].substr(0, 2) + '-' + chassisFields[13].substr(3, 2) : null,
                "frameLnSeqNo": chassisFields[14],
                "cabLnSeqNo": chassisFields[15],
                "opsStatus": chassisFields[16],
                "chsStatus": chassisFields[17],
                "destBusName": chassisFields[18],
                "destCntctName": chassisFields[19],
                "destAddrLn1": chassisFields[20],
                "destAddrLn2": chassisFields[21],
                "destCity": chassisFields[22],
                "destSt": chassisFields[23],
                "destZipCd": chassisFields[24],
                "destCntctPhoneNo": chassisFields[25],
                "destCntry": chassisFields[26],
                "preBillDt": chassisFields[27] ? chassisFields[27].substr(6, 4) + '-' + chassisFields[27].substr(0, 2) + '-' + chassisFields[27].substr(3, 2) : null
            });

            chassisFile.csv = chassisFile.csv.substring(newLineIdx + 1);
            newLineIdx = chassisFile.csv.indexOf('\n') > -1 ? chassisFile.csv.indexOf('\n') : chassisFile.csv.length;

        }

        chassisPacket = await _enrichChassis(srv, req, chassisPacket, API_SALES_ORDER_SRV, A_SalesOrderItem);

        try {
            await INSERT.into(ChassisFiles, chassisPacket);
        } catch (err) {
            console.error(err);
            req.error(554, err.message);
            return false;
        }
    }

    try {
        await UPDATE(ChassisFilesCSV, filename).with({ isProcessed: true });
        const cutoff = new Date(new Date().setDate(new Date().getDate() - 30)).toJSON().replace('T', ' ').replace('Z', '');
        await DELETE.from(ChassisFilesCSV).where({ modifiedAt: { '<': cutoff } });
    } catch (err) {
        console.error(err);
        req.error(555, err.message);
        return false;
    }

    return true;

}

async function onArchiveChassisFiles(req, db) {

    const divisionCd = req.data.divisionCd;
    const versionsToKeep = req.data.versionsToKeep;

    // Generate a new version 0 into the archive from S4 actual replicated data
    try {
        const dbClass = require("sap-hdbext-promisfied");
        let dbConn = new dbClass(
            await dbClass.createConnection(db.options.credentials)
        );
        const hdbext = require("@sap/hdbext");
        const sp = await dbConn.loadProcedurePromisified(
            hdbext,
            null,
            "PROC_ARCHIVE_CHASSIS_FILE"
        );
        await dbConn.callProcedurePromisified(sp, { "I_DIVISION_CODE": divisionCd, "I_VERSIONS_TO_KEEP": versionsToKeep });
    } catch (err) {
        console.error(err);
        req.error(537, err.message);
        return false;
    }

    return true;

}

async function onPrepareChassisParallel(req, db) {
    try {
        const dbClass = require("sap-hdbext-promisfied");
        let dbConn = new dbClass(
            await dbClass.createConnection(db.options.credentials)
        );
        const hdbext = require("@sap/hdbext");
        const sp = await dbConn.loadProcedurePromisified(
            hdbext,
            null,
            "PROC_PREPARE_CHASSIS_PARALLEL"
        );
        await dbConn.callProcedurePromisified(sp, { "I_DIVISION_CODE": req.data.divisionCd, "I_NUMBER_OF_THREADS": req.data.numberOfThreads });
        return true;
    } catch (err) {
        console.error(err);
        req.error(536, err.message);
        throw err;
    }
}

async function onGetNextChassisPacket(req, ChassisFiles) {
    if (!req.data || !req.data.divisionCd || !req.data.threadNo) {
        req.error(404, 'Missing mandatory parameter divisionCd or threadNo');
        return;
    }

    try {
        const lineNo = await SELECT.one`min(lineNo) as lineNo`.from(ChassisFiles).where`divisionCd = ${req.data.divisionCd} and streamNo = ${req.data.threadNo} and timesProcessed = 0 and materialSaved = false and salesOrderSaved = false`;
        if (lineNo.lineNo) {
            let resp = await SELECT.from(ChassisFiles).where`divisionCd = ${req.data.divisionCd} and streamNo = ${req.data.threadNo} and lineNo = ${lineNo.lineNo} and timesProcessed = 0 and materialSaved = false and salesOrderSaved = false`;
            return resp;
        } else {
            return []; // Don't req.reject(404) since CPI can't handle it
        }
    } catch (err) {
        console.error(err);
        req.error(543, err.message);
        throw err;
    }
}

async function onGetOldestChassisError(req, ChassisFiles) {
    if (!req.data || !req.data.divisionCd) {
        req.error(404, 'Missing mandatory parameter divisionCd');
        return;
    }

    try {
        const oldest = await
            SELECT.one`
                streamNo,
                lineNo`
                .from(ChassisFiles)
                .orderBy`modifiedAt`
                .where`divisionCd = ${req.data.divisionCd} and timesProcessed > 0 and (materialSaved = false or salesOrderSaved = false) and streamNo > 0 and lineno > 0`;
        if (oldest) {
            let resp = await SELECT.from(ChassisFiles).where`divisionCd = ${req.data.divisionCd} and streamNo = ${oldest.streamNo} and lineNo = ${oldest.lineNo} and timesProcessed > 0 and (materialSaved = false or salesOrderSaved = false)`;
            return resp;
        } else {
            return []; // Don't req.reject(404) since CPI can't handle it
        }
    } catch (err) {
        console.error(err);
        req.error(544, err.message);
        throw err;
    }
}

/*
    Private Functions
*/
async function _enrichChassis(srv, req, chassisArr, API_SALES_ORDER_SRV, A_SalesOrderItem) {

    const BusinessPartner = require('./BusinessPartner');
    const bp = new BusinessPartner();    

    const divisionCd = Array.isArray(chassisArr) && chassisArr.length > 0 ? chassisArr[0].divisionCd : '';
    const s4Division = await utility.OPSToS4Division(divisionCd); // S4 division code

    // Create an array of materials
    let chassisList = [];
    let materials = [];
    for (let chassis of chassisArr) {
        chassisList.push(chassis.chassisNo);
        if (chassis.destBusName && !chassis.destSt) {
            chassis.material = utility.getMaterialFromChassis(chassis.chassisNo, chassis.orderAddDt, s4Division);
            materials.push(chassis.material);
        }
    }

    let salesOrderItems = [];
    let customers = [];
    if (materials.length > 0) {
        try {
            salesOrderItems = await API_SALES_ORDER_SRV.run(
                SELECT.from(A_SalesOrderItem, item => {
                    item.SalesOrder,
                        item.SalesOrderItem,
                        item.Material,
                        item.to_SalesOrder(so => {
                            so.SoldToParty` as SoldToParty`,
                                so.PurchaseOrderByCustomer` as PurchaseOrderByCustomer`
                        })
                }).where`
                    Material in ${materials} AND
                    SalesDocumentRjcnReason = ''`
            );

            const soldTos = utility.getUnique(salesOrderItems.map(item => item.to_SalesOrder), 'SoldToParty');

            if (soldTos.length > 0) {
                customers = await bp.getAddressForMultiple(soldTos);
            };
        } catch (err) {
            console.error(err);
            req.error(547, err.message);
            return;
        }
    }

    // Get the previous version of this chassis.  We're looking for the most recent version that was either:
    // 1) Successfully processed, meaning the material and sales order were both updated (materialSaved = true and salesOrderSaved = true), or
    // 2) Not a delta itself, meaning its previous version was unchanged from the version before it
    let archives = [];
    try {
        archives = await srv.run(`
            SELECT
                *
            FROM (
                SELECT
                    a.archiveVersion AS "archiveVersion",
                    a.divisionCd AS "divisionCd",
                    a.chassisNo AS "chassisNo",
                    a.vinMfgCd AS "vinMfgCd",
                    a.vinModelCd AS "vinModelCd",
                    a.vinAxleCd AS "vinAxleCd",
                    a.vinEngineCd AS "vinEngineCd",
                    a.vinGVWRCd AS "vinGVWRCd",
                    a.vinUnuseCd AS "vinUnuseCd",
                    a.vinCheckDigitCd AS "vinCheckDigitCd",
                    a.vinYrCd AS "vinYrCd",
                    a.pltCd AS "pltCd",
                    a.engineSerNo AS "engineSerNo",
                    a.DTPONumber AS "DTPONumber",
                    a.orderAddDt AS "orderAddDt",
                    a.tentSchedDt AS "tentSchedDt",
                    a.firmSchedDt AS "firmSchedDt",
                    a.frameSchedDt AS "frameSchedDt",
                    a.cabSchedDt AS "cabSchedDt",
                    a.reqDelDt AS "reqDelDt",
                    a.frameLnSeqNo AS "frameLnSeqNo",
                    a.cabLnSeqNo AS "cabLnSeqNo",
                    a.opsStatus AS "opsStatus",
                    a.destBusName AS "destBusName",
                    a.destAddrLn1 AS "destAddrLn1",
                    a.destCity AS "destCity",
                    a.destSt AS "destSt",
                    a.destZipCd AS "destZipCd"
                FROM chassis_filesarchive a
                JOIN (  SELECT
                            divisionCd AS "divisionCd",
                            chassisNo AS "chassisNo",
                            DTPONumber AS "DTPONumber",
                            MIN(archiveVersion) AS "archiveVersion"
                        FROM chassis_filesarchive
                        WHERE
                            archiveVersion > 0 AND
                            (
                                (
                                    materialSaved = true AND
                                    salesOrderSaved = true
                                ) OR
                                isDelta = false
                            )
                        GROUP BY
                            divisionCd,
                            chassisNo,
                            DTPONumber
                    ) v ON
                    v."divisionCd" = a.divisionCd AND
                    v."chassisNo" = a.chassisNo AND
                    v."DTPONumber" = a.DTPONumber AND
                    v."archiveVersion" = a.archiveVersion
                UNION ALL
                SELECT
                    a.archiveVersion AS "archiveVersion",
                    a.divisionCd AS "divisionCd",
                    a.chassisNo AS "chassisNo",
                    a.vinMfgCd AS "vinMfgCd",
                    a.vinModelCd AS "vinModelCd",
                    a.vinAxleCd AS "vinAxleCd",
                    a.vinEngineCd AS "vinEngineCd",
                    a.vinGVWRCd AS "vinGVWRCd",
                    a.vinUnuseCd AS "vinUnuseCd",
                    a.vinCheckDigitCd AS "vinCheckDigitCd",
                    a.vinYrCd AS "vinYrCd",
                    a.pltCd AS "pltCd",
                    a.engineSerNo AS "engineSerNo",
                    a.DTPONumber AS "DTPONumber",
                    a.orderAddDt AS "orderAddDt",
                    a.tentSchedDt AS "tentSchedDt",
                    a.firmSchedDt AS "firmSchedDt",
                    a.frameSchedDt AS "frameSchedDt",
                    a.cabSchedDt AS "cabSchedDt",
                    a.reqDelDt AS "reqDelDt",
                    a.frameLnSeqNo AS "frameLnSeqNo",
                    a.cabLnSeqNo AS "cabLnSeqNo",
                    a.opsStatus AS "opsStatus",
                    a.destBusName AS "destBusName",
                    a.destAddrLn1 AS "destAddrLn1",
                    a.destCity AS "destCity",
                    a.destSt AS "destSt",
                    a.destZipCd AS "destZipCd"
                FROM chassis_filesarchive a
                    WHERE
                        archiveVersion = 0
            )
            WHERE
                "divisionCd" = ? AND
                "chassisNo" IN(?${",?".repeat(chassisList.length - 1)})`,
            [
                divisionCd
            ].concat(chassisList)
        );
    } catch (err) {
        console.error(err);
        req.error(541, err.message);
        return;
    }

    for (let chassis of chassisArr) {

        // Replace Denton plant code
        if (chassis.pltCd === '6') chassis.pltCd = 'D';

        // Enrich with the dealer region if one is not present but a business name is
        if (chassis.destBusName && !chassis.destSt) {
            const soldTo = salesOrderItems.find(function (item) { return (item.Material === chassis.material && item.to_SalesOrder.PurchaseOrderByCustomer === chassis.DTPONumber); }, { chassis }) ?? { "to_SalesOrder": { "SoldToParty": "" } };
            chassis.destSt = customers.find(customer => customer.customer === soldTo.to_SalesOrder.SoldToParty)?.region;
        }

        // Clean up postal codes
        // Dealer master data in sales tool sometimes is missing leading zeros on US zip codes,
        // or is missing the space in the middle of the Canadian zip codes.
        // US states whose zip codes start with 0
        if (chassis.destSt === 'ME' || chassis.destSt === 'NH' || chassis.destSt === 'VT' || chassis.destSt === 'MA' || chassis.destSt === 'RI' || chassis.destSt === 'CT' || chassis.destSt === 'NJ') {
            chassis.destZipCd = chassis.destZipCd.trim().padStart(5, '0');
            // Canadian territories/provinces - shift to upper case and add a space in the middle if it's missing
        } else if (chassis.destSt === 'AB' || chassis.destSt === 'BC' || chassis.destSt === 'MB' || chassis.destSt === 'NB' || chassis.destSt === 'NL' || chassis.destSt === 'NT' || chassis.destSt === 'NS' || chassis.destSt === 'NU' || chassis.destSt === 'ON' || chassis.destSt === 'PE' || chassis.destSt === 'QC' || chassis.destSt === 'SK' || chassis.destSt === 'YT') {
            chassis.destZipCd = chassis.destZipCd.trim().toUpperCase();
            if (chassis.destZipCd.length === 6) chassis.destZipCd = chassis.destZipCd.substring(0, 3) + ' ' + chassis.destZipCd.substring(3, 6);
        }

        // Default to Chillicothe plant for dealer pickup
        if (chassis.destZipCd && chassis.destSt && chassis.destZipCd.toUpperCase() === 'DEALER PIC' && chassis.destSt === 'OH') chassis.destZipCd = '45601';
        if (chassis.divisionCd && chassis.divisionCd === 'K' && chassis.pltCd && chassis.pltCd === 'J' && chassis.destCity && chassis.destCity.replace(/\s/g, '').toUpperCase() === 'DEALERPICKUP') {
            chassis.destSt = 'OH';
            chassis.destZipCd = '45601';
        }

        // Blank out "To Be Determined" addresses
        if (chassis.destZipCd?.toUpperCase() === 'TBD' || chassis.destBusName?.replace(/\s/g, '')?.toUpperCase() === 'TOBEDETERMINED' || chassis.destZipCd?.toUpperCase() === 'LOCATION') {
            chassis.destBusName = '';
            chassis.destCity = '';
            chassis.destZipCd = '';
            chassis.destAddrLn1 = '';
            chassis.destSt = '';
        }

        // Get archive version
        const p = archives.find(archive => (archive.divisionCd === chassis.divisionCd) && (archive.chassisNo === chassis.chassisNo) && (archive.DTPONumber === chassis.DTPONumber) && (archive.archiveVersion > 0));

        // Get generated S4 version 0
        const s4 = archives.find(archive => (archive.divisionCd === chassis.divisionCd) && (archive.chassisNo === chassis.chassisNo) && (archive.DTPONumber === chassis.DTPONumber) && (archive.archiveVersion === 0));

        chassis.archiveVersion = 0; // 0 in the active table, incremented when moved to the archive table
        chassis.isDelta = true; // Default to true until demonstrated there is no delta

        // IF a previous version was found, and IF there are no changes in the compared fields, then we've
        // proven that no changes exist, so flag it as isDelta = false which will prevent it from being
        // processed for material, classification or sales order changes.
        if (
            !_isDifferenceInChassis(s4, chassis) &&
            (p ? !_isDifferenceInChassis(p, chassis) : true)
        ) {
            chassis.isDelta = false;
        }

    }

    return chassisArr;

}

function _isDifferenceInChassis(p, chassis) {
    if (
        p &&
        (chassis.vinMfgCd === p.vinMfgCd || (chassis.vinMfgCd == null && p.vinMfgCd == null)) &&
        (chassis.vinModelCd === p.vinModelCd || (chassis.vinModelCd == null && p.vinModelCd == null)) &&
        (chassis.vinAxleCd === p.vinAxleCd || (chassis.vinAxleCd == null && p.vinAxleCd == null)) &&
        (chassis.vinEngineCd === p.vinEngineCd || (chassis.vinEngineCd == null && p.vinEngineCd == null)) &&
        (chassis.vinGVWRCd === p.vinGVWRCd || (chassis.vinGVWRCd == null && p.vinGVWRCd == null)) &&
        (chassis.vinUnuseCd === p.vinUnuseCd || (chassis.vinUnuseCd == null && p.vinUnuseCd == null)) &&
        (chassis.vinCheckDigitCd === p.vinCheckDigitCd || (chassis.vinCheckDigitCd == null && p.vinCheckDigitCd == null)) &&
        (chassis.vinYrCd === p.vinYrCd || (chassis.vinYrCd == null && p.vinYrCd == null)) &&
        (chassis.pltCd === p.pltCd || (chassis.pltCd == null && p.pltCd == null)) &&
        (chassis.engineSerNo === p.engineSerNo || (chassis.engineSerNo == null && p.engineSerNo == null)) &&
        (chassis.orderAddDt === p.orderAddDt || (chassis.orderAddDt == null && p.orderAddDt == null)) &&
        (chassis.tentSchedDt === p.tentSchedDt || (chassis.tentSchedDt == null && p.tentSchedDt == null)) &&
        (chassis.firmSchedDt === p.firmSchedDt || (chassis.firmSchedDt == null && p.firmSchedDt == null)) &&
        (chassis.frameSchedDt === p.frameSchedDt || (chassis.frameSchedDt == null && p.frameSchedDt == null)) &&
        (chassis.cabSchedDt === p.cabSchedDt || (chassis.cabSchedDt == null && p.cabSchedDt == null)) &&
        (chassis.reqDelDt === p.reqDelDt || (chassis.reqDelDt == null && p.reqDelDt == null)) &&
        (chassis.frameLnSeqNo === p.frameLnSeqNo || (chassis.frameLnSeqNo == null && p.frameLnSeqNo == null)) &&
        (chassis.cabLnSeqNo === p.cabLnSeqNo || (chassis.cabLnSeqNo == null && p.cabLnSeqNo == null)) &&
        (chassis.opsStatus === p.opsStatus || (chassis.opsStatus == null && p.opsStatus == null)) &&
        (chassis.destBusName === p.destBusName || (chassis.destBusName == null && p.destBusName == null)) &&
        (chassis.destAddrLn1 === p.destAddrLn1 || (chassis.destAddrLn1 == null && p.destAddrLn1 == null)) &&
        (chassis.destCity === p.destCity || (chassis.destCity == null && p.destCity == null)) &&
        (chassis.destSt === p.destSt || (chassis.destSt == null && p.destSt == null)) &&
        (chassis.destZipCd === p.destZipCd || (chassis.destZipCd == null && p.destZipCd == null))
    ) {
        return false;
    } else {
        return true;
    }
}

module.exports = {
    beforeCreateChassisFiles,
    onProcessChassisCSV,
    onArchiveChassisFiles,
    onPrepareChassisParallel,
    onGetNextChassisPacket,
    onGetOldestChassisError,
};