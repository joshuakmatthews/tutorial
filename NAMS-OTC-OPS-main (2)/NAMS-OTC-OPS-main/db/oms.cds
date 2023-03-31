// If you have more than 1 database connection then:
//   1) Use hana-cli copy2DefaultEnv to copy .env file and reformat
//   2) rename default-env.json to default-env-admin.json
//   3) remove secondary HDI references from default-env-admin.json
// Then continue with following:
// 4) Use hana-cli inspectView -a -v CV_S4ORDERS -o cds to get below output generated from CV defition
//   a) -a switch tells it to use admin file, default-env-admin.json
//   b) provide column view name when prompted
// 5) Replace @title : 'VBELN: VBELN' with '{i18n>VBELN}' etc. and maintain entries in srv/i18n/i18n.properties file
// See: https://developers.sap.com/tutorials/hana-cloud-cap-calc-view.html
// See the following for info on using calc views with parameters in CDS
// https://cap.cloud.sap/docs/advanced/hana#views-with-parameters
namespace oms;

// --------------------------------------------------------------------
// OMS Facades
// --------------------------------------------------------------------
@cds.persistence.calcview
@cds.persistence.exists
entity![CV_DIM_SALES_OPTION]{
    key![DIVISION_CODE]                        : String(1);
    key![SALES_OPTION_CODE]                    : String(7);
       ![SALES_OPTION_IDENTIFIER]              : Integer;
       ![OPTION_TYPE_KEY]                      : String(2);
       ![OPTION_TYPE_TEXT]                     : String(75);
       ![PURPOSE_KEY]                          : Integer;
       ![PURPOSE_TEXT]                         : String(75);
       ![PROSPECTOR_DESCRIPTION_KEY]           : Integer;
       ![PROSPECTOR_DESCRIPTION_TEXT]          : String(2000);
       ![PROSPECTOR_EXTENDED_DESCRIPTION_KEY]  : Integer;
       ![PROSPECTOR_EXTENDED_DESCRIPTION_TEXT] : String(2000);
       ![OPS_SHORT_DESCRIPTION]                : String(8);
       ![OPS_LINE_1_DESCRIPTION]               : String(255)@title : '{i18n>OPSLine1Description}';
       ![OPS_LINE_2_DESCRIPTION]               : String(255)@title : '{i18n>OPSLine2Description}';
       ![OBSOLETE_INDICATOR]                   : Boolean;
       ![PACMAN_DESCRIPTION_TEXT]              : String(1000);
       ![FET_EXEMPT]                           : String(2000);
       ![TPN]                                  : String(2000);
       ![TQ]                                   : String(2000);
       ![AWGT]                                 : Integer;
}

@cds.persistence.calcview
@cds.persistence.exists
entity![CV_DIM_SALES_OPTION_ATTR]{
    key![DIVISION_CODE]           : String(1);
    key![SALES_OPTION_IDENTIFIER] : Integer;
       ![FETX]                    : String(2000);
       ![TPN]                     : String(2000);
       ![TQ]                      : String(2000);
}

@cds.persistence.calcview
@cds.persistence.exists
entity![CV_DIM_SALES_OPTION_NOTE]{
    key![DIVISION_CODE]       : String(1);
    key![SALES_OPTION_CODE]   : String(7);
    key![NOTE_LINE_NUMBER]    : Integer;
       ![NOTE_LINE_TEXT]      : String(2000);
       ![OPS_PRINT_INDICATOR] : Boolean;
}

@cds.persistence.calcview
@cds.persistence.exists
entity![CV_DIM_TIME_PERIOD]{
    key![DIVISION_CODE]          : String(1);
    key![TIME_PERIOD_KEY]        : Integer;
       ![TIME_PERIOD_TEXT]       : String(255);
       ![TIME_PERIOD_START_DATE] : Date;
       ![TIME_PERIOD_END_DATE]   : Date;
       ![TIME_PERIOD_TYPE_KEY]   : String(4);
       ![TIME_PERIOD_TYPE_TEXT]  : String(75);
}

@cds.persistence.calcview
@cds.persistence.exists
entity![CV_OPTION_MODEL_PRICE_PERIOD]{
    key![DIVISION_CODE]              : String(1);
    key![SALES_OPTION_CODE]          : String(7);
    key![TRUCK_MODEL_CODE]           : String(7);
    key![TIME_PERIOD_EFFECTIVE_DATE] : Date;
       ![TIME_PERIOD_TEXT]           : String(255);
       ![MARKET_PRICE_AMOUNT]        : Decimal(19, 4);
       ![MARKET_PRICE_DESCRIPTION]   : String(255);
       ![REVIEW_DATE]                : Timestamp;
       ![PLANT_LABOR_RATE]           : Decimal(7, 3);
       ![BURDEN_LABOR_AMOUNT]        : Decimal(19, 4);
       ![FREIGHT_RATE]               : Decimal(8, 5);
       ![MARKUP_FACTOR]              : Decimal(7, 3);
       ![COMMON_COST_CODE]           : String(8);
       ![COMMON_MATERIAL_COST]       : Decimal(19, 4);
       ![COMMON_LABOR]               : Decimal(9, 4);
       ![UNIQUE_MATERIAL_COST]       : Decimal(19, 4);
       ![TOTAL_MATERIAL_COST]        : Decimal(19, 4);
       ![TOTAL_LABOR]                : Decimal(9, 4);
       ![OPTIONS_COST]               : Decimal(19, 4);
       ![STANDARD_COST]              : Decimal(19, 4);
       ![NET_COST]                   : Decimal(19, 4);
       ![LIST_PRICE]                 : Integer;
       ![WEIGHT_DIFFERENCE]          : Integer;
       ![PROSPECTOR_STATUS_KEY]      : String(2);
       ![PROSPECTOR_STATUS_TEXT]     : String(75);
}

@cds.persistence.calcview
@cds.persistence.exists
entity![CV_PRICE_PROTECTION]{
    key![DIVISION_CODE]           : String(1);
    key![SALES_OPTION_CODE]       : String(7);
       ![LIST_PRICE_NOW]          : Integer;
       ![WEIGHT_DIFFERENCE]       : Integer;
       ![PROSPECTOR_STATUS_KEY]   : String(2);
       ![LIST_PRICE_EFF_DT]       : Integer;
       ![PRICE_PROTECTION_AMOUNT] : Integer;
}
