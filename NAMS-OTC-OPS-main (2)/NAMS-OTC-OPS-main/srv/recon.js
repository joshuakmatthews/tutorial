const utility = require("./utility");

async function beforeCreateReconFiles (req) {
    req.data = await enrichRecon(req.data);
}

    // Process recon file CSV
async function onProcessReconFilesCSV (req, ReconFiles, ReconFilesCSV) {

        const filename = req.params[0];
        let reconFile;
        try {
            reconFile = await SELECT.one`csv`.from(ReconFilesCSV, filename);
        } catch (err) {
            console.error(err);
            req.error(556, err.message);
            return false;
        }

        let reconPacket = [];
        while (reconFile.csv) {
            let newLineIdx = reconFile.csv.indexOf('\n') > -1 ? reconFile.csv.indexOf('\n') : reconFile.csv.length;
            reconPacket = [];
            while (reconFile.csv && reconPacket.length < 1000) {
                const reconFields = reconFile.csv.substring(0, newLineIdx)
                    .split(',')
                    .map(field => field = field.trim() ? field.trim() : null);

                reconPacket.push(await enrichRecon({
                    "divisionCd": reconFields[0],
                    "chassisNo": reconFields[1],
                    "orderAddDt": reconFields[2] ? reconFields[2].substr(6, 4) + '-' + reconFields[2].substr(0, 2) + '-' + reconFields[2].substr(3, 2) + "T00:00:00Z" : null,
                    "DTPONumber": reconFields[3],
                    "startingChassis": reconFields[4],
                    "endingChassis": reconFields[5],
                    "netSalePrice": reconFields[6] ? Number(reconFields[6]) : null,
                    "exchangeRateAmt": reconFields[7] ? Number(reconFields[7]) : null,
                    "FETInd": reconFields[8],
                    "changeOrderNo": reconFields[9] ? Number(reconFields[9]) : null,
                    "FETGSTCd": reconFields[10],
                    "taxAmt": reconFields[11] ? Number(reconFields[11]) : null,
                    "procesingStatusCd": reconFields[12],
                    "plantCd": reconFields[13],
                    "tentSchedDt": reconFields[14] ? reconFields[14].substr(6, 4) + '-' + reconFields[14].substr(0, 2) + '-' + reconFields[14].substr(3, 2) : null,
                    "firmSchedDt": reconFields[15] ? reconFields[15].substr(6, 4) + '-' + reconFields[15].substr(0, 2) + '-' + reconFields[15].substr(3, 2) : null,
                    "creditStatus": reconFields[16] ? reconFields[16] : null
                }));

                reconFile.csv = reconFile.csv.substring(newLineIdx + 1);
                newLineIdx = reconFile.csv.indexOf('\n') > -1 ? reconFile.csv.indexOf('\n') : reconFile.csv.length;

            }

            try {
                await INSERT.into(ReconFiles, reconPacket);
            } catch (err) {
                console.error(err);
                req.error(557, err.message);
                return false;
            }
        }

        try {
            await UPDATE(ReconFilesCSV, filename).with({ isProcessed: true });
            const cutoff = new Date(new Date().setDate(new Date().getDate() - 30)).toJSON().replace('T', ' ').replace('Z', '');
            await DELETE.from(ReconFilesCSV).where({ modifiedAt: { '<': cutoff } });
        } catch (err) {
            console.error(err);
            req.error(558, err.message);
            return false;
        }

        return true;

    }

    async function enrichRecon(recon) {
        // Map OPS division to S4 division
        recon.division = await utility.OPSToS4Division(recon.divisionCd);
        // Transform "G" to "Y"
        recon.canadianTaxesInd = recon.FETGSTCd === "G" ? "Y" : "N";
        // Infer currency from exchange rate
        recon.currency = utility.getCurrency(recon.exchangeRateAmt);
        recon.chassisNetPrice = recon.netSalePrice; // Convert integer to decimal
        recon.exchangeRate = (recon.exchangeRateAmt / 100).toPrecision(5); // Convert and divide; toPrecision(5) avoids floating point errors like 128.20 --> 1.28199
        if (recon.exchangeRate === '1.0000') recon.exchangeRate = 0; // 0 and 1 are both to be treated as 0 or no exchange rate
        recon.taxAmount = recon.taxAmt; // Convert integer to decimal
        return recon;
    }
    
module.exports = {
    beforeCreateReconFiles,
    onProcessReconFilesCSV,
};