const cds = require("@sap/cds");
const API_BUSINESS_PARTNER = cds.connect.to('API_BUSINESS_PARTNER');

module.exports = {

    getAddressesForMultiple(customers) {
        return new Promise((resolve, reject) => {
            API_BUSINESS_PARTNER
                .then(svc => {
                    svc.run(
                        SELECT
                            .columns(bp => {
                                bp.Customer,
                                bp.to_BusinessPartnerAddress(addr => {
                                    addr.Country,
                                    addr.Region
                                })
                            })
                            .from(svc.entities.A_BusinessPartner)
                            .where({
                                Customer: { in: customers }
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
    },

    getOwnerGroupFor(dealerCd, salesOrg, division) {
        return new Promise((resolve, reject) => {
            API_BUSINESS_PARTNER
                .then(svc => {
                    svc.run(
                        SELECT
                            .columns(bp => {
                                bp.BPCustomerNumber
                            })
                            .from(svc.entities.A_CustSalesPartnerFunc)
                            .where({
                                Customer: dealerCd,
                                SalesOrganization: salesOrg,
                                DistributionChannel: '10',
                                Division: division,
                                PartnerFunction: '1A'
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
