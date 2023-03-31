service RepriceService {

    action GetMismatches @(requires : [
        'Admin',
        'system-user'
    ])(divisionCd : String(1)) returns array of UUID;

    type orderPrice {
        ID             : UUID;
        FETExemptAmt   : Decimal(10, 3);
        frgtRateAmt    : Integer;
        listPrice      : Integer;
        marketingFee   : Integer;
        priceProtAmt   : Integer;
        promoAmt       : Integer;
        stdDlrDiscPct  : Decimal(3, 1);
        surchargesNSTD : Integer;
        surchargesZH00 : Integer;
        surchargesZISF : Integer;
        surchargesZMAD : Integer;
        tireFET        : Decimal(15, 3);
        warrOptAmt     : Integer;
    }

    type repricedOrder {
        divisionCd : String(1);
        chassisNo  : String(8);
        DTPONumber : String(8);
        old        : orderPrice;
        new        : orderPrice;
    }

    type repricedOrders : array of repricedOrder;

    action RepriceMismatches @(requires : [
        'Admin',
        'system-user'
    ])(ids : array of UUID)     returns repricedOrders;

};
