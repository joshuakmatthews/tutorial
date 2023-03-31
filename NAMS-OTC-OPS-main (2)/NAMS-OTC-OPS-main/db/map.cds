namespace map;

using {
    cuid,
    managed
} from '@sap/cds/common';

// Map OPS to S4 division code (for calculation join performance)
entity Divisions : managed {
    key divisionCd : String(1) @title : '{i18n>divisionCd}';
        spart      : String(2) @title : '{i18n>division}';
}

// Business-maintained mapping table for determining sales document type
entity SalesDocTypes : cuid, managed {
    seq            : Integer               @title : '{i18n>seq}';
    divisionCd     : String(2)             @title : '{i18n>divisionCd}';
    isWarrRepl     : Boolean default false @title : '{i18n>isWarrRepl}';
    dealerOwnerGrp : String(10)            @title : '{i18n>dealerOwnerGrp}';
    dealerCd       : String(4)             @title : '{i18n>dealerCd}';
    salesDocType   : String(4)             @title : '{i18n>salesDocType}';
}

// Map OPS plant code to SAP plant
entity Plants : managed {
    key divisionCd : String(1) @title : '{i18n>divisionCd}';
    key plantCd    : String(1) @title : '{i18n>plantCd}';
        USPlant    : String(4) @title : '{i18n>USPlant}';
        CAPlant    : String(4) @title : '{i18n>CAPlant}';
        FETPlant   : String(4) @title : '{i18n>FETPlant}'; // Plant for determining taxes
}

// Map base model option code
entity BaseModel : managed {
    key divisionCd       : String(1);
    key baseModelCd      : String(7);
        salesModelFamily : String(20);
}
