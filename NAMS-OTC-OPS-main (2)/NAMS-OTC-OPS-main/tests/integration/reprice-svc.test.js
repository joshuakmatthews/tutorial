const cds = require('@sap/cds/lib');
cds.User.default = cds.User.Privileged; // forces authentication
const test = cds.test(__dirname + '/../..');
const { POST, expect } = test;

describe('on RepriceMismatches', () => {

    let ManageService = {};

    beforeAll(async () => {
        ManageService = await cds.connect.to('ManageService');
    });

    it('should fill in salesOrg = 1010 and soldToCountry = US when repricing an order', async () => {

        // GIVEN
        await UPDATE(ManageService.entities.MsgOrders).with({ listPrice: 0 }).where({ divisionCd: 'K', DTPONumber: '10088067', chassisNo: '355906', current: true });

        // Verify the setup worked and the test order has listPrice = 0 so that repricing will work
        const setup = await SELECT`ID, listPrice`.from(ManageService.entities.MsgOrders).where({ divisionCd: 'K', DTPONumber: '10088067', chassisNo: '355906', current: true });
        expect(setup).to.have.lengthOf(1);
        expect(setup[0]).to.have.property('listPrice', 0);

        // WHEN
        const { data } = await POST(`/reprice/RepriceMismatches`, { "ids": [ setup[0].ID ] });

        // THEN
        expect(data.value).to.have.lengthOf(1);
        expect(data.value).to.containSubset([
            { new: { listPrice: 273502 } },
            { old: { listPrice: 0 } }
        ]);

        const msg = await SELECT`salesOrg, soldToCountry`.from(ManageService.entities.MsgOrders, data.value[0].new.ID);

        expect(msg).to.containSubset({
            salesOrg: '1010',
            soldToCountry: 'US'
        });

    });

});
