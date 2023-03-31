const client = require('./BusinessPartnerClient');

module.exports = class BusinessPartner {

    getAddressFor(customer) {
        return new Promise((resolve, reject) => {
            this.getAddressForMultiple([customer])
                .then(addresses => {
                    resolve(addresses[0]);
                })
                .catch(err => {
                    reject(err)
                })
        });
    }

    getAddressForMultiple(customers) {
        if (customers && Array.isArray(customers) && customers.length > 0) {
            return new Promise((resolve, reject) => {
                client.getAddressesForMultiple(customers)
                    .then(addresses => {
                        resolve(addresses.map(({Customer: customer, to_BusinessPartnerAddress: [{Country: country, Region: region}]}) => ({customer, country, region})))
                    })
                    .catch(err => {
                        reject(err)
                    })
            });
        }
    }

    getOwnerGroupFor(dealerCd, salesOrg, division) {
        return new Promise((resolve, reject) => {
            client.getOwnerGroupFor(dealerCd, salesOrg, division)
                .then(ownerGroups => {
                    resolve(ownerGroups[0].BPCustomerNumber)
                })
                .catch(err => {
                    reject(err)
                })
        });
    }
}
