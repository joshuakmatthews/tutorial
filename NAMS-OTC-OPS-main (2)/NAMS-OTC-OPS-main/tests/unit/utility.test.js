const cds = require('@sap/cds/lib');
cds.User.default = cds.User.Privileged; // forces authentication
const { expect } = cds.test(__dirname + '/../..', (cds.env?.env === 'mock') ? '--with-mocks' : '');
const utility = require("../../srv/utility");
jest.setTimeout(600000);

describe('getChassisOffset', () => {
    it('should return next higher chassis number', () => {
        const result = utility.getChassisOffset('000001', 1);
        expect(result).to.equal('000002');
    });

    it('should return next lower chassis number', () => {
        const result = utility.getChassisOffset('000002', -1);
        expect(result).to.equal('000001');
    });
});

describe('getCurrency', () => {
    it('should return USD when exchange rate is 0', () => {
        const result = utility.getCurrency(0);
        expect(result).to.equal('USD');
    });

    it('should return USD when exchange rate is 100', () => {
        const result = utility.getCurrency(100);
        expect(result).to.equal('USD');
    });

    it('should return CAD when exchange rate is greater than 0 and less than 100', () => {
        const result = utility.getCurrency(99);
        expect(result).to.equal('CAD');
    });

    it('should return CAD when exchange rate is greater than 100', () => {
        const result = utility.getCurrency(101);
        expect(result).to.equal('CAD');
    });
});

describe('getDBDate', () => {
    it('should return date in yyyy-MM-dd format when timezone is default', () => {
        const result = utility.getDBDate(new Date('2022-11-03T08:00:00.000Z'));
        expect(result).to.equal('2022-11-03');
    });

    it('should return date in yyyy-MM-dd format when timezone is UTC', () => {
        const result = utility.getDBDate(new Date('2022-11-03T00:00'), 'UTC');
        expect(result).to.equal('2022-11-03');
    });
});

describe('getMaterialFromChassis', () => {
    it('should return material number with chassis, 2-digit year and division', () => {
        const result = utility.getMaterialFromChassis('000001', '2022-11-03', 'KW');
        expect(result).to.equal('000001-22-KW');
    })
});

describe('getUnique', () => {
    it('should return an empty array when given an empty array', () => {
        const result = utility.getUnique([], 'any');
        expect(result).to.be.an('array').that.is.empty;
    });

    it('should return an empty array when given a non-array', () => {
        const result = utility.getUnique(null, 'any');
        expect(result).to.be.an('array').that.is.empty;
    });
    
    it('should return option codes without duplicates', () => {
        // GIVEN
        const options = [
            { text: "0000001" },
            { text: "0000001" },
            { text: "0000002" },
            { text: "0000002" },
        ]
        // WHEN
        const result = utility.getUnique(options, 'text');
        // THEN
        expect(result).to.have.lengthOf(2);
        expect(result).to.deep.equal([
            "0000001",
            "0000002",
        ]);
    });
    
});

describe('getSalesOrg', () => {
    it('should return 1010 for US', () => {
        const result = utility.getSalesOrg('US');
        expect(result).to.equal('1010');
    });

    it('should return 2010 for CA', () => {
        const result = utility.getSalesOrg('CA');
        expect(result).to.equal('2010');
    });

    it('should default to 1010', () => {
        const order = {};
        const result = utility.getSalesOrg(order.soldToCountry);
        expect(result).to.equal('1010');
    });
});

describe('OPSToS4Division', () => {
    it('should return KW when given K', async () => {
        const result = await utility.OPSToS4Division('K');
        expect(result).to.equal('KW');
    });

    it('should return F when given F', async () => {
        const result = await utility.OPSToS4Division('F');
        expect(result).to.equal('F');
    }, 600000);
});
