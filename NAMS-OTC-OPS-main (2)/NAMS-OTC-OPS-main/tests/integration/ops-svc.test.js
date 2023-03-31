const cds = require('@sap/cds/lib');
cds.User.default = cds.User.Privileged; // forces authentication
const test = cds.test(__dirname + '/../..');
const { GET, POST, DEL, expect } = test; // Use DEL to avoid conflicts with cds.ql.DELETE

//const backend = require('../../srv/ChassisListBackend');
//jest.mock('../../srv/ChassisListBackend');

describe('before CREATE MsgOrders', () => {

    let cleanup = [];

    it('should fill in soldToCountry = US and dealerOwnerGrp = S040OG', async () => {

        // GIVEN
        const testMsg = {
            "action": null,
            "actualDeliveryDt": null,
            "allocationDt": null,
            "auxTransCd": null,
            "bodyHgt": null,
            "bodyLadenCpcty": null,
            "bodyLgth": null,
            "bodyType": null,
            "bumperLength": null,
            "cabAxleDimeension": null,
            "cabEOFDimeension": null,
            "cabLineSequenceNo": "O3234C0",
            "cabScheduleDt": "2023-02-24",
            "CARAmt": null,
            "CARNumber": "01611780",
            "CARPct": 39.25,
            "changeOrderDtTm": "2023-01-06T12:13:46Z",
            "changeOrderNo": 3,
            "chasHwyPct": null,
            "chassisNo": "000701",
            "chassisPrevNo": "841419",
            "chassisStatusComment": null,
            "chassisSystemStatus": "IO",
            "chasMetricCustmryInd": null,
            "chasOpsClassBPct": null,
            "chasOpsClassCPct": null,
            "chasOpsClassDPct": null,
            "chngOrdChrg": 0,
            "comdtyHaulID": null,
            "cornerRadius": null,
            "costModelCd": "579-8R",
            "createTimestamp": "2023-02-12T08:56:54.806Z",
            "credInDtTm": "2022-11-08T11:09:57Z",
            "credOutDtTm": "2023-02-10T10:28:18Z",
            "ctrlnAxle": null,
            "cuPoNo": null,
            "custNo": "JJVH",
            "customerNm": "TPINE LEASING",
            "customerStockCd": "C",
            "dealerCd": "D550",
            "divisionCd": "P",
            "dlrBasePriceAmt": 0,
            "dlrPoPresentId": "X15 500HP",
            "DTPONumber": "IT000701",
            "endingChassis": "000710",
            "engineCd": null,
            "engineClassCd": null,
            "estimatedDeliveryDt": "2023-03-04",
            "exchangeRateAmt": 100,
            "FETInd": "Y",
            "FETGSTCd": "F",
            "FET": "017497",
            "fifthWheelCd": null,
            "firmScheduleDt": "2023-02-27",
            "fleetQty": 10,
            "frameCd": null,
            "frameLineSequenceNo": "O3305F0",
            "frameScheduleDt": "2023-02-27",
            "frontAxleBOCDimeension": null,
            "frontAxleCd": null,
            "frontAxleLoad": null,
            "gawrFirstRear": 9072,
            "gawrFront": 5987.5,
            "gawrRear": 0,
            "gawrSecRear": 9072,
            "gcw": 36288,
            "gvwr": 24131.5,
            "intendSvcClass": null,
            "interCompDisc": 0,
            "interDivDisc": 0,
            "invcTermDays": 15,
            "kingPinSet": null,
            "mainTransCd": null,
            "maxGradePct": null,
            "messageType": "UpdateNAMSOrder",
            "modelCd": "0005791",
            "noTrlrAxle": 2,
            "operAreaDesc": null,
            "operAreaHgt": null,
            "operAreaLgth": null,
            "operAreaWidth": null,
            "orderAddDt": "2022-10-12",
            "orderCancelDt": null,
            "orderReceivedDt": "2022-10-11",
            "orderType": "O",
            "plantCd": "D",
            "priceEffectiveDt": "2023-01-01",
            "procesingStatusCd": "OVPS",
            "prodConvChrg": 0,
            "promoProgCd": "0000000",
            "promoProgPct": 0,
            "rearAxleCd": "1526150",
            "rearAxleLoad": 18144,
            "rearAxleRatio": 0,
            "rearAxleRatioCd": "1702790",
            "releaseWriter": "JXA",
            "requestedDeliveryDt": "2023-03-27",
            "shippingDestination": "D550 PDI",
            "spclRqmntCd1": null,
            "spclRqmntCd2": null,
            "spclRqmntCd3": null,
            "spclRqmntCd4": null,
            "startingChassis": "000701",
            "stateProvinceCd": "XX",
            "statusCode": null,
            "stdDlrDiscPct": 77,
            "suspensionCd": null,
            "tentativeScheduleDt": "2023-02-27",
            "tireRollRadius": null,
            "trlrHgt": null,
            "trlrLgth": null,
            "trlrType": null,
            "unitTypeCd": "1",
            "wheelbase": 6070.6,
            "Options": [
                {
                    "status": "Ok",
                    "text": "0890540"
                },
                {
                    "status": "Ok",
                    "text": "1390540"
                },
                {
                    "status": "Ok",
                    "text": "1680490"
                },
                {
                    "status": "Ok",
                    "text": "7040180"
                },
                {
                    "status": "Ok",
                    "text": "7855180"
                },
                {
                    "status": "Ok",
                    "text": "1391410"
                },
                {
                    "status": "Ok",
                    "text": "1680750"
                },
                {
                    "status": "Ok",
                    "text": "0891240"
                },
                {
                    "status": "Ok",
                    "text": "6811510"
                },
                {
                    "status": "Ok",
                    "text": "2091300"
                },
                {
                    "status": "Ok",
                    "text": "0091090"
                },
                {
                    "status": "Ok",
                    "text": "0096010"
                },
                {
                    "status": "Ok",
                    "text": "1660000"
                },
                {
                    "status": "Ok",
                    "text": "6812780"
                },
                {
                    "status": "Ok",
                    "text": "0960020"
                },
                {
                    "status": "Ok",
                    "text": "1922390"
                },
                {
                    "status": "Ok",
                    "text": "2539600"
                },
                {
                    "status": "Ok",
                    "text": "5652570"
                },
                {
                    "status": "Ok",
                    "text": "5652780"
                },
                {
                    "status": "Ok",
                    "text": "6810730"
                },
                {
                    "status": "Ok",
                    "text": "6540660"
                },
                {
                    "status": "Ok",
                    "text": "0651820"
                },
                {
                    "status": "Ok",
                    "text": "6812600"
                },
                {
                    "status": "Ok",
                    "text": "7748740"
                },
                {
                    "status": "Ok",
                    "text": "6811400"
                },
                {
                    "status": "Ok",
                    "text": "6812680"
                },
                {
                    "status": "Ok",
                    "text": "7871460"
                },
                {
                    "status": "Ok",
                    "text": "6812290"
                },
                {
                    "status": "Ok",
                    "text": "7725740"
                },
                {
                    "status": "Ok",
                    "text": "7725780"
                },
                {
                    "status": "Ok",
                    "text": "1380470"
                },
                {
                    "status": "Ok",
                    "text": "0093170"
                },
                {
                    "status": "Ok",
                    "text": "0622130"
                },
                {
                    "status": "Ok",
                    "text": "2140200"
                },
                {
                    "status": "Ok",
                    "text": "2141990"
                },
                {
                    "status": "Ok",
                    "text": "0200613"
                },
                {
                    "status": "Ok",
                    "text": "0890090"
                },
                {
                    "status": "Ok",
                    "text": "6930800"
                },
                {
                    "status": "Ok",
                    "text": "8500710"
                },
                {
                    "status": "Ok",
                    "text": "9409036"
                },
                {
                    "status": "Ok",
                    "text": "9408930"
                },
                {
                    "status": "Ok",
                    "text": "0098170"
                },
                {
                    "status": "Ok",
                    "text": "2092014"
                },
                {
                    "status": "Ok",
                    "text": "2092031"
                },
                {
                    "status": "Ok",
                    "text": "2091638"
                },
                {
                    "status": "Ok",
                    "text": "2092079"
                },
                {
                    "status": "Ok",
                    "text": "8130010"
                },
                {
                    "status": "Ok",
                    "text": "9407147"
                },
                {
                    "status": "Ok",
                    "text": "0200700"
                },
                {
                    "status": "Ok",
                    "text": "9400090"
                },
                {
                    "status": "Ok",
                    "text": "9482509"
                },
                {
                    "status": "Ok",
                    "text": "9482521"
                },
                {
                    "status": "Ok",
                    "text": "9408706"
                },
                {
                    "status": "Ok",
                    "text": "8021800"
                },
                {
                    "status": "Ok",
                    "text": "8070820"
                },
                {
                    "status": "Ok",
                    "text": "8070830"
                },
                {
                    "status": "Ok",
                    "text": "1683225"
                },
                {
                    "status": "Ok",
                    "text": "7722120"
                },
                {
                    "status": "Ok",
                    "text": "7728040"
                },
                {
                    "status": "Ok",
                    "text": "7728050"
                },
                {
                    "status": "Ok",
                    "text": "4253070"
                },
                {
                    "status": "Ok",
                    "text": "3211140"
                },
                {
                    "status": "Ok",
                    "text": "6515800"
                },
                {
                    "status": "Ok",
                    "text": "5220720"
                },
                {
                    "status": "Ok",
                    "text": "5320720"
                },
                {
                    "status": "Ok",
                    "text": "7514110"
                },
                {
                    "status": "Ok",
                    "text": "6132970"
                },
                {
                    "status": "Ok",
                    "text": "6132980"
                },
                {
                    "status": "Ok",
                    "text": "7788058"
                },
                {
                    "status": "Ok",
                    "text": "0005791"
                },
                {
                    "status": "Ok",
                    "text": "1111200"
                },
                {
                    "status": "Ok",
                    "text": "1250180"
                },
                {
                    "status": "Ok",
                    "text": "1390600"
                },
                {
                    "status": "Ok",
                    "text": "2521110"
                },
                {
                    "status": "Ok",
                    "text": "3114270"
                },
                {
                    "status": "Ok",
                    "text": "5552340"
                },
                {
                    "status": "Ok",
                    "text": "5556340"
                },
                {
                    "status": "Ok",
                    "text": "8071190"
                },
                {
                    "status": "Ok",
                    "text": "8071340"
                },
                {
                    "status": "Ok",
                    "text": "5652890"
                },
                {
                    "status": "Ok",
                    "text": "1243040"
                },
                {
                    "status": "Ok",
                    "text": "1526150"
                },
                {
                    "status": "Ok",
                    "text": "0898030"
                },
                {
                    "status": "Ok",
                    "text": "1380380"
                },
                {
                    "status": "Ok",
                    "text": "2539720"
                },
                {
                    "status": "Ok",
                    "text": "6132700"
                },
                {
                    "status": "Ok",
                    "text": "6540740"
                },
                {
                    "status": "Ok",
                    "text": "7610500"
                },
                {
                    "status": "Ok",
                    "text": "6132730"
                },
                {
                    "status": "Ok",
                    "text": "4614000"
                },
                {
                    "status": "Ok",
                    "text": "5655089"
                },
                {
                    "status": "Ok",
                    "text": "2621090"
                },
                {
                    "status": "Ok",
                    "text": "6020020"
                },
                {
                    "status": "Ok",
                    "text": "1682710"
                },
                {
                    "status": "Ok",
                    "text": "1684200"
                },
                {
                    "status": "Ok",
                    "text": "2538050"
                },
                {
                    "status": "Ok",
                    "text": "4210870"
                },
                {
                    "status": "Ok",
                    "text": "4520420"
                },
                {
                    "status": "Ok",
                    "text": "4540420"
                },
                {
                    "status": "Ok",
                    "text": "4543320"
                },
                {
                    "status": "Ok",
                    "text": "4611590"
                },
                {
                    "status": "Ok",
                    "text": "4611660"
                },
                {
                    "status": "Ok",
                    "text": "4614850"
                },
                {
                    "status": "Ok",
                    "text": "5650140"
                },
                {
                    "status": "Ok",
                    "text": "5652840"
                },
                {
                    "status": "Ok",
                    "text": "6540160"
                },
                {
                    "status": "Ok",
                    "text": "6930060"
                },
                {
                    "status": "Ok",
                    "text": "6930090"
                },
                {
                    "status": "Ok",
                    "text": "6930580"
                },
                {
                    "status": "Ok",
                    "text": "6930590"
                },
                {
                    "status": "Ok",
                    "text": "6939400"
                },
                {
                    "status": "Ok",
                    "text": "6939420"
                },
                {
                    "status": "Ok",
                    "text": "6939450"
                },
                {
                    "status": "Ok",
                    "text": "6939500"
                },
                {
                    "status": "Ok",
                    "text": "6939520"
                },
                {
                    "status": "Ok",
                    "text": "6939550"
                },
                {
                    "status": "Ok",
                    "text": "7001520"
                },
                {
                    "status": "Ok",
                    "text": "7230060"
                },
                {
                    "status": "Ok",
                    "text": "7322010"
                },
                {
                    "status": "Ok",
                    "text": "7851040"
                },
                {
                    "status": "Ok",
                    "text": "7901130"
                },
                {
                    "status": "Ok",
                    "text": "8530780"
                },
                {
                    "status": "Ok",
                    "text": "6111150"
                },
                {
                    "status": "Ok",
                    "text": "8011410"
                },
                {
                    "status": "Ok",
                    "text": "8011420"
                },
                {
                    "status": "Ok",
                    "text": "6132360"
                },
                {
                    "status": "Ok",
                    "text": "8070080"
                },
                {
                    "status": "Ok",
                    "text": "2091305"
                },
                {
                    "status": "Ok",
                    "text": "2091315"
                },
                {
                    "status": "Ok",
                    "text": "2513060"
                },
                {
                    "status": "Ok",
                    "text": "1353540"
                },
                {
                    "status": "Ok",
                    "text": "1616300"
                },
                {
                    "status": "Ok",
                    "text": "7788055"
                },
                {
                    "status": "Ok",
                    "text": "2723220"
                },
                {
                    "status": "Ok",
                    "text": "7230540"
                },
                {
                    "status": "Ok",
                    "text": "5652980"
                },
                {
                    "status": "Ok",
                    "text": "2092108"
                },
                {
                    "status": "Ok",
                    "text": "4211360"
                },
                {
                    "status": "Ok",
                    "text": "6800160"
                },
                {
                    "status": "Ok",
                    "text": "8070000"
                },
                {
                    "status": "Ok",
                    "text": "5056870"
                },
                {
                    "status": "Ok",
                    "text": "4252610"
                },
                {
                    "status": "Ok",
                    "text": "2140410"
                },
                {
                    "status": "Ok",
                    "text": "7037150"
                },
                {
                    "status": "Ok",
                    "text": "4610920"
                },
                {
                    "status": "Ok",
                    "text": "1012160"
                },
                {
                    "status": "Ok",
                    "text": "2921220"
                },
                {
                    "status": "Ok",
                    "text": "2921320"
                },
                {
                    "status": "Ok",
                    "text": "6702030"
                },
                {
                    "status": "Ok",
                    "text": "7410130"
                },
                {
                    "status": "Ok",
                    "text": "7852170"
                },
                {
                    "status": "Ok",
                    "text": "6811530"
                },
                {
                    "status": "Ok",
                    "text": "7870525"
                },
                {
                    "status": "Ok",
                    "text": "7870575"
                },
                {
                    "status": "Ok",
                    "text": "6811600"
                },
                {
                    "status": "Ok",
                    "text": "2091130"
                },
                {
                    "status": "Ok",
                    "text": "7565260"
                },
                {
                    "status": "Ok",
                    "text": "8110130"
                },
                {
                    "status": "Ok",
                    "text": "0611790"
                },
                {
                    "status": "Ok",
                    "text": "0644000"
                },
                {
                    "status": "Ok",
                    "text": "0673010"
                },
                {
                    "status": "Ok",
                    "text": "1680390"
                },
                {
                    "status": "Ok",
                    "text": "1821970"
                },
                {
                    "status": "Ok",
                    "text": "1922260"
                },
                {
                    "status": "Ok",
                    "text": "2521090"
                },
                {
                    "status": "Ok",
                    "text": "2812170"
                },
                {
                    "status": "Ok",
                    "text": "3010400"
                },
                {
                    "status": "Ok",
                    "text": "6040550"
                },
                {
                    "status": "Ok",
                    "text": "7040150"
                },
                {
                    "status": "Ok",
                    "text": "7851480"
                },
                {
                    "status": "Ok",
                    "text": "7900090"
                },
                {
                    "status": "Ok",
                    "text": "8133960"
                },
                {
                    "status": "Ok",
                    "text": "8141000"
                },
                {
                    "status": "Ok",
                    "text": "6911740"
                },
                {
                    "status": "Ok",
                    "text": "0890641"
                },
                {
                    "status": "Ok",
                    "text": "7310260"
                },
                {
                    "status": "Ok",
                    "text": "7514020"
                },
                {
                    "status": "Ok",
                    "text": "7514050"
                },
                {
                    "status": "Ok",
                    "text": "1391420"
                },
                {
                    "status": "Ok",
                    "text": "6814340"
                },
                {
                    "status": "Ok",
                    "text": "7900310"
                },
                {
                    "status": "Ok",
                    "text": "7001630"
                },
                {
                    "status": "Ok",
                    "text": "7852050"
                },
                {
                    "status": "Ok",
                    "text": "7740140"
                },
                {
                    "status": "Ok",
                    "text": "8071900"
                },
                {
                    "status": "Ok",
                    "text": "8021530"
                },
                {
                    "status": "Ok",
                    "text": "8011470"
                },
                {
                    "status": "Ok",
                    "text": "7230360"
                },
                {
                    "status": "Ok",
                    "text": "6921130"
                },
                {
                    "status": "Ok",
                    "text": "8120990"
                },
                {
                    "status": "Ok",
                    "text": "6132770"
                },
                {
                    "status": "Ok",
                    "text": "6810245"
                },
                {
                    "status": "Ok",
                    "text": "5159080"
                },
                {
                    "status": "Ok",
                    "text": "8070200"
                },
                {
                    "status": "Ok",
                    "text": "3365280"
                },
                {
                    "status": "Ok",
                    "text": "2921120"
                },
                {
                    "status": "Ok",
                    "text": "4010110"
                },
                {
                    "status": "Ok",
                    "text": "6811570"
                },
                {
                    "status": "Ok",
                    "text": "2522110"
                },
                {
                    "status": "Ok",
                    "text": "8151230"
                },
                {
                    "status": "Ok",
                    "text": "1680895"
                },
                {
                    "status": "Ok",
                    "text": "7728030"
                },
                {
                    "status": "Ok",
                    "text": "2059915"
                },
                {
                    "status": "Ok",
                    "text": "4510190"
                },
                {
                    "status": "Ok",
                    "text": "1702790"
                },
                {
                    "status": "Ok",
                    "text": "0514000"
                },
                {
                    "status": "Ok",
                    "text": "0835860"
                },
                {
                    "status": "Ok",
                    "text": "5190008"
                },
                {
                    "status": "Ok",
                    "text": "5390008"
                },
                {
                    "status": "Ok",
                    "text": "0870060"
                },
                {
                    "status": "Ok",
                    "text": "5603135"
                },
                {
                    "status": "Ok",
                    "text": "5604135"
                },
                {
                    "status": "Ok",
                    "text": "4257090"
                },
                {
                    "status": "Ok",
                    "text": "7870680"
                },
                {
                    "status": "Ok",
                    "text": "2140660"
                },
                {
                    "status": "Ok",
                    "text": "9409055"
                },
                {
                    "status": "Ok",
                    "text": "9409787"
                },
                {
                    "status": "Ok",
                    "text": "2091770"
                }
            ],
            "Narratives": [
                {
                    "approvalCd": "A",
                    "cd": "2132",
                    "text": "C399 120...GREEN HOUSE GAS VEHICLE SPEE"
                },
                {
                    "approvalCd": "A",
                    "cd": "2133",
                    "text": "C402 0.....GREEN HOUSE GAS VEHICLE SPEE"
                },
                {
                    "approvalCd": "A",
                    "cd": "2134",
                    "text": "C209 120...MAXIMUM VEHICLE SPEED"
                },
                {
                    "approvalCd": "A",
                    "cd": "2135",
                    "text": "C121 75....MAXIMUM ACCELERATOR VEHICLE"
                },
                {
                    "approvalCd": "A",
                    "cd": "2137",
                    "text": "C128 75....MAXIMUM CRUISE CONTROL SPEED"
                },
                {
                    "approvalCd": "A",
                    "cd": "2140",
                    "text": "C400 474...DRIVER INITIATED OVERRIDE RE"
                },
                {
                    "approvalCd": "A",
                    "cd": "2141",
                    "text": "C334 0.....DRIVER INITIATED OVERRIDE MA"
                },
                {
                    "approvalCd": "A",
                    "cd": "2142",
                    "text": "C401 10....GREEN HOUSE GAS VEHICLE SPEE"
                },
                {
                    "approvalCd": "A",
                    "cd": "2143",
                    "text": "C333 0.....DRIVER INITIATED OVERRIDEMAX"
                },
                {
                    "approvalCd": "A",
                    "cd": "2144",
                    "text": "C234 NO....ENGINE PROTECTION SHUTDOWN"
                },
                {
                    "approvalCd": "A",
                    "cd": "2145",
                    "text": "C231 NO....GEAR DOWN PROTECTION"
                },
                {
                    "approvalCd": "A",
                    "cd": "2146",
                    "text": "C132 1400..PTO MAXIMUM ENGINE SPEED"
                },
                {
                    "approvalCd": "A",
                    "cd": "2147",
                    "text": "C239 NO....CRUISE CONTROL AUTO-RESUME"
                },
                {
                    "approvalCd": "A",
                    "cd": "2148",
                    "text": "C238 NO....CRUISE CONTROL AND ENGINE BR"
                },
                {
                    "approvalCd": "A",
                    "cd": "2150",
                    "text": "C395 3.....GREEN HOUSE GAS AUTOMATIC EN"
                },
                {
                    "approvalCd": "A",
                    "cd": "2151",
                    "text": "C225 NO....IDLE SHUTDOWN WITH PARKING B"
                },
                {
                    "approvalCd": "A",
                    "cd": "2152",
                    "text": "C133 5.....IDLE SHUTDOWN TIMER"
                },
                {
                    "approvalCd": "A",
                    "cd": "2153",
                    "text": "C396 YES...IDLE SHUTDOWN WARNING PERIOD"
                },
                {
                    "approvalCd": "A",
                    "cd": "2154",
                    "text": "C397 60....IDLE SHUTDOWN WARNING PERIOD"
                },
                {
                    "approvalCd": "A",
                    "cd": "2155",
                    "text": "C206 35....IDLE SHUTDOWN PERCENT ENGINE"
                },
                {
                    "approvalCd": "A",
                    "cd": "2157",
                    "text": "C233 NO....IDLE SHUTDOWN MANUAL OVERRID"
                },
                {
                    "approvalCd": "A",
                    "cd": "2159",
                    "text": "C382 YES...IDLE SHUTDOWN HOT AMBIENT AU"
                },
                {
                    "approvalCd": "A",
                    "cd": "2161",
                    "text": "C188 39....IDLE SHUTDOWN COLD AMBIENT A"
                },
                {
                    "approvalCd": "A",
                    "cd": "2162",
                    "text": "C189 60....IDLE SHUTDOWN INTERMEDIATE A"
                },
                {
                    "approvalCd": "A",
                    "cd": "2163",
                    "text": "C190 80....IDLE SHUTDOWN HOT AMBIENT AI"
                },
                {
                    "approvalCd": "A",
                    "cd": "8502",
                    "text": "A -         L0006EY       WHITE"
                },
                {
                    "approvalCd": "A",
                    "cd": "8520",
                    "text": "FRAME       L0001EA       BLACK"
                },
                {
                    "approvalCd": "A",
                    "cd": "8530",
                    "text": "FENDER      L0006EY       WHITE"
                },
                {
                    "approvalCd": "A",
                    "cd": "8540",
                    "text": "HOOD TOP    L0006EY       WHITE"
                },
                {
                    "approvalCd": "A",
                    "cd": "8550",
                    "text": "CAB ROOF    L0006EY       WHITE"
                },
                {
                    "approvalCd": "A",
                    "cd": "8560",
                    "text": "SLEEPER ROOF L0006EY      WHITE"
                },
                {
                    "approvalCd": "A",
                    "cd": "8570",
                    "text": "BUMPER      L0006EY       WHITE"
                },
                {
                    "approvalCd": "A",
                    "cd": "8580",
                    "text": "CH FAIRINGS L0006EY       WHITE"
                },
                {
                    "approvalCd": "A",
                    "cd": "9994",
                    "text": "EMAIL: ANDRADEM@RUSHENTERPRISES.COM"
                },
                {
                    "approvalCd": "A",
                    "cd": "9995",
                    "text": "CELL PHONE: 214-326-5550"
                },
                {
                    "approvalCd": "A",
                    "cd": "9996",
                    "text": "SALESPERSON ID: MICHAEL ANDRADE"
                },
                {
                    "approvalCd": "A",
                    "cd": "9997",
                    "text": "DEALER CONTACT"
                },
                {
                    "approvalCd": "A",
                    "cd": "9998",
                    "text": "NAME: MICHAEL ANDRADE   PH:"
                }
            ]
        };

        // WHEN
        const { data } = await POST(`/manage/MsgOrders`, testMsg);

        cleanup.push(data?.ID);

        // THEN
        expect(data).to.have.property('soldToCountry', 'US');
        expect(data).to.have.property('dealerOwnerGrp', 'S040OG');

    });

    /**
     * Reset the order messages after the tests
     */
    afterAll(async () => {
        for (let id of cleanup) await DEL(`/manage/MsgOrders(${id})`);
    });

});

describe('after READ MsgOrders', () => {

    let ManageService = {};

    beforeAll(async () => {
        // Retrieve the test order by DB select (bypass entity handler)
        ManageService = await cds.connect.to('ManageService');
    });

    it('should fill in salesOrg = 1010 and soldToCountry = US', async () => {

        const testId = 'c4680e79-f79a-422b-a3a5-b76a38e423df';

        // GIVEN (null salesOrg and soldToCountry)
        await UPDATE(ManageService.entities.MsgOrders, testId).with({ salesOrg: '1010', soldToCountry: null });

        const setup = await SELECT`salesOrg, soldToCountry`.from(ManageService.entities.MsgOrders, testId);
        expect(setup).to.have.property('salesOrg', '1010');
        expect(setup).to.have.property('soldToCountry', null);

        // WHEN
        const { data } = await GET(`/manage/MsgOrders(${testId})?$select=salesOrg,soldToCountry`);

        // THEN
        expect(data).to.have.property('salesOrg', '1010');
        expect(data).to.have.property('soldToCountry', 'US');

    });

    it('should fill in salesOrg = 2010 and soldToCountry = CA', async () => {

        const testId = 'f1a836c5-49ad-4c97-8a23-19c176d424d4';

        // GIVEN (null salesOrg and soldToCountry)
        await UPDATE(ManageService.entities.MsgOrders, testId).with({ salesOrg: '1010', soldToCountry: null });

        const setup = await SELECT`salesOrg, soldToCountry`.from(ManageService.entities.MsgOrders, testId);
        expect(setup).to.have.property('salesOrg', '1010');
        expect(setup).to.have.property('soldToCountry', null);

        // WHEN
        const { data } = await GET(`/manage/MsgOrders(${testId})?$select=salesOrg,soldToCountry`);

        // THEN
        expect(data).to.have.property('salesOrg', '2010');
        expect(data).to.have.property('soldToCountry', 'CA');

    });

    it('should find the sales order for this chassis in S4 even though it hasn\'t been updated yet', async () => {

        const currentMsg = await
            SELECT
                .one
                .columns(col => {
                    col.ID,
                    col.material,
                    col.salesOrder,
                    col.orderSaved
                })
                .from(ManageService.entities.MsgOrders)
                .where({
                    divisionCd: 'K',
                    DTPONumber: '10078139',
                    chassisNo: '294205',
                    current: true
                });

        expect(currentMsg).to.have.property('material', '294205-22-KW');

        await UPDATE(ManageService.entities.MsgOrders)
            .with({
                orderSaved: false,
                salesOrder: null })
            .where({
                ID: currentMsg.ID, or: {
                newerMessage_ID: currentMsg.ID } });

        //const mockBackendResponse = [ { "salesOrder" : "53574", "material" : "294205-22-KW" } ];
        //backend.getSalesOrdersForMultiple.mockResolvedValue(mockBackendResponse);                

        const { data } = await GET(`/manage/MsgOrders(${currentMsg.ID})?$select=salesOrder,orderSaved`);

        expect(data).to.have.property('salesOrder', '0000053575');

    }, 600000);

});
