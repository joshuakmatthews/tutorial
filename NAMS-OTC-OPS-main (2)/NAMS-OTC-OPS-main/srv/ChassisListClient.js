const cds = require("@sap/cds");
const ZC_CHASSISLIST_CDS = cds.connect.to('ZC_CHASSISLIST_CDS');

module.exports = {

    getSalesOrdersForMultiple(materials) {
        return new Promise((resolve, reject) => {
            ZC_CHASSISLIST_CDS
                .then(svc => {
                    svc.run(
                        SELECT
                            .columns(col => {
                                col.Chassis,
                                col.SalesOrder
                            })
                            .from(svc.entities.ZC_ChassisList)
                            .where({
                                Chassis: { in: materials }, and: {
                                Reversed: false }
                            })
                            .orderBy({
                                ref: ["Chassis"]
                            }))
                        .then(results => {
                            resolve(results)
                        })
                        .catch(err => {
                            reject(err)
                        });
                })
                .catch(err => {
                    reject(err)
                })
        });
    }    
};
