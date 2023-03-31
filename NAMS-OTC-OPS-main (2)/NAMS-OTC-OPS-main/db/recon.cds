using {
    cuid,
    managed
} from '@sap/cds/common';
using {order.msg as msg} from './order-msg';
using {ZC_OPSRECON_CDS as s4remote} from '../srv/external/ZC_OPSRECON_CDS';

context recon {

    entity CSVFiles : managed {
        key filename    : String;
            isProcessed : Boolean default false;
            contentType : String       @Core.IsMediaType;
            csv         : LargeString  @Core.MediaType : contentType  @Core.ContentDisposition.Filename : filename;
    }

    entity Files {
        key divisionCd        : String(1);
        key chassisNo         : msg.ChassisNo;
        key orderAddDt        : Date;
        key DTPONumber        : String(8);
            startingChassis   : msg.ChassisNo;
            endingChassis     : msg.ChassisNo;
            netSalePrice      : Integer;
            exchangeRateAmt   : Decimal(7, 2);
            FETInd            : String(1);
            changeOrderNo     : Integer;
            FETGSTCd          : String(1);
            taxAmt            : Integer;
            procesingStatusCd : String(4);
            plantCd           : String(1);
            tentSchedDt       : Date;
            firmSchedDt       : Date;
            creditStatus      : String(2);
            // Populated by event handler below this line
            division          : String(2);
            canadianTaxesInd  : String(1);
            currency          : String(5);
            chassisNetPrice   : Decimal(15, 2);
            exchangeRate      : Decimal(9, 5);
            taxAmount         : Decimal(13, 2);
    }

    entity S4Snapshot {
        key SALES_ORDER             : String(10);
        key SALES_ORDER_ITEM        : String(6);
            CHANGE_ORDER_NUMBER     : Integer;
            CHASSIS                 : String(40);
            CREDIT_STATUS           : String(2);
            DIVISION                : String(2);
            DOCUMENT_CURRENCY       : String(5);
            DTPO_NUMBER             : String(35);
            ENDING_CHASSIS          : String(40);
            OPS_PROCESSING_STATUS   : String(12);
            ORDER_ADD_DATE          : Date;
            PLANT                   : String(4);
            STARTING_CHASSIS        : String(40);
            SALES_ORGANIZATION      : String(4);
            CHASSIS_NET_PRICE       : Decimal(15, 2);
            EXCHANGE_RATE           : Decimal(9, 5);
            TAX_AMOUNT              : Decimal(13, 2);
            FREIGHT                 : Decimal(24, 9);
            OPS_CHASSIS_NO          : msg.ChassisNo;
            SOLD_TO                 : String(10);
            FIRM_SCHEDULE_DATE      : Date;
            TENTATIVE_SCHEDULE_DATE : Date;
            createdAt               : Timestamp @cds.on.insert : $now;
    }

    entity RemoteSnapshot as projection on s4remote.ZC_OPSRecon {
        key SalesOrder            as SALES_ORDER,
        key SalesOrderItem        as SALES_ORDER_ITEM,
            Blocked               as BLOCKED,
            Chassis               as CHASSIS,
            ChassisNetPrice       as CHASSIS_NET_PRICE,
            Division              as DIVISION,
            DocumentCurrency      as DOCUMENT_CURRENCY,
            DTPONumber            as DTPO_NUMBER,
            EndingChassis         as ENDING_CHASSIS,
            ExchangeRateAmt       as EXCHANGE_RATE,
            FirmScheduleDate      as FIRM_SCHEDULE_DATE,
            Freight               as FREIGHT,
            GlobalCurrency        as globalCurrency,
            OpenOrder             as openOrder,
            OPSChassisNo          as OPS_CHASSIS_NO,
            OPSProcessingStatus   as OPS_PROCESSING_STATUS,
            OrderAddDate          as ORDER_ADD_DATE,
            Plant                 as PLANT,
            RejectionReason       as reasonForRejection,
            SalesOrganization     as SALES_ORGANIZATION,
            SoldTo                as SOLD_TO,
            StartingChassis       as STARTING_CHASSIS,
            TaxAmount             as TAX_AMOUNT,
            TentativeScheduleDate as TENTATIVE_SCHEDULE_DATE
    }
}

// --------------------------------------------------------------------
// Facades
// --------------------------------------------------------------------
@cds.persistence.calcview
@cds.persistence.exists
entity![CV_OPS_RECON]{
    key DIVISION                         : String(2)      @title : '{i18n>division}';
    key DIVISION_NAME                    : String(20)     @title : '{i18n>division}';
    key CHASSIS                          : String(8)      @title : '{i18n>chassisNo}';
    key DTPO_NUMBER                      : String(35)     @title : '{i18n>DTPONumber}';
    key S4_SALES_ORDER                   : String(10)     @title : '{i18n>salesOrder}';
    key S4_ORDER_ADD_DATE                : Date           @title : 'S4 {i18n>orderAddDt}';
    key S4_DOCUMENT_CURRENCY             : String(5)      @title : 'S4 {i18n>currency}';
        S4_CHASSIS_NET_PRICE             : Decimal(15, 2) @title : 'S4 {i18n>CHASSIS_NET_PRICE}';
    key S4_EXCHANGE_RATE                 : Decimal(9, 5)  @title : 'S4 {i18n>exchangeRateAmt}';
    key S4_STARTING_CHASSIS              : String(40)     @title : 'S4 {i18n>startingChassis}';
    key S4_ENDING_CHASSIS                : String(40)     @title : 'S4 {i18n>endingChassis}';
    key S4_CHANGE_ORDER_NUMBER           : Integer        @title : 'S4 {i18n>changeOrderNo}';
    key S4_SALES_ORDER_ITEM              : String(6)      @title : '{i18n>salesOrderItem}';
    key S4_PROCESSING_STATUS             : String(12)     @title : 'S4 {i18n>processingStatusCd}';
    key S4_PLANT                         : String(4)      @title : 'S4 {i18n>plant}';
        S4_TAX_AMOUNT                    : Decimal(13, 2) @title : 'S4 {i18n>TAX_AMOUNT}';
        S4_FREIGHT                       : Decimal(24, 9) @title : 'S4 {i18n>frgtRateAmt}';
        S4_COMPARISON_AMOUNT             : Decimal(15, 2) @title : 'S4 {i18n>COMPARISON_AMOUNT}';
    key OPS_ORDERADDDT                   : Date           @title : 'OPS {i18n>orderAddDt}';
    key OPS_STARTINGCHASSIS              : String(8)      @title : 'OPS {i18n>startingChassis}';
    key OPS_ENDINGCHASSIS                : String(8)      @title : 'OPS {i18n>endingChassis}';
    key OPS_CHANGEORDERNO                : Integer        @title : 'OPS {i18n>changeOrderNo}';
        OPS_CHASSIS_NET_PRICE            : Decimal(15, 2) @title : 'OPS {i18n>CHASSIS_NET_PRICE}';
    key OPS_EXCHANGE_RATE                : Decimal(9, 5)  @title : 'OPS {i18n>exchangeRateAmt}';
    key OPS_CURRENCY                     : String(5)      @title : 'OPS {i18n>currency}';
    key OPS_PROCESINGSTATUSCD            : String(4)      @title : 'OPS {i18n>processingStatusCd}';
    key OPS_PLANTCD                      : String(1)      @title : 'OPS {i18n>plant}';
        OPS_COMPARISON_AMOUNT            : Decimal(15, 2) @title : 'OPS {i18n>COMPARISON_AMOUNT}';
        OPS_TAXAMOUNT                    : Decimal(13, 2) @title : 'OPS {i18n>TAX_AMOUNT}';
    key YN_ORDER_ADD_DATE                : String(1)      @title : '{i18n>YN_ORDER_ADD_DATE}';
    key YN_STARTING_CHASSIS              : String(1)      @title : '{i18n>YN_STARTING_CHASSIS}';
    key YN_ENDING_CHASSIS                : String(1)      @title : '{i18n>YN_ENDING_CHASSIS}';
    key YN_CHASSIS_NET_PRICE             : String(1)      @title : '{i18n>YN_CHASSIS_NET_PRICE}';
    key YN_EXCHANGE_RATE                 : String(1)      @title : '{i18n>YN_EXCHANGE_RATE}';
    key YN_CHANGE_ORDER_NUMBER           : String(1)      @title : '{i18n>YN_CHANGE_ORDER_NUMBER}';
    key YN_DOCUMENT_CURRENCY             : String(1)      @title : '{i18n>YN_DOCUMENT_CURRENCY}';
    key YN_PROCESSING_STATUS             : String(1)      @title : '{i18n>YN_PROCESSING_STATUS}';
    key YN_TAX_AMOUNT                    : String(1)      @title : '{i18n>YN_TAX_AMOUNT}';
    key YN_ALL                           : String(1)      @title : '{i18n>YN_ALL}';
        S4_TAX_COMPARISON_AMOUNT         : Decimal(13, 2) @title : 'S4 {i18n>TAX_COMPARISON_AMOUNT}';
        OPS_TAX_COMPARISON_AMOUNT        : Decimal(13, 2) @title : 'OPS {i18n>TAX_COMPARISON_AMOUNT}';
    key SCHEDULE_DATE                    : Date           @title : '{i18n>SCHEDULE_DATE}';
    key SCHEDULE_WEEK                    : String(8)      @title : '{i18n>SCHEDULE_WEEK}';
    key SCHEDULE_MONTH                   : String(7)      @title : '{i18n>SCHEDULE_MONTH}';
    key SCHEDULE_YEAR                    : String(4)      @title : '{i18n>SCHEDULE_YEAR}';
    key SCHEDULE_DATE_SOURCE             : String(3)      @title : '{i18n>SCHEDULE_DATE_SOURCE}';
    key SCHEDULE_DATE_TYPE               : String(9)      @title : '{i18n>SCHEDULE_DATE_TYPE}';
    key DAYS_UNTIL_SCHEDULED             : Integer        @title : '{i18n>DAYS_UNTIL_SCHEDULED}';
    key WEEKS_UNTIL_SCHEDULED            : Decimal(13, 2) @title : '{i18n>WEEKS_UNTIL_SCHEDULED}';
        MATCH_ORDER_ADD_DATE             : Integer        @title : '{i18n>MATCH_ORDER_ADD_DATE}';
        MATCH_STARTING_CHASSIS           : Integer        @title : '{i18n>MATCH_STARTING_CHASSIS}';
        MATCH_ENDING_CHASSIS             : Integer        @title : '{i18n>MATCH_ENDING_CHASSIS}';
        MATCH_CHASSIS_NET_PRICE          : Integer        @title : '{i18n>MATCH_CHASSIS_NET_PRICE}';
        MATCH_EXCHANGE_RATE              : Integer        @title : '{i18n>MATCH_EXCHANGE_RATE}';
        MATCH_CHANGE_ORDER_NUMBER        : Integer        @title : '{i18n>MATCH_CHANGE_ORDER_NUMBER}';
        MATCH_DOCUMENT_CURRENCY          : Integer        @title : '{i18n>MATCH_DOCUMENT_CURRENCY}';
        MATCH_PROCESSING_STATUS          : Integer        @title : '{i18n>MATCH_PROCESSING_STATUS}';
        MATCH_TAX_AMOUNT                 : Integer        @title : '{i18n>MATCH_TAX_AMOUNT}';
        MATCH_ALL                        : Integer        @title : '{i18n>MATCH_ALL}';
    key DEALER_CODE                      : String(10)     @title : '{i18n>dealerCd}';
    key FIRST_ISSUE                      : String(30)     @title : '{i18n>FIRST_ISSUE}';
    key CHASSIS_STATUS                   : String(2)      @title : '{i18n>CHASSIS_STATUS}';
        UNMATCH_CHASSIS_NET_PRICE        : Integer        @title : '{i18n>UNMATCH_CHASSIS_NET_PRICE}';
        UNMATCH_EXCHANGE_RATE            : Integer        @title : '{i18n>UNMATCH_EXCHANGE_RATE}';
        UNMATCH_CHANGE_ORDER_NUMBER      : Integer        @title : '{i18n>UNMATCH_CHANGE_ORDER_NUMBER}';
        UNMATCH_DOCUMENT_CURRENCY        : Integer        @title : '{i18n>UNMATCH_DOCUMENT_CURRENCY}';
        UNMATCH_PROCESSING_STATUS        : Integer        @title : '{i18n>UNMATCH_PROCESSING_STATUS}';
        UNMATCH_TAX_AMOUNT               : Integer        @title : '{i18n>UNMATCH_TAX_AMOUNT}';
        UNMATCH_ANY                      : Integer        @title : '{i18n>UNMATCH_ANY}';
        COUNTER                          : Integer        @title : '{i18n>COUNTER}';
        UNMATCH_ORDER_ADD_DATE           : Integer        @title : '{i18n>UNMATCH_ORDER_ADD_DATE}';
        MATCH_CREDIT_STATUS              : Integer        @title : '{i18n>MATCH_CREDIT_STATUS';
        UNMATCH_CREDIT_STATUS            : Integer        @title : '{i18n>UNMATCH_CREDIT_STATUS}';
    key YN_CREDIT_STATUS                 : String(1)      @title : '{i18n>YN_CREDIT_STATUS}';
    key OPS_CREDIT_STATUS                : String(2)      @title : 'OPS {i18n>CREDIT_STATUS}';
    key S4_CREDIT_STATUS                 : String(2)      @title : 'S4 {i18n>CREDIT_STATUS}';
        COMPARISON_AMOUNT_DIFFERENCE     : Decimal(15)    @title : '{i18n>COMPARISON_AMOUNT_DIFFERENCE}';
        TAX_COMPARISON_AMOUNT_DIFFERENCE : Decimal(13)    @title : '{i18n>TAX_COMPARISON_AMOUNT_DIFFERENCE}';

        // Associations
        to_S4Snapshot                    : Association to recon.S4Snapshot
                                               on  to_S4Snapshot.SALES_ORDER      = $self.S4_SALES_ORDER
                                               and to_S4Snapshot.SALES_ORDER_ITEM = $self.S4_SALES_ORDER_ITEM;
}
