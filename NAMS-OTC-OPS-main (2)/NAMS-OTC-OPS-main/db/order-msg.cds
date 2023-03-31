namespace order.msg;

using {
    managed,
    cuid
} from '@sap/cds/common';

type ChassisNo : String(8);

using {md} from './md';
using {oms} from './oms';
using {ops} from './ops';

entity Splits : cuid, managed {
    action            : String(6)  @title : '{i18n>action}';
    changeOrderNo     : Integer    @title : '{i18n>changeOrderNo}';
    chassisNo         : ChassisNo  @title : '{i18n>chassisNo}';
    createTimestamp   : Timestamp  @title : '{i18n>createTimestamp}';
    divisionCd        : String(1)  @title : '{i18n>divisionCd}';
    DTPONumber        : String(8)  @title : '{i18n>DTPONumber}';
    endingChassis     : ChassisNo  @title : '{i18n>endingChassis}';
    messageType       : String(15) @title : '{i18n>messageType}';
    orderAddDt        : Date       @title : '{i18n>orderAddDt}';
    orderType         : String(1)  @title : '{i18n>orderType}';
    plantCd           : String(1)  @title : '{i18n>plantCd}';
    startingChassis   : ChassisNo  @title : '{i18n>startingChassis}';
    completed         : Boolean default true;
    completedAt       : Timestamp;
    updateBeforeSplit : Boolean default false;
    splitAfterUpdate  : Boolean default false;
    merged            : Boolean default false;
}

@cds.persistence.journal
entity Orders : cuid, managed {

    action                   : String(6)                 @title : '{i18n>action}';
    actualDeliveryDt         : Date                      @title : '{i18n>actualDeliveryDt}';
    allocationDt             : Date                      @title : '{i18n>allocationDt}';
    auxTransCd               : String(7)                 @title : '{i18n>auxTransCd}';
    billingBlockCd           : String(2)                 @title : '{i18n>billingBlockCd}';
    bodyHgt                  : Decimal(10, 3)            @title : '{i18n>bodyHgt}';
    bodyLadenCpcty           : Decimal(10, 3)            @title : '{i18n>bodyLadenCpcty}';
    bodyLgth                 : Decimal(10, 3)            @title : '{i18n>bodyLgth}';
    bodyType                 : String(7)                 @title : '{i18n>bodyType}';
    bumperLength             : Decimal(4, 1)             @title : '{i18n>bumperLength}';
    cabAxleDimeension        : Decimal(10, 3)            @title : '{i18n>cabAxleDimeension}';
    cabEOFDimeension         : Decimal(10, 3)            @title : '{i18n>cabEOFDimeension}';
    cabLineSequenceNo        : String(7)                 @title : '{i18n>cabLineSequenceNo}';
    cabScheduleDt            : Date                      @title : '{i18n>cabScheduleDt}';
    cabType                  : String(70)                @title : '{i18n>cabType}';
    cabWidth                 : String(70)                @title : '{i18n>cabWidth}';
    cancellationReplacement  : String(20)                @title : '{i18n>cancellationReplacement}';
    CARAmt                   : Integer                   @title : '{i18n>CARAmt}'           @Measures.ISOCurrency : 'USD';
    CARNumber                : String(8)                 @title : '{i18n>CARNumber}';
    CARPct                   : Decimal(4, 2)             @title : '{i18n>CARPct}'           @Measures.Unit        : '%';
    changeOrderDtTm          : DateTime                  @title : '{i18n>changeOrderDtTm}';
    changeOrderNo            : Integer                   @title : '{i18n>changeOrderNo}';
    chasHwyPct               : Integer                   @title : '{i18n>chasHwyPct}'       @Measures.Unit        : '%';
    chassisNo                : ChassisNo                 @title : '{i18n>chassisNo}';
    chassisPrevNo            : ChassisNo                 @title : '{i18n>chassisPrevNo}';
    chassisStatusComment     : String(8)                 @title : '{i18n>chassisStatusComment}';
    chassisSystemStatus      : String(2)                 @title : '{i18n>chassisSystemStatus}';
    chasMetricCustmryInd     : String(1)                 @title : '{i18n>chasMetricCustmryInd}';
    chasOpsClassBPct         : String(3)                 @title : '{i18n>chasOpsClassBPct}';
    chasOpsClassCPct         : String(3)                 @title : '{i18n>chasOpsClassCPct}';
    chasOpsClassDPct         : String(3)                 @title : '{i18n>chasOpsClassDPct}';
    chngOrdChrg              : Integer                   @title : '{i18n>chngOrdChrg}'      @Measures.ISOCurrency : 'USD';
    //calculated from GVWR and divisionCd
    class                    : String(1)                 @title : '{i18n>class}';
    comdtyHaulID             : String(7)                 @title : '{i18n>comdtyHaulID}';
    cornerRadius             : Decimal(10, 3)            @title : '{i18n>cornerRadius}';
    costModelCd              : String(8)                 @title : '{i18n>costModelCd}';
    createTimestamp          : Timestamp                 @title : '{i18n>createTimestamp}';
    credInDtTm               : DateTime                  @title : '{i18n>credInDtTm}';
    credOutDtTm              : DateTime                  @title : '{i18n>credOutDtTm}';
    ctrlnAxle                : Decimal(10, 3)            @title : '{i18n>ctrlnAxle}';
    cuPoNo                   : String(22)                @title : '{i18n>cuPoNo}';
    currency                 : String(5)                 @title : '{i18n>currency}'         @Common.IsCurrency;
    current                  : Boolean                   @title : '{i18n>current}';
    custNo                   : String(4)                 @title : '{i18n>custNo}';
    customerNm               : String(30)                @title : '{i18n>customerNm}';
    customerStockCd          : String(1)                 @title : '{i18n>customerStockCd}';
    dealerCd                 : String(4)                 @title : '{i18n>dealerCd}';
    dealerOwnerGrp           : String(10)                @title : '{i18n>dealerOwnerGrp}';
    defaultClass             : String(1)                 @title : '{i18n>defaultClass}';
    deleteItems              : array of {
        salesOrderItem : String(6);
    };
    division                 : String(2)                 @title : '{i18n>division}';
    //key-ish
    divisionCd               : String(1)                 @title : '{i18n>divisionCd}';
    dlrBasePriceAmt          : Integer                   @title : '{i18n>dlrBasePriceAmt}'  @Measures.ISOCurrency : 'USD';
    dlrPoPresentId           : String(22)                @title : '{i18n>dlrPoPresentId}';
    DTPONumber               : String(8)                 @title : '{i18n>DTPONumber}';
    endingChassis            : ChassisNo                 @title : '{i18n>endingChassis}';
    engineCd                 : String(7)                 @title : '{i18n>engineCd}';
    engineClassCd            : String(1)                 @title : '{i18n>engineClassCd}';
    engineType               : String(40)                @title : '{i18n>engineType}';
    estimatedDeliveryDt      : Date                      @title : '{i18n>estimatedDeliveryDt}';
    exchangeRateAmt          : Decimal(7, 2)             @title : '{i18n>exchangeRateAmt}';
    FETInd                   : String(1)                 @title : '{i18n>FETInd}';
    FETIndUnitType           : String(1)                 @title : '{i18n>FETIndUnitType}';
    FETGSTCd                 : String(1)                 @title : '{i18n>FETGSTCd}';
    FET                      : String(6)                 @title : '{i18n>FET}';
    FETExemptAmt             : Decimal(10, 3) default 0  @title : '{i18n>FETExemptAmt}'     @Measures.ISOCurrency : 'USD';
    fifthWheelCd             : String(7)                 @title : '{i18n>fifthWheelCd}';
    firmScheduleDt           : Date                      @title : '{i18n>firmScheduleDt}';
    fleetGap                 : Boolean;
    fleetOrder               : Boolean default false     @title : '{i18n>fleetOrder}';
    fleetQty                 : Integer                   @title : '{i18n>fleetQty}';
    frameCd                  : String(7)                 @title : '{i18n>frameCd}';
    frameLineSequenceNo      : String(7)                 @title : '{i18n>frameLineSequenceNo}';
    frameScheduleDt          : Date                      @title : '{i18n>frameScheduleDt}';
    frgtRateAmt              : Integer                   @title : '{i18n>frgtRateAmt}'      @Measures.ISOCurrency : 'USD';
    frontAxleBOCDimeension   : Decimal(10, 3)            @title : '{i18n>frontAxleBOCDimeension}';
    frontAxleCd              : String(7)                 @title : '{i18n>frontAxleCd}';
    frontAxleLoad            : Decimal(10, 3)            @title : '{i18n>frontAxleLoad}';
    gawrFirstRear            : Decimal(10, 3)            @title : '{i18n>gawrFirstRear}';
    gawrFront                : Decimal(10, 3)            @title : '{i18n>gawrFront}';
    gawrRear                 : Decimal(10, 3)            @title : '{i18n>gawrRear}';
    gawrSecRear              : Decimal(10, 3)            @title : '{i18n>gawrSecRear}';
    gcw                      : Decimal(10, 3)            @title : '{i18n>gcw}';
    gvwr                     : Decimal(10, 3)            @title : '{i18n>gvwr}'             @Measures.Unit        : weightUnit;
    gvwrLbs                  : Decimal(10, 3)            @title : '{i18n>gvwrLbs}'          @Measures.Unit        : 'LB';
    gvwrTemp                 : Integer                   @title : '{i18n>gvwrTemp}'         @Measures.Unit        : 'LB';
    hasFifthWheel            : Boolean default false     @title : '{i18n>hasFifthWheel}';
    hasPusher                : Boolean default false     @title : '{i18n>hasPusher}';
    intendSvcClass           : String(7)                 @title : '{i18n>intendSvcClass}';
    interCompDisc            : Decimal(3, 1)             @title : '{i18n>interCompDisc}';
    interDivDisc             : Decimal(3, 1)             @title : '{i18n>interDivDisc}';
    invcTermDays             : Integer                   @title : '{i18n>invcTermDays}';
    kingPinSet               : Decimal(10, 3)            @title : '{i18n>kingPinSet}';
    listPrice                : Integer default 0         @title : '{i18n>listPrice}'        @Measures.ISOCurrency : 'USD';
    mainTransCd              : String(7)                 @title : '{i18n>mainTransCd}';
    //calculated from GVWR and division
    marketingClass           : String(1)                 @title : '{i18n>marketingClass}';
    marketingFee             : Integer                   @title : '{i18n>fee}'              @Measures.ISOCurrency : 'USD';
    material                 : String(40)                @title : '{i18n>material}';
    maxGradePct              : Integer                   @title : '{i18n>maxGradePct}';
    messageType              : String(15)                @title : '{i18n>messageType}';
    modelCd                  : String(7)                 @title : '{i18n>modelCd}';
    noTrlrAxle               : Integer                   @title : '{i18n>noTrlrAxle}';
    operAreaDesc             : String(20)                @title : '{i18n>operAreaDesc}';
    operAreaHgt              : Decimal(10, 3)            @title : '{i18n>operAreaHgt}';
    operAreaLgth             : Decimal(10, 3)            @title : '{i18n>operAreaLgth}';
    operAreaWidth            : Decimal(10, 3)            @title : '{i18n>operAreaWidth}';
    orderAddDt               : Date                      @title : '{i18n>orderAddDt}';
    orderCancelDt            : Date                      @title : '{i18n>orderCancelDt}';
    virtual orderCriticality : Integer                   @title : '{i18n>orderCriticality}';
    orderReceivedDt          : Date                      @title : '{i18n>orderReceivedDt}';
    orderSaved               : Boolean default false     @title : '{i18n>orderSaved}';
    virtual orderStatus      : String(20)                @title : '{i18n>orderStatus}';
    orderType                : String(1)                 @title : '{i18n>orderType}';
    plantCd                  : String(1)                 @title : '{i18n>plantCd}';
    plant                    : String(4)                 @title : '{i18n>plant}';
    priceEffectiveDt         : Date                      @title : '{i18n>priceEffectiveDt}';
    priceProtAmt             : Integer                   @title : '{i18n>priceProtAmt}'     @Measures.ISOCurrency : 'USD';
    procesingStatusCd        : String(4)                 @title : '{i18n>procesingStatusCd}';
    prodConvChrg             : Integer                   @title : '{i18n>prodConvChrg}'     @Measures.ISOCurrency : 'USD';
    productType              : String(20)                @title : '{i18n>productType}';
    promoAmt                 : Integer                   @title : '{i18n>promoAmt}'         @Measures.ISOCurrency : 'USD';
    promoCodes               : String(200)               @title : '{i18n>promoCodes}';
    promoProgCd              : String(7)                 @title : '{i18n>promoProgCd}';
    promoProgDesc            : String(45)                @title : '{i18n>promoProgDesc}';
    promoProgPct             : Decimal(6, 4)             @title : '{i18n>promoProgPct}'     @Measures.Unit        : '%';
    rearAxleCd               : String(7)                 @title : '{i18n>rearAxleCd}';
    rearAxleLoad             : Decimal(10, 3)            @title : '{i18n>rearAxleLoad}';
    rearAxleRatio            : Integer                   @title : '{i18n>rearAxleRatio}';
    rearAxleRatioCd          : String(7)                 @title : '{i18n>rearAxleRatioCd}';
    releaseWriter            : String(3)                 @title : '{i18n>releaseWriter}';
    requestedDeliveryDt      : Date                      @title : '{i18n>requestedDeliveryDt}';
    salesDocType             : String(4)                 @title : '{i18n>salesDocType}';
    s4StatusCode             : String(4)                 @title : '{i18n>s4StatusCode}';
    //written back from cpi
    salesOrder               : String(10)                @title : '{i18n>salesOrder}';
    //written back from cpi
    salesOrg                 : String(4)                 @title : '{i18n>salesOrg}';
    shippingDestination      : String(30)                @title : '{i18n>shippingDestination}';
    soldToCountry            : String(3)                 @title : '{i18n>soldToCountry}';
    spclRqmntCd1             : String(7)                 @title : '{i18n>spclRqmntCd1}';
    spclRqmntCd2             : String(7)                 @title : '{i18n>spclRqmntCd2}';
    spclRqmntCd3             : String(7)                 @title : '{i18n>spclRqmntCd3}';
    spclRqmntCd4             : String(7)                 @title : '{i18n>spclRqmntCd4}';
    startingChassis          : ChassisNo                 @title : '{i18n>startingChassis}';
    stateProvinceCd          : String(2)                 @title : '{i18n>stateProvinceCd}';
    statusCode               : String(4)                 @title : '{i18n>statusCode}';
    std_des                  : String(200)               @title : '{i18n>std_des}';
    stdDlrDiscPct            : Decimal(3, 1)             @title : '{i18n>stdDlrDiscPct}'    @Measures.Unit        : '%';
    surchargesNSTD           : Integer default 0         @title : '{i18n>surchargesNSTD}'   @Measures.ISOCurrency : 'USD';
    surchargesZH00           : Integer default 0         @title : '{i18n>surchargesZH00}'   @Measures.ISOCurrency : 'USD';
    surchargesZISF           : Integer default 0         @title : '{i18n>surchargesZISF}'   @Measures.ISOCurrency : 'USD';
    surchargesZMAD           : Integer default 0         @title : '{i18n>surchargesZMAD}'   @Measures.ISOCurrency : 'USD';
    suspensionCd             : String(7)                 @title : '{i18n>suspensionCd}';
    tentativeScheduleDt      : Date                      @title : '{i18n>tentativeScheduleDt}';
    timesProcessed           : Integer default 0         @title : '{i18n>timesProcessed}';
    tireFET                  : Decimal(15, 3)            @title : '{i18n>tireFET}'          @Measures.ISOCurrency : 'USD';
    tireRollRadius           : String(4)                 @title : '{i18n>tireRollRadius}';
    trlrHgt                  : Decimal(10, 3)            @title : '{i18n>trlrHgt}';
    trlrLgth                 : Decimal(10, 3)            @title : '{i18n>trlrLgth}';
    trlrType                 : String(7)                 @title : '{i18n>trlrType}';
    unitTypeCd               : String(1)                 @title : '{i18n>unitTypeCd}';
    warrOptAmt               : Integer default 0         @title : '{i18n>warrOptAmt}'       @Measures.ISOCurrency : 'USD';
    warrReplOptCd            : String(7)                 @title : '{i18n>warrReplOptCd}';
    warrReplOptDesc          : String(91)                @title : '{i18n>warrReplOptDesc}';
    weight                   : Integer default 0         @title : '{i18n>weight}'           @Measures.Unit        : weightUnit;
    weightUnit               : String(3)                 @title : '{i18n>weightUnit}'       @Common.IsUnit;
    wheelbase                : Decimal(10, 3)            @title : '{i18n>wheelbase}';

    //  Compositions
    Chassis                  : Composition of many Chassis
                                   on Chassis.order = $self;
    Options                  : Composition of many Options
                                   on Options.order = $self;
    Narratives               : Composition of many Narratives
                                   on Narratives.order = $self;

    // Associations
    Splits                   : Association to many Orders
                                   on Splits.splitOrder = $self;
    splitOrder               : Association to Orders     @title : '{i18n>splitOrder}';
    OlderMessages            : Association to many Orders
                                   on OlderMessages.newerMessage = $self;
    newerMessage             : Association to Orders     @title : '{i18n>newerMessage}';

};

@cds.persistence.journal
entity Chassis {
    key order                   : Association to Orders;
    key chassisNo               : ChassisNo @title : '{i18n>chassisNo}';
        virtual salesOrder      : String(10);
        salesOrderItem          : String(6);
        material                : String(40);
        current                 : Boolean;
        billingDate             : Date;
        invoiceBlockStatus      : String(4);
        virtual updateIndicator : String(1);
        virtual materialClass   : array of {
            characteristic : String(30);
            value          : String(70);
        };
}

view ByChassis as
    select from Orders
    inner join Chassis
        on Chassis.order.ID = Orders.ID
    {
        Orders.ID         as order_ID,
        Orders.divisionCd as divisionCd,
        Chassis.chassisNo as chassisNo,
        Orders.DTPONumber as DTPONumber,
        Orders.current    as current
    };

view MaxIdByChassis as
    select from ByChassis {
        max(order_ID) as order_ID,
        divisionCd,
        chassisNo,
        DTPONumber
    }
    where
        current = true
    group by
        divisionCd,
        chassisNo,
        DTPONumber;

@cds.persistence.journal
entity Narratives : cuid {
    order      : Association to Orders;
    approvalCd : String(1)  @title : '{i18n>approvalCd}';
    cd         : String(4)  @title : '{i18n>cd}';
    text       : String(45) @title : '{i18n>narrativeText}';
    current    : Boolean;
}

@cds.autoexpose
view Option as
        select from Orders as o
        join Options as op
            on op.order.ID = o.ID
        join ops.PromoCodes as p
            on  p.divisionCd     = o.divisionCd
            and p.salesOptnNo    = op.text
            and p.salesOptnModNo = o.modelCd
        {
            op.ID       as option_ID,
            p.sOptDesc1 as OPSLine1Description,
            p.sOptDesc2 as OPSLine2Description
        }
    union all
        select from Orders as o
        join Options as op
            on op.order.ID = o.ID
        join oms.CV_DIM_SALES_OPTION as so
            on  so.DIVISION_CODE     = o.divisionCd
            and so.SALES_OPTION_CODE = op.text
        {
            op.ID                     as option_ID,
            so.OPS_LINE_1_DESCRIPTION as OPSLine1Description,
            so.OPS_LINE_2_DESCRIPTION as OPSLine2Description
        };

@cds.autoexpose
view OptionsNotes as
    select from Orders as o
    inner join Options as op
        on op.order.ID = o.ID
    inner join oms.CV_DIM_SALES_OPTION_NOTE as n
        on  n.DIVISION_CODE     = o.divisionCd
        and n.SALES_OPTION_CODE = op.text
    {
        key op.ID                 as option_ID,
            n.NOTE_LINE_NUMBER    as noteLineNumber,
            n.NOTE_LINE_TEXT      as noteLineText,
            n.OPS_PRINT_INDICATOR as OPSPrintIndicator
    };

@cds.persistence.journal
entity Options : cuid {
    order                : Association to Orders;
    status               : String(6)       @title : '{i18n>status}';
    text                 : String(7)       @title : '{i18n>optionText}';
    rangeNameText        : String(300)     @title : '{i18n>rangeNameText}';
    rangeNameDesc        : String(450)     @title : '{i18n>rangeNameDesc}';
    specialRangeNameText : String(300)     @title : '{i18n>specialRangeNameText}';
    specialRangeNameDesc : String(450)     @title : '{i18n>specialRangeNameDesc}';
    list_price_amt       : Integer         @title : '{i18n>listPrice}'   @Measures.ISOCurrency : 'USD';
    wgt_diff_qty         : Integer         @title : '{i18n>weight}'      @Measures.Unit        : order.weightUnit;
    publicationStatus    : String(2)       @title : '{i18n>pubicationStatus}';
    FETExempt            : Boolean         @title : '{i18n>FETExempt}';
    TPN                  : String(200)     @title : '{i18n>TPN}';
    TQ                   : Integer         @title : '{i18n>TQ}';
    tireFET              : Decimal(15, 3)  @title : '{i18n>tireFET}'     @Measures.ISOCurrency : 'USD';
    axleWeight           : Integer         @title : '{i18n>axleWeight}'  @Measures.Unit        : 'LB';
    current              : Boolean;

    //  Compositions
    Ranges               : Composition of many Ranges
                               on Ranges.option = $self;

    //  Associations
    Option               : Association to Option
                               on Option.option_ID = $self.ID;
    Notes                : Association to many OptionsNotes
                               on Notes.option_ID = $self.ID;

};

@cds.persistence.journal
entity Ranges {
    key option        : Association to Options;
    key rangeNameText : String(30) @title : '{i18n>rangeNameText}';
        rangeNameDesc : String(45) @title : '{i18n>rangeNameDesc}';
        current       : Boolean;
};
