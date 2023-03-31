namespace md;

using {
    managed,
    cuid
} from '@sap/cds/common';

using {cv} from './cv';

entity Reserves : managed {
    key divisionCd       : String(1)      @title : '{i18n>divisionCd}';
    key reserveType      : String(25)     @title : '{i18n>reserveType}';
    key engineType       : String(40)     @title : '{i18n>engineType}';
    key class            : String(1)      @title : '{i18n>class}';
    key salesModelFamily : String(20)     @title : '{i18n>salesModelFamily}';
    key country          : String(3)      @title : '{i18n>country}';
    key typeOfSale       : String(3)      @title : '{i18n>typeOfSale}';
        rate             : Decimal(17, 2) @title : '{i18n>rate}'
}

//V729 - Ranges
entity OptionsRanges {
    key divisionCd      : String(1)  @title : '{i18n>divisionCd}';
    key rangeNameText   : String(30) @title : '{i18n>rangeNameText}';
    key rangeSeqNo      : Integer    @title : '{i18n>rangeSeqNo}';
        rangeNameDesc   : String(45) @title : '{i18n>rangeNameDesc}';
        rangeSeqEffDate : Date       @title : '{i18n>effectiveDt}';
        fromValue       : String(7)  @title : '{i18n>fromValue}';
        toValue         : String(7)  @title : '{i18n>toValue}';
        lastModDate     : Date       @title : '{i18n>lostModDate}';
};

//Special/unlisted ranges
entity SpecialRanges : OptionsRanges, managed {};

//V10006 - Freight
entity Freight : managed {
    key divisionCd  : String(1);
    key dlrNo       : String(4);
    key pltCd       : String(1);
    key modelNo     : String(7);
        frgtRateAmt : Integer @title : '{i18n>frgtRateAmt}';
};

//V472 - Model Discount
entity ModelDiscount : managed {
    key divisionCd  : String(1);
    key modelNo     : String(7);
    key effectiveDt : Date;
        discPct     : Decimal(3, 1);
};

@Common.SemanticKey : [
    divisionCd,
    effectiveDt
]
entity DefaultDiscount : cuid, managed {
    divisionCd  : String(1);
    effectiveDt : Date;
    discPct     : Decimal(3, 1);
};

// Marketing Fees - hardcoded in OPS, no table source
entity MarketingFees : managed {
    key divisionCd  : String(1)             @title : '{i18n>divisionCd}';
    key class       : String(1)             @title : '{i18n>class}';
    key unitTypeCd  : String(1) default '*' @title : '{i18n>unitTypeCd}';
    key effectiveDt : Date                  @title : '{i18n>effectiveDt}';
        fee         : Integer               @title : '{i18n>fee}';
}

entity CostModels : managed {
    key divisionCd  : String(1)  @title : '{i18n>divisionCd}';
    key costModelCd : String(8)  @title : '{i18n>costModelCd}';
        class       : String(1)  @title : '{i18n>class}';
        cabType     : String(70) @title : '{i18n>cabType}';
}
