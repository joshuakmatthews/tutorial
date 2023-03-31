jest.setTimeout(600000);
const cds = require('@sap/cds/lib');
cds.User.default = cds.User.Privileged; // Force authentication to succeed
const { expect } = cds.test(__dirname + '/../..');
const Cut = require('../../srv/ChassisList'); // Class Under Test (CUT)

describe('Chassis List Svc', () => {

    const cut = new Cut();

    it('should get sales order 53575 for material 294205-22-KW', async () => {
        const given = { materials: ['294205-22-KW'] };
        const result = await cut.getSalesOrdersForMultiple(given.materials);
        expect(result).to.containSubset([
            { salesOrder: '0000053575', material: '294205-22-KW' }
        ]);
    }, 600000)

});
