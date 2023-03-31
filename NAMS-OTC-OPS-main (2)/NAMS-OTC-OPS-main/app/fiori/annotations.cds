using ManageService as service from '../../srv/ops-svc';

annotate service.MsgOrders with @(UI : {

    SelectionFields : [
        ID,
        messageType,
        chassisNo,
        DTPONumber,
        orderSaved,
        dealerCd,
        divisionCd,
        modelCd,
        orderReceivedDt,
        plantCd,
        current
    ],

    LineItem : [
        { $Type : 'UI.DataField', Value : messageType },
        { $Type : 'UI.DataField', Value : chassisNo },
        { $Type : 'UI.DataField', Value : DTPONumber },
        { $Type : 'UI.DataField', Value : dealerCd },
        { $Type : 'UI.DataField', Value : divisionCd },
        { $Type : 'UI.DataField', Value : modelCd },
        { $Type : 'UI.DataField', Value : orderReceivedDt }
    ],

    HeaderInfo      : { 
        Title          : { $Type : 'UI.DataField', Value : ID },
        Description    : { $Type : 'UI.DataField', Value : messageType },
        $Type          : 'UI.HeaderInfoType',
        TypeName       : '{i18n>TypeName}',
        TypeNamePlural : '{i18n>TypeNamePlural}',
    },

    HeaderFacets: [       
      {$Type: 'UI.ReferenceFacet', Target: '@UI.DataPoint#ListPrice' },
      {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#OrderSummary', Label:'{i18n>FacetOrderSummary}' },
      {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Chassis', Label:'{i18n>FacetChassis}' },
      {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#ClassWeight', Label:'{i18n>FacetClassWeight}' },
      {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Status', Label:'{i18n>FacetStatus}' },
      {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#S4Fields', Label:'{i18n>FacetS4Fields}' }
    ],

    DataPoint#ListPrice: {
        Value: listPrice,
        Title: '{i18n>listPrice}',
    },

    //https://help.sap.com/viewer/cc0c305d2fab47bd808adcad3ca7ee9d/LATEST/en-US/81e2259d82f44ce9b5f4ad6377edbd67.html
    FieldGroup#OrderSummary: {
        Data:[
            {$Type: 'UI.DataField', Value: chassisNo },
            {$Type: 'UI.DataField', Value: DTPONumber },
            {$Type: 'UI.DataField', Value: orderAddDt },
            {$Type: 'UI.DataField', Value: divisionCd },
            {$Type: 'UI.DataField', Value: action },
            {$Type: 'UI.DataField', Value: dealerCd },
            {$Type: 'UI.DataField', Value: custNo },
            {$Type: 'UI.DataField', Value: customerNm }
        ]
    },

    FieldGroup#Chassis: {
        Data: [
            {$Type: 'UI.DataField', Value: cancellationReplacement },
            {$Type: 'UI.DataField', Value: chasHwyPct },
            {$Type: 'UI.DataField', Value: chassisNo },
            {$Type: 'UI.DataField', Value: chasOpsClassBPct },
            {$Type: 'UI.DataField', Value: chasOpsClassCPct },
            {$Type: 'UI.DataField', Value: chasOpsClassDPct },
            {$Type: 'UI.DataField', Value: startingChassis },
            {$Type: 'UI.DataField', Value: endingChassis },
            {$Type: 'UI.DataField', Value: chassisPrevNo }         
        ]
    },

    FieldGroup#ClassWeight: {
        Data: [
            {$Type: 'UI.DataField', Value: chasMetricCustmryInd },
            {$Type: 'UI.DataField', Value: class },
            {$Type: 'UI.DataField', Value: defaultClass },
            {$Type: 'UI.DataField', Value: gcw },
            {$Type: 'UI.DataField', Value: gvwr },
            {$Type: 'UI.DataField', Value: gvwrLbs },
            {$Type: 'UI.DataField', Value: gvwrTemp },
            {$Type: 'UI.DataField', Value: marketingClass },
            {$Type: 'UI.DataField', Value: productType },
            {$Type: 'UI.DataField', Value: weight },
            {$Type: 'UI.DataField', Value: weightUnit }
        ]
    },

    FieldGroup#Status: {
        Data: [
            {$Type: 'UI.DataField', Value: orderStatus, Criticality : orderCriticality, },
            {$Type: 'UI.DataField', Value: orderSaved },
            {$Type: 'UI.DataField', Value: timesProcessed },
            {$Type: 'UI.DataField', Value: chassisSystemStatus },
            {$Type: 'UI.DataField', Value: chassisStatusComment },
            {$Type: 'UI.DataField', Value: procesingStatusCd },
            {$Type: 'UI.DataField', Value: statusCode }
        ]
    },

    FieldGroup#S4Fields: {
        Data:[
            {$Type: 'UI.DataField', Value: dealerOwnerGrp },
            {$Type: 'UI.DataField', Value: division },
            {$Type: 'UI.DataField', Value: material },
            {$Type: 'UI.DataField', Value: plant },
            {$Type: 'UI.DataField', Value: salesDocType },
            {$Type: 'UI.DataField', Value: salesOrder },
            {$Type: 'UI.DataField', Value: salesOrg },
            {$Type: 'UI.DataField', Value: soldToCountry },
            {$Type: 'UI.DataField', Value: billingBlockCd }
        ]
    },

    Facets: [
        {
            $Type: 'UI.CollectionFacet',
            ID: 'OrderDetails',
            Label: '{i18n>FacetOrderDetails}',
            Facets: [
                {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#BasicData', Label: '{i18n>FacetBasicData}'},
                {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#OrderDates', Label: '{i18n>FacetOrderDates}'}
            ]
        },
        {
            $Type: 'UI.CollectionFacet',
            ID: 'Pricing',
            Label: '{i18n>FacetPricing}',
            Facets: [
                {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#BasicPricing', Label: '{i18n>FacetBasicPricing}'},
                {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#CAR', Label: '{i18n>FacetCAR}'},
                {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Promo', Label: '{i18n>FacetPromo}'}
            ]
        },
        {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Fleet', Label: '{i18n>FacetFleet}'},
        {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Other', Label: '{i18n>FacetOther}'},
        {
            $Type: 'UI.CollectionFacet',
            ID: 'MajorComponents',
            Label: '{i18n>FacetMajorComponents}',
            Facets: [
                {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Cab', Label: '{i18n>FacetCab}'},
                {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Axle', Label: '{i18n>FacetAxle}'},
                {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Engine', Label: '{i18n>FacetEngine}'},
                {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Frame', Label: '{i18n>FacetFrame}'},
                {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Transmission', Label: '{i18n>FacetTransmission}'},
                {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Trailer', Label: '{i18n>FacetTrailer}'},
                {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Body', Label: '{i18n>FacetBody}'},
            ]
        },
        {
            $Type: 'UI.CollectionFacet',
            ID: 'Options',
            Label: '{i18n>FacetOptions}',
            Facets: [
                {$Type: 'UI.ReferenceFacet', Target: 'Options/@UI.LineItem'}
            ]                
        },
        {
            $Type: 'UI.CollectionFacet',
            ID: 'Narratives',
            Label: '{i18n>FacetNarratives}',
            Facets: [
                {$Type: 'UI.ReferenceFacet', Target: 'Narratives/@UI.LineItem'}
            ]
        }
    ],

    FieldGroup#BasicPricing: {
        Data:[
            {$Type: 'UI.DataField', Value: chngOrdChrg },
            {$Type: 'UI.DataField', Value: currency },
            {$Type: 'UI.DataField', Value: dlrBasePriceAmt },
            {$Type: 'UI.DataField', Value: exchangeRateAmt },
            {$Type: 'UI.DataField', Value: FET },
            {$Type: 'UI.DataField', Value: FETExemptAmt },
            {$Type: 'UI.DataField', Value: frgtRateAmt },
            {$Type: 'UI.DataField', Value: interCompDisc },
            {$Type: 'UI.DataField', Value: interDivDisc },
            {$Type: 'UI.DataField', Value: listPrice },
            {$Type: 'UI.DataField', Value: marketingFee },
            {$Type: 'UI.DataField', Value: priceEffectiveDt },
            {$Type: 'UI.DataField', Value: priceProtAmt },
            {$Type: 'UI.DataField', Value: prodConvChrg },
            {$Type: 'UI.DataField', Value: stdDlrDiscPct },
            {$Type: 'UI.DataField', Value: surchargesNSTD },
            {$Type: 'UI.DataField', Value: surchargesZH00 },
            {$Type: 'UI.DataField', Value: surchargesZISF },
            {$Type: 'UI.DataField', Value: surchargesZMAD },
            {$Type: 'UI.DataField', Value: tireFET },
            {$Type: 'UI.DataField', Value: warrOptAmt }
        ]
    },

    FieldGroup#CAR: {
        Data:[
            {$Type: 'UI.DataField', Value: CARAmt },
            {$Type: 'UI.DataField', Value: CARNumber },
            {$Type: 'UI.DataField', Value: CARPct }
        ]
    },

    FieldGroup#Promo: {
        Data:[
            {$Type: 'UI.DataField', Value: promoAmt },
            {$Type: 'UI.DataField', Value: promoCodes },
            {$Type: 'UI.DataField', Value: promoProgCd },
            {$Type: 'UI.DataField', Value: promoProgDesc },
            {$Type: 'UI.DataField', Value: promoProgPct }
        ]
    },

    FieldGroup#BasicData: {
        Data:[
            {$Type: 'UI.DataField', Value: chassisNo },
            {$Type: 'UI.DataField', Value: dealerCd },
            {$Type: 'UI.DataField', Value: divisionCd },
            {$Type: 'UI.DataField', Value: DTPONumber },
            {$Type: 'UI.DataField', Value: modelCd },
            {$Type: 'UI.DataField', Value: std_des },
            {$Type: 'UI.DataField', Value: orderReceivedDt },
            {$Type: 'UI.DataField', Value: orderType },
            {$Type: 'UI.DataField', Value: plantCd },
            {$Type: 'UI.DataField', Value: createdAt },
            {$Type: 'UI.DataField', Value: createdBy },
            {$Type: 'UI.DataField', Value: modifiedAt },
            {$Type: 'UI.DataField', Value: modifiedBy }
        ]
    },
    FieldGroup#OrderDates: {
        Data:[
            {$Type: 'UI.DataField', Value: orderReceivedDt },
            {$Type: 'UI.DataField', Value: orderAddDt },
            {$Type: 'UI.DataField', Value: priceEffectiveDt },
            {$Type: 'UI.DataField', Value: credInDtTm },
            {$Type: 'UI.DataField', Value: credOutDtTm },
            {$Type: 'UI.DataField', Value: orderCancelDt },
            {$Type: 'UI.DataField', Value: changeOrderDtTm },
            {$Type: 'UI.DataField', Value: allocationDt },
            {$Type: 'UI.DataField', Value: cabScheduleDt },
            {$Type: 'UI.DataField', Value: frameScheduleDt },
            {$Type: 'UI.DataField', Value: tentativeScheduleDt },
            {$Type: 'UI.DataField', Value: estimatedDeliveryDt },
            {$Type: 'UI.DataField', Value: firmScheduleDt },
            {$Type: 'UI.DataField', Value: requestedDeliveryDt },
            {$Type: 'UI.DataField', Value: actualDeliveryDt },
            {$Type: 'UI.DataField', Value: createTimestamp },
        ]
    },
    FieldGroup#Body: {
        Data:[
            {$Type: 'UI.DataField', Value: bodyHgt },
            {$Type: 'UI.DataField', Value: bodyLadenCpcty },
            {$Type: 'UI.DataField', Value: bodyLgth },
            {$Type: 'UI.DataField', Value: bodyType }
        ]
    },
    FieldGroup#Cab: {
        Data:[
            {$Type: 'UI.DataField', Value: cabAxleDimeension },
            {$Type: 'UI.DataField', Value: cabEOFDimeension },
            {$Type: 'UI.DataField', Value: cabLineSequenceNo },
            {$Type: 'UI.DataField', Value: cabScheduleDt },
            {$Type: 'UI.DataField', Value: cabType },
            {$Type: 'UI.DataField', Value: cabWidth },
            {$Type: 'UI.DataField', Value: frontAxleBOCDimeension }
        ]
    },
    FieldGroup#Axle: {
        Data:[
            {$Type: 'UI.DataField', Value: frontAxleCd },
            {$Type: 'UI.DataField', Value: frontAxleLoad },
            {$Type: 'UI.DataField', Value: gawrFront },
            {$Type: 'UI.DataField', Value: rearAxleCd },
            {$Type: 'UI.DataField', Value: rearAxleLoad },
            {$Type: 'UI.DataField', Value: rearAxleRatio },
            {$Type: 'UI.DataField', Value: rearAxleRatioCd },
            {$Type: 'UI.DataField', Value: gawrFirstRear },
            {$Type: 'UI.DataField', Value: gawrRear },
            {$Type: 'UI.DataField', Value: gawrSecRear },
            {$Type: 'UI.DataField', Value: noTrlrAxle },
        ]
    },
    FieldGroup#Engine: {
        Data:[
            {$Type: 'UI.DataField', Value: engineCd },
            {$Type: 'UI.DataField', Value: engineClassCd },
            {$Type: 'UI.DataField', Value: engineType }
        ]
    },
    FieldGroup#Frame: {
        Data:[
            {$Type: 'UI.DataField', Value: frameCd } ,
            {$Type: 'UI.DataField', Value: frameLineSequenceNo },
            {$Type: 'UI.DataField', Value: frameScheduleDt }
        ]
    },
    FieldGroup#Transmission: {
        Data:[
            {$Type: 'UI.DataField', Value: mainTransCd },
            {$Type: 'UI.DataField', Value: auxTransCd },
        ]
    },
    FieldGroup#Trailer: {
        Data:[
            {$Type: 'UI.DataField', Value: trlrHgt },
            {$Type: 'UI.DataField', Value: trlrLgth },
            {$Type: 'UI.DataField', Value: trlrType },
        ]
    },
    FieldGroup#Fleet: {
        Data:[
            {$Type: 'UI.DataField', Value: startingChassis },
            {$Type: 'UI.DataField', Value: endingChassis },
            {$Type: 'UI.DataField', Value: fleetOrder },
            {$Type: 'UI.DataField', Value: fleetQty }
        ]
    },
    FieldGroup#ChangeOrder: {
        Data:[
            {$Type: 'UI.DataField', Value: changeOrderNo },
            {$Type: 'UI.DataField', Value: changeOrderDtTm },
            {$Type: 'UI.DataField', Value: chngOrdChrg },
        ]
    },
    FieldGroup#Other: {
        Data:[
            {$Type: 'UI.DataField', Value: action },
            {$Type: 'UI.DataField', Value: bumperLength },
            {$Type: 'UI.DataField', Value: chassisStatusComment },
            {$Type: 'UI.DataField', Value: chassisSystemStatus },
            {$Type: 'UI.DataField', Value: comdtyHaulID },
            {$Type: 'UI.DataField', Value: cornerRadius },
            {$Type: 'UI.DataField', Value: costModelCd },
            {$Type: 'UI.DataField', Value: ctrlnAxle },
            {$Type: 'UI.DataField', Value: cuPoNo },
            {$Type: 'UI.DataField', Value: customerNm },
            {$Type: 'UI.DataField', Value: customerStockCd },
            {$Type: 'UI.DataField', Value: dlrPoPresentId },
            {$Type: 'UI.DataField', Value: FETGSTCd },
            {$Type: 'UI.DataField', Value: FETInd },
            {$Type: 'UI.DataField', Value: FETIndUnitType },
            {$Type: 'UI.DataField', Value: fifthWheelCd },
            {$Type: 'UI.DataField', Value: hasFifthWheel },
            {$Type: 'UI.DataField', Value: hasPusher },
            {$Type: 'UI.DataField', Value: intendSvcClass },
            {$Type: 'UI.DataField', Value: invcTermDays },
            {$Type: 'UI.DataField', Value: kingPinSet },
            {$Type: 'UI.DataField', Value: maxGradePct },
            {$Type: 'UI.DataField', Value: operAreaDesc },
            {$Type: 'UI.DataField', Value: operAreaHgt },
            {$Type: 'UI.DataField', Value: operAreaLgth },
            {$Type: 'UI.DataField', Value: operAreaWidth },
            {$Type: 'UI.DataField', Value: procesingStatusCd },
            {$Type: 'UI.DataField', Value: releaseWriter },
            {$Type: 'UI.DataField', Value: shippingDestination },
            {$Type: 'UI.DataField', Value: spclRqmntCd1 },
            {$Type: 'UI.DataField', Value: spclRqmntCd2 },
            {$Type: 'UI.DataField', Value: spclRqmntCd3 },
            {$Type: 'UI.DataField', Value: spclRqmntCd4 },
            {$Type: 'UI.DataField', Value: stateProvinceCd },
            {$Type: 'UI.DataField', Value: statusCode },
            {$Type: 'UI.DataField', Value: suspensionCd },
            {$Type: 'UI.DataField', Value: tireRollRadius },
            {$Type: 'UI.DataField', Value: unitTypeCd },
            {$Type: 'UI.DataField', Value: warrReplOptCd },
            {$Type: 'UI.DataField', Value: warrReplOptDesc },
            {$Type: 'UI.DataField', Value: wheelbase }
            
        ]
    }
}) {
    current @Common.FilterDefaultValue : true;
};

annotate service.MsgOptions with @(UI : {
    LineItem : [
        { $Type : 'UI.DataField', Value : text },
        { $Type : 'UI.DataField', Value : status },
        { $Type : 'UI.DataField', Value : OPSLine1Description },
        { $Type : 'UI.DataField', Value : OPSLine2Description },
        { $Type : 'UI.DataField', Value : list_price_amt },
        { $Type : 'UI.DataField', Value : wgt_diff_qty },
        { $Type : 'UI.DataField', Value : rangeNameText },
        { $Type : 'UI.DataField', Value : rangeNameDesc },
        { $Type : 'UI.DataField', Value : specialRangeNameDesc },
        { $Type : 'UI.DataField', Value : publicationStatus },
        { $Type : 'UI.DataField', Value : FETExempt },
        { $Type : 'UI.DataField', Value : TPN },
        { $Type : 'UI.DataField', Value : TQ },
        { $Type : 'UI.DataField', Value : axleWeight }
    ]
});

annotate service.Narratives with @(UI : {
    LineItem : [
        { $Type : 'UI.DataField', Value : approvalCd },
        { $Type : 'UI.DataField', Value : cd },
        { $Type : 'UI.DataField', Value : text }
    ]
});
