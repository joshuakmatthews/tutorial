const chai = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);
const { expect } = chai;

const backend = require('../../srv/BusinessPartnerBackend');
jest.mock('../../srv/BusinessPartnerBackend');
const Cut = require('../../srv/BusinessPartner'); // Class Under Test (CUT)

describe('Business Partner API', () => {

    const cut = new Cut(); //getMock());

    it('should get country US for single dealer D550', async () => {
        const mockBackendResponse = [ { "Customer": "D550", "to_BusinessPartnerAddress": [ { "Country": "US" }, { "Country": "US" } ] } ];
        backend.getAddressesForMultiple.mockResolvedValue(mockBackendResponse);
        const given = { customer: 'D550' };
        const result = (await cut.getAddressFor(given.customer))?.country;
        expect(result).to.equal('US');
    })

    it('should not find a country for dealer X999', async () => {
        const mockBackendResponse = [];
        backend.getAddressesForMultiple.mockResolvedValue(mockBackendResponse);
        const given = { customer: 'X999' };
        const result = (await cut.getAddressFor(given.customer))?.country;
        expect(result).to.be.undefined;
    })

    it('should get countries for 2 dealers at once', async () => {
        const mockBackendResponse = [ { "Customer": "D550", "to_BusinessPartnerAddress": [ { "Country": "US" }, { "Country": "US" } ] },
                       { "Customer": "Q055", "to_BusinessPartnerAddress": [ { "Country": "CA" }, { "Country": "CA" } ] } ];
        backend.getAddressesForMultiple.mockResolvedValue(mockBackendResponse);
        const given = { customers: ['D550', 'Q055'] };
        const result = await cut.getAddressForMultiple(given.customers);
        expect(result).to.containSubset([
            { customer: 'D550', country: 'US' },
            { customer: 'Q055', country: 'CA' }
        ]);
    })

    it('should get dealer owner group S040OG for dealer D550', async () => {
        const mockBackendResponse = [ { Customer: 'D550', SalesOrganization: '1010', DistributionChannel: '10', Division: 'PB', PartnerFunction: '1A', BPCustomerNumber: 'S040OG' } ];
        backend.getOwnerGroupFor.mockResolvedValue(mockBackendResponse);        
        const given = { dealer: { dealerCd: 'D550', salesOrg: '1010', division: 'PB' } };
        const result = await cut.getOwnerGroupFor(given.dealer);
        expect(result).to.equal('S040OG');
    })

});

/* Could use the below for dependency injection:
function getMock() {
    return {
        data: {
            A_BusinessPartner: [
                {
                    "Customer": "D550",
                    "to_BusinessPartnerAddress": [
                        { "Country": "US" },
                        { "Country": "US" }
                    ]
                },
                {
                    "Customer": "Q055",
                    "to_BusinessPartnerAddress": [
                        { "Country": "CA" },
                        { "Country": "CA" }
                    ]
                }
            ],
            A_CustSalesPartnerFunc: [
                {
                    Customer: 'D550',
                    SalesOrganization: '1010',
                    DistributionChannel: '10',
                    Division: 'PB',
                    PartnerFunction: '1A',
                    BPCustomerNumber: 'S040OG'
                }
            ]
        },

        async getAddressesForMultiple(customers) {
            return this.data.A_BusinessPartner.filter(td => customers.some(customer => customer === td.Customer));
        },

        async getOwnerGroupFor(dealer) {
            return this.data.A_CustSalesPartnerFunc.filter(pf => pf.Customer === dealer.dealerCd && pf.SalesOrganization === dealer.salesOrg && pf.DistributionChannel === '10' && pf.Division === dealer.division && pf.PartnerFunction === '1A');
        }
    }
}
*/