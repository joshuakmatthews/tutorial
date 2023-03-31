/**
 * Start tests with Jest or Mocha from the CLI with e.g.:
 * - npx jest ./tests/integration
 * 
 * Or use one of the scripts from package.json e.g.:
 * - npm run jest-hybrid
 * - npm run mocha-mock-verbose
 * 
 * To debug tests, adjust the test-debug script in package.json to use the desired env,
 * runner, etc. and then set breakpoints and launch the debug profile "npm run test-debug".
 */
const cds = require('@sap/cds/lib');
cds.User.default = cds.User.Privileged; // forces authentication
const { GET, POST, DEL, expect } = cds.test(__dirname + '/../..', (cds.env?.env === 'mock') ? '--with-mocks' : '');

describe('Carry Forward Fields', () => {

    const testOrderId = 'fd3f7f2d-0937-4f9e-abac-766f89ac336e';

    let ManageService = {};
    let MsgOrders = {};
    let split = {};
    let splitOffOrders = [];
    let testOrder = {};

    beforeAll(async () => {
        // Retrieve the test order by DB select (bypass entity handler)
        ManageService = await cds.connect.to('ManageService');
        ({ MsgOrders } = ManageService.entities);
    });

    beforeEach(async () => {
        /**
         * Get the order for the test
         */
        testOrder = await SELECT.from(MsgOrders, testOrderId, order => {
            order.ID,
                order.divisionCd,
                order.DTPONumber,
                order.chassisNo,
                order.endingChassis,
                order.fleetQty,
                order.createTimestamp,
                order.current,
                order.salesOrder
        });
        expect(testOrder).to.containSubset({ divisionCd: 'P', DTPONumber: '10039849', chassisNo: '213052', endingChassis: '213060', salesOrder: '0000053705', current: true, fleetQty: 9 });

        /**
         * Adjust createTimestamp to 10 seconds later to simulate a split coming shortly after creation
         */
        let createTimestamp = new Date(testOrder.createTimestamp);
        createTimestamp.setSeconds(createTimestamp.getSeconds() + 10);

        /**
         * Split the last chassis off the order
         */
        ({ data: split } = await POST(`/manage/MsgOrders`, {
            "action": "Split",
            "chassisNo": testOrder.endingChassis,
            "createTimestamp": createTimestamp.toJSON(),
            "divisionCd": testOrder.divisionCd,
            "DTPONumber": testOrder.DTPONumber,
            "endingChassis": testOrder.endingChassis,
            "startingChassis": testOrder.endingChassis,
        }));

        expect(split).to.include({ splitOrder_ID: testOrderId });
    }, 600000);

    it('should copy the billingDate from the split-from order to the split-to orders', async () => {

        /**
         * Verify existing order has been replaced by split-off orders
         * Here we retrieve the order via the GET function to ensure it runs through the entity handlers to populate the virtual fields
         */
        ({ data: testOrder } = await GET(`/manage/MsgOrders(${testOrderId})?$select=current,newerMessage_ID&$expand=Chassis($select=billingDate,invoiceBlockStatus)`));
        expect(testOrder.current).to.be.false;
        expect(testOrder).to.have.property('newerMessage_ID').with.lengthOf(36);

        ({ data: { value: splitOffOrders } } = await GET(`/manage/MsgOrders?$select=current,splitOrder_ID&$filter=splitOrder_ID eq ${testOrder.ID}&$expand=Chassis($select=billingDate,invoiceBlockStatus)`));
        expect(splitOffOrders).to.have.lengthOf(2);
        expect(splitOffOrders).to.containSubset([
            {
                ID: testOrder.newerMessage_ID,
                current: true,
                splitOrder_ID: testOrder.ID,
                Chassis: [
                    { chassisNo: '213052', billingDate: '2022-01-04', invoiceBlockStatus: 'BLCK' },
                    { chassisNo: '213053', billingDate: '2022-01-04', invoiceBlockStatus: 'BLCK' },
                    { chassisNo: '213054', billingDate: '2022-01-04', invoiceBlockStatus: 'BLCK' },
                    { chassisNo: '213055', billingDate: '2022-01-04', invoiceBlockStatus: 'BLCK' },
                    { chassisNo: '213056', billingDate: '2022-01-04', invoiceBlockStatus: 'BLCK' },
                    { chassisNo: '213057', billingDate: '2022-01-04', invoiceBlockStatus: 'BLCK' },
                    { chassisNo: '213058', billingDate: '2022-01-04', invoiceBlockStatus: 'BLCK' },
                    { chassisNo: '213059', billingDate: '2022-01-04', invoiceBlockStatus: 'BLCK' },
                ]
            },
            {
                current: true,
                splitOrder_ID: testOrder.ID,
                Chassis: [
                    { chassisNo: '213060', billingDate: '2022-01-04', invoiceBlockStatus: 'BLCK' },
                ]
            }
        ]);

    }, 600000);

    it('should read the billing block code from S4 and copy it to the split-to orders', async () => {

        /**
         * Verify existing order has been replaced by split-off orders
         * Here we retrieve the order via the GET function to ensure it runs through the entity handlers to populate the virtual fields
         */
        ({ data: testOrder } = await GET(`/manage/MsgOrders(${testOrderId})?$select=billingBlockCd,current,newerMessage_ID`));
        expect(testOrder.billingBlockCd).to.be.null;
        expect(testOrder.current).to.be.false;
        expect(testOrder).to.have.property('newerMessage_ID').with.lengthOf(36);

        ({ data: { value: splitOffOrders } } = await GET(`/manage/MsgOrders?$select=billingBlockCd,current,orderSaved,salesOrder,splitOrder_ID&$filter=splitOrder_ID eq ${testOrder.ID}`));
        expect(splitOffOrders).to.have.lengthOf(2);
        expect(splitOffOrders).to.containSubset([
            {
                ID: testOrder.newerMessage_ID,
                billingBlockCd: 'Z2',
                current: true,
                orderSaved: false,
                salesOrder: '0000053705',
                splitOrder_ID: testOrder.ID
            },
            {
                billingBlockCd: 'Z2',
                current: true,
                orderSaved: false,
                salesOrder: null,
                splitOrder_ID: testOrder.ID
            }
        ]);

        // Get the split-off order that we're going to send an update for
        const [splitOffOrder] = await SELECT
            .from(MsgOrders)
            .columns(order => {
                order.action,
                    order.actualDeliveryDt,
                    order.allocationDt,
                    order.auxTransCd,
                    order.bodyHgt,
                    order.bodyLadenCpcty,
                    order.bodyLgth,
                    order.bodyType,
                    order.bumperLength,
                    order.cabAxleDimeension,
                    order.cabEOFDimeension,
                    order.cabLineSequenceNo,
                    order.cabScheduleDt,
                    order.CARAmt,
                    order.CARNumber,
                    order.CARPct,
                    order.changeOrderDtTm,
                    order.changeOrderNo,
                    order.chasHwyPct,
                    order.chassisNo,
                    order.chassisPrevNo,
                    order.chassisStatusComment,
                    order.chassisSystemStatus,
                    order.chasMetricCustmryInd,
                    order.chasOpsClassBPct,
                    order.chasOpsClassCPct,
                    order.chasOpsClassDPct,
                    order.chngOrdChrg,
                    order.comdtyHaulID,
                    order.cornerRadius,
                    order.costModelCd,
                    order.createTimestamp,
                    order.credInDtTm,
                    order.credOutDtTm,
                    order.ctrlnAxle,
                    order.cuPoNo,
                    order.custNo,
                    order.customerNm,
                    order.customerStockCd,
                    order.dealerCd,
                    order.divisionCd,
                    order.dlrBasePriceAmt,
                    order.dlrPoPresentId,
                    order.DTPONumber,
                    order.endingChassis,
                    order.engineCd,
                    order.engineClassCd,
                    order.estimatedDeliveryDt,
                    order.exchangeRateAmt,
                    order.FETInd,
                    order.FETGSTCd,
                    order.FET,
                    order.fifthWheelCd,
                    order.firmScheduleDt,
                    order.fleetQty,
                    order.frameCd,
                    order.frameLineSequenceNo,
                    order.frameScheduleDt,
                    order.frontAxleBOCDimeension,
                    order.frontAxleCd,
                    order.frontAxleLoad,
                    order.gawrFirstRear,
                    order.gawrFront,
                    order.gawrRear,
                    order.gawrSecRear,
                    order.gcw,
                    order.gvwr,
                    order.intendSvcClass,
                    order.interCompDisc,
                    order.interDivDisc,
                    order.invcTermDays,
                    order.kingPinSet,
                    order.mainTransCd,
                    order.maxGradePct,
                    order.messageType,
                    order.modelCd,
                    order.noTrlrAxle,
                    order.operAreaDesc,
                    order.operAreaHgt,
                    order.operAreaLgth,
                    order.operAreaWidth,
                    order.orderAddDt,
                    order.orderCancelDt,
                    order.orderReceivedDt,
                    order.orderType,
                    order.plantCd,
                    order.priceEffectiveDt,
                    order.procesingStatusCd,
                    order.prodConvChrg,
                    order.promoProgCd,
                    order.promoProgPct,
                    order.rearAxleCd,
                    order.rearAxleLoad,
                    order.rearAxleRatio,
                    order.rearAxleRatioCd,
                    order.releaseWriter,
                    order.requestedDeliveryDt,
                    order.shippingDestination,
                    order.spclRqmntCd1,
                    order.spclRqmntCd2,
                    order.spclRqmntCd3,
                    order.spclRqmntCd4,
                    order.startingChassis,
                    order.stateProvinceCd,
                    order.statusCode,
                    order.stdDlrDiscPct,
                    order.suspensionCd,
                    order.tentativeScheduleDt,
                    order.tireRollRadius,
                    order.trlrHgt,
                    order.trlrLgth,
                    order.trlrType,
                    order.unitTypeCd,
                    order.wheelbase,
                    order.Options(option => {
                        option.status,
                            option.text
                    }),
                    order.Narratives(narrative => {
                        narrative.approvalCd,
                            narrative.cd,
                            narrative.text
                    })
            })
            .where({
                ID: (splitOffOrders.find(order => order.salesOrder === null)).ID
            });

        // Adjust createTimestamp to 10 seconds later to simulate an update arriving for the split-off order
        let createTimestamp = new Date(splitOffOrder.createTimestamp);
        createTimestamp.setSeconds(createTimestamp.getSeconds() + 10);
        splitOffOrder.createTimestamp = createTimestamp.toJSON();

        // Update the split-off order
        ({ data: updateOrder } = await POST(`/manage/MsgOrders`, splitOffOrder));
        splitOffOrders.push(updateOrder); // So it will get cleaned up by afterEach()

        expect(updateOrder).to.have.property('billingBlockCd', 'Z2');

    }, 600000);

    /**
     * Reset the order messages after the test
     */
    afterEach(async () => {
        for (let order of splitOffOrders) await DEL(`/manage/MsgOrders(${order.ID})`);
        await POST(`/manage/setCurrent`, { orderIds: [testOrderId], newerMessageId: null, current: true });
        await DEL(`/manage/MsgSplits(${split.ID})`);
    });

});
