namespace ops;

using {managed} from '@sap/cds/common';

// Promo option codes that are only available in OPS (not OMS or TOA), e.g. warranty replacement
entity PromoCodes : managed {
    key divisionCd     : String(1);
    key salesOptnNo    : String(7);
    key salesOptnModNo : String(7);
        promoStDt      : Date;
        promoEndDt     : Date;
        promoPrcAmt    : Integer;
        sOptDesc1      : String(45);
        sOptDesc2      : String(45);
}
