jest.setTimeout(600000);
const cds = require('@sap/cds/lib');
cds.User.default = cds.User.Privileged; // Force authentication to succeed
const { expect } = cds.test(__dirname + '/../..');
const Cut = require('../../srv/BusinessPartner'); // Class Under Test (CUT)

describe('Business Partner API', () => {

    const cut = new Cut();

    it('should get country US for single dealer D550', async () => {
        const given = { customer: 'D550' };
        const result = (await cut.getAddressFor(given.customer))?.country;
        expect(result).to.equal('US');
    }, 600000)

    it('should not find a country for dealer X999', async () => {
        const given = { customer: 'X999' };
        const result = (await cut.getAddressFor(given.customer))?.country;
        expect(result).to.be.undefined;
    })

    it('should get countries for 2 dealers at once', async () => {
        const given = { customers: ['D550', 'Q055'] };
        const result = await cut.getAddressForMultiple(given.customers);
        expect(result).to.containSubset([
            { customer: 'D550', country: 'US' },
            { customer: 'Q055', country: 'CA' }
        ]);
    })

    it('should get dealer owner group S040OG for dealer D550', async () => {
        const given = { dealerCd: 'D550', salesOrg: '1010', division: 'PB' };
        const result = await cut.getOwnerGroupFor(given.dealerCd, given.salesOrg, given.division);
        expect(result).to.equal('S040OG');
    })

});
