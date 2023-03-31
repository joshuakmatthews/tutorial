const Select = require('../../srv/Select');
const chai = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);
const expect = chai.expect;

describe('includesAllColumns', () => {

    it('should return true when all columns are implicitly included', () => {
        const select = new Select();
        expect(select.includesAllColumns).to.be.true;
    });

    it('should return true when all columns are explicitly included via *', () => {
        const select = new Select({columns: ['*']});
        expect(select.includesAllColumns).to.be.true;
    });

    it('should return false when any column is explicitly listed', () => {
        const select = new Select({columns: [{ ref: ['ID'] }]});
        expect(select.includesAllColumns).to.be.false;
    });

});

describe('includesColumn', () => {

    it('should return true when all columns are implicitly included', () => {
        const select = new Select();
        const result = select.includesColumn('dealerCd');
        expect(result).to.be.true;
    });

    it('should return true when all columns are explicitly included via *', () => {
        const select = new Select({columns: ['*']});
        const result = select.includesColumn('dealerCd');
        expect(result).to.be.true;
    });

    it('should return true when the column is individually specified', () => {
        const select = new Select({columns: [{ ref: ['dealerCd'] }]});
        const result = select.includesColumn('dealerCd');
        expect(result).to.be.true;
    });

    it('should return false when this column is not individually specified but others are', () => {
        const select = new Select({columns: [{ ref: ['ID'] }]});
        const result = select.includesColumn('dealerCd');
        expect(result).to.be.false;
    });

    it('should return true when the virtual column is individually specified', () => {
        const select = new Select({columns: [{ as: 'salesOrder' }]});
        const result = select.includesColumn('salesOrder');
        expect(result).to.be.true;
    });

});

describe('addColumn', () => {

    it('should add the column to the list of individual columns', () => {
        const select = new Select({columns: [{ ref: ['ID'] }]});
        select.addColumn('dealer');
        expect(select.SELECT.columns).to.containSubset([{ "ref": ["dealer"] }]);
    });

    it('should do nothing when all columns are implicitly included', () => {
        const select = new Select();
        select.addColumn('dealer');
        expect(select.columns).to.be.undefined;
    });

    it('should do nothing when all columns are explicitly included via *', () => {
        const select = new Select({columns: ['*']});
        select.addColumn('dealer');
        expect(select.SELECT.columns).to.not.include('dealer');
    });

});

describe('removeColumn', () => {

    it('should remove the column when it\'s individually specified', () => {
        const select = new Select({columns: [{ ref: ['ID'] }, { ref: ['dealer'] }]});
        const result = select.removeColumn('dealer');
        expect(result).to.containSubset([{ "ref": ["dealer"] }]);
        expect(select.columns).to.not.containSubset([{ "ref": ["dealer"] }]);
    });

    it('should do nothing when the column is not individually specified but others are', () => {
        const select = new Select({columns: [{ ref: ['ID'] }]});
        const result = select.removeColumn('dealer');
        expect(result).to.be.null;
    });

    it('should throw an exception when all columns are implicitly included', () => {
        const select = new Select();
        expect(() => {
            select.removeColumn('dealer');
        }).to.throw();
    });

    it('should throw an exception when all columns are explicitly included via *', () => {
        const select = new Select({columns: ['*']});
        expect(() => {
            select.removeColumn('dealer');
        }).to.throw();
    });

});

describe('Expands', () => {

    let select;

    beforeEach(() => {
        select = new Select({
            columns: [
                { ref: ['ID'] },
                { ref: ['divisionCd'] },
                { ref: ['DTPONumber'] },
                { ref: ['chassisNo'] },
                {
                    ref: ['Chassis'],
                    expand: [
                        { ref: ['order_ID'] },
                        { ref: ['chassisNo'] },
                        { ref: ['salesOrderItem'] },
                        { as: 'billingDate' },
                        { as: 'salesOrder' }
                    ]
                }
            ]
        });
    });

    it('should include the Chassis expand and it should be an instance of Select', () => {
        const result = select.expands.Chassis;
        expect(result).to.be.an.instanceOf(Select);
        expect(result.SELECT).to.have.property('columns').with.lengthOf(5);
        expect(result.SELECT.columns).to.containSubset([{ ref: ['order_ID']}]);
    });

    it('should not include non-existing expand', () => {
        const result = select.expands.nonExistingExpand;
        expect(result).to.be.undefined;
    });

    it('should include column salesOrderItem in the Chassis expand', () => {
        const result = select.expands.Chassis?.includesColumn('salesOrderItem');
        expect(result).to.be.true;
    });

    it('should include virtual column salesOrder in the Chassis expand', () => {
        const result = select.expands.Chassis?.includesColumn('salesOrder');
        expect(result).to.be.true;
    })

    it('should not include the non-existing column in the Chassis expand', () => {
        const result = select.expands.Chassis?.includesColumn('non-existing-column');
        expect(result).to.be.false;
    });

    it('should remove the Chassis expand', () => {
        const result = select.removeExpand('Chassis');
        expect(result).to.containSubset([{ "ref": ["Chassis"] }]);
        expect(select).to.not.have.property('Chassis');
    })

    it('should do nothing when attempting to remove a non-existing expand', () => {
        const result = select.removeExpand('non-existing-expand');
        expect(result).to.be.null;
    })

});

describe('temporary columns and expands', () => {

    let select;

    beforeEach(() => {
        select = new Select({
            columns: [
                { ref: ['ID'] },
                { ref: ['divisionCd'] },
                { ref: ['DTPONumber'] },
                { ref: ['chassisNo'] },
                {
                    ref: ['Chassis'],
                    expand: [
                        { ref: ['order_ID'] },
                        { ref: ['chassisNo'] },
                        { ref: ['salesOrderItem'] },
                        { as: 'billingDate' },
                        { as: 'salesOrder' }
                    ]
                }
            ]
        });
    });

    it('should add then remove the temporary salesOrder column', () => {
        select.addTempColumn('salesOrder');
        let result = select.includesColumn('salesOrder');
        expect(result).to.be.true;

        select.removeTempColumnsAndExpands();
        result = select.includesColumn('ID'); //Should still include column ID
        expect(result).to.be.true;
        result = select.includesColumn('salesOrder'); //But temp column salesOrder should have been removed
        expect(result).to.be.false;
    });

    it('should add then remove the temporary Chassis.salesOrder column', () => {
        // GIVEN
        select.addTempColumn('salesOrder');
        select.expands.Chassis.addTempColumn('updateIndicator');

        // WHEN
        select.removeTempColumnsAndExpands();

        // THEN
        let result = select.includesColumn('ID');
        expect(result).to.be.true;
        result = select.expands.Chassis.includesColumn('salesOrderItem');
        expect(result).to.be.true;
        result = select.includesColumn('salesOrder');
        expect(result).to.be.false;
        result = select.includesColumn('updateIndicator');
        expect(result).to.be.false;
    });

    it('should add then remove the temporary Options expand', () => {
        select.addTempExpand('Options');
        let result = select.getExpandIndex('Options');
        expect(result).to.be.above(-1);

        select.removeTempColumnsAndExpands();
        result = select.getExpandIndex('Chassis');
        expect(result).to.be.above(-1);
        result = select.getExpandIndex('Options');
        expect(result).to.equal(-1);
    });
});