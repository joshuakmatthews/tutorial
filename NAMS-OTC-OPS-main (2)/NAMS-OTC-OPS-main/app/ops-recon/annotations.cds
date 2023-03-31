using ReconViewerService as service from '../../srv/recon-viewer-svc';

annotate service.OPSRecon with @(
    UI.SelectionFields : [
        DIVISION,
        CHASSIS,
        DTPO_NUMBER,
        YN_ALL
    ],

    UI.LineItem : [
        { $Type : 'UI.DataField', Value : DIVISION, },
        { $Type : 'UI.DataField', Value : CHASSIS, },
        { $Type : 'UI.DataField', Value : DTPO_NUMBER, },
        { $Type : 'UI.DataField', Value : S4_SALES_ORDER, },
        { $Type : 'UI.DataField', Value : YN_CHANGE_ORDER_NUMBER, },
        { $Type : 'UI.DataField', Value : OPS_CHANGEORDERNO, },
        { $Type : 'UI.DataField', Value : S4_CHANGE_ORDER_NUMBER, },
        { $Type : 'UI.DataField', Value : YN_ORDER_ADD_DATE, },
        { $Type : 'UI.DataField', Value : OPS_ORDERADDDT, },
        { $Type : 'UI.DataField', Value : S4_ORDER_ADD_DATE, },
        { $Type : 'UI.DataField', Value : YN_PROCESSING_STATUS, },
        { $Type : 'UI.DataField', Value : OPS_PROCESINGSTATUSCD, },
        { $Type : 'UI.DataField', Value : S4_PROCESSING_STATUS, },
        { $Type : 'UI.DataField', Value : YN_DOCUMENT_CURRENCY, },
        { $Type : 'UI.DataField', Value : OPS_CURRENCY, },
        { $Type : 'UI.DataField', Value : S4_DOCUMENT_CURRENCY, },
        { $Type : 'UI.DataField', Value : YN_CREDIT_STATUS, },
        { $Type : 'UI.DataField', Value : OPS_CREDIT_STATUS, },
        { $Type : 'UI.DataField', Value : S4_CREDIT_STATUS, },
        { $Type : 'UI.DataField', Value : YN_EXCHANGE_RATE, },
        { $Type : 'UI.DataField', Value : YN_CHASSIS_NET_PRICE, },
        { $Type : 'UI.DataField', Value : YN_TAX_AMOUNT, },
        { $Type : 'UI.DataField', Value : SCHEDULE_DATE, },
        { $Type : 'UI.DataField', Value : SCHEDULE_DATE_TYPE, },
        { $Type : 'UI.DataField', Value : S4_CHASSIS_NET_PRICE, },
        { $Type : 'UI.DataField', Value : S4_FREIGHT, },
        { $Type : 'UI.DataField', Value : S4_TAX_AMOUNT, },
        { $Type : 'UI.DataField', Value : S4_COMPARISON_AMOUNT, },
        { $Type : 'UI.DataField', Value : S4_TAX_COMPARISON_AMOUNT, },
        { $Type : 'UI.DataField', Value : OPS_CHASSIS_NET_PRICE, },
        { $Type : 'UI.DataField', Value : OPS_TAXAMOUNT, },
        { $Type : 'UI.DataField', Value : OPS_COMPARISON_AMOUNT, },
        { $Type : 'UI.DataField', Value : OPS_TAX_COMPARISON_AMOUNT, },
    ]
);
annotate service.OPSRecon with @(
    UI.FieldGroup #GeneratedGroup1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            { $Type : 'UI.DataField', Value : DIVISION, },
            { $Type : 'UI.DataField', Value : CHASSIS, },
            { $Type : 'UI.DataField', Value : DTPO_NUMBER, },
            { $Type : 'UI.DataField', Value : S4_SALES_ORDER, },
            { $Type : 'UI.DataField', Value : YN_CHANGE_ORDER_NUMBER, },
            { $Type : 'UI.DataField', Value : OPS_CHANGEORDERNO, },
            { $Type : 'UI.DataField', Value : S4_CHANGE_ORDER_NUMBER, },
            { $Type : 'UI.DataField', Value : YN_ORDER_ADD_DATE, },
            { $Type : 'UI.DataField', Value : OPS_ORDERADDDT, },
            { $Type : 'UI.DataField', Value : S4_ORDER_ADD_DATE, },
            { $Type : 'UI.DataField', Value : YN_PROCESSING_STATUS, },
            { $Type : 'UI.DataField', Value : OPS_PROCESINGSTATUSCD, },
            { $Type : 'UI.DataField', Value : S4_PROCESSING_STATUS, },
            { $Type : 'UI.DataField', Value : YN_DOCUMENT_CURRENCY, },
            { $Type : 'UI.DataField', Value : OPS_CURRENCY, },
            { $Type : 'UI.DataField', Value : S4_DOCUMENT_CURRENCY, },
            { $Type : 'UI.DataField', Value : YN_CREDIT_STATUS, },
            { $Type : 'UI.DataField', Value : OPS_CREDIT_STATUS, },
            { $Type : 'UI.DataField', Value : S4_CREDIT_STATUS, },
            { $Type : 'UI.DataField', Value : YN_EXCHANGE_RATE, },
            { $Type : 'UI.DataField', Value : YN_CHASSIS_NET_PRICE, },
            { $Type : 'UI.DataField', Value : YN_TAX_AMOUNT, },
            { $Type : 'UI.DataField', Value : SCHEDULE_DATE, },
            { $Type : 'UI.DataField', Value : SCHEDULE_DATE_TYPE, },
            { $Type : 'UI.DataField', Value : S4_CHASSIS_NET_PRICE, },
            { $Type : 'UI.DataField', Value : S4_FREIGHT, },
            { $Type : 'UI.DataField', Value : S4_TAX_AMOUNT, },
            { $Type : 'UI.DataField', Value : S4_COMPARISON_AMOUNT, },
            { $Type : 'UI.DataField', Value : S4_TAX_COMPARISON_AMOUNT, },
            { $Type : 'UI.DataField', Value : OPS_CHASSIS_NET_PRICE, },
            { $Type : 'UI.DataField', Value : OPS_TAXAMOUNT, },
            { $Type : 'UI.DataField', Value : OPS_COMPARISON_AMOUNT, },
            { $Type : 'UI.DataField', Value : OPS_TAX_COMPARISON_AMOUNT, },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup1', },
    ]
) {
    YN_ALL @Common.FilterDefaultValue : 'N';
};