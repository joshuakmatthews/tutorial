using MapService as service from '../../srv/map-svc';

annotate service.SalesDocTypes with @(UI : {

    SelectionFields : [
        divisionCd,
        seq,
        isWarrRepl,
        dealerOwnerGrp,
        dealerCd,
        salesDocType
    ],

    LineItem : [
        { $Type : 'UI.DataField', Value : divisionCd },
        { $Type : 'UI.DataField', Value : seq },
        { $Type : 'UI.DataField', Value : isWarrRepl },
        { $Type : 'UI.DataField', Value : dealerOwnerGrp },
        { $Type : 'UI.DataField', Value : dealerCd },
        { $Type : 'UI.DataField', Value : salesDocType },
        { $Type : 'UI.DataField', Value : createdAt },
        { $Type : 'UI.DataField', Value : createdBy },
        { $Type : 'UI.DataField', Value : modifiedAt },
        { $Type : 'UI.DataField', Value : modifiedBy }
    ],
    PresentationVariant  : {
        $Type : 'UI.PresentationVariantType',
        RequestAtLeast : [
            'seq',
            'divisionCd'
        ],
        SortOrder : [
            {
                $Type : 'Common.SortOrderType',
                Property : divisionCd
            },
            {
                $Type : 'Common.SortOrderType',
                Property : seq
            },
        ],
        Visualizations : [
            '@UI.LineItem',
        ],
    },

    HeaderInfo      : { 
        Title          : { 
            $Type : 'UI.DataField',
            Value : seq
        },
        Description    : {
            $Type : 'UI.DataField',
            Value : salesDocType
        },
        $Type          : 'UI.HeaderInfoType',
        TypeName       : '{i18n>salesDocType}',
        TypeNamePlural : '{i18n>salesDocTypes}',
    },

    Facets: [
        {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Mapping', Label: '{i18n>FacetMapping}'}
    ],

    FieldGroup#Mapping: {
        Data:[
            { $Type : 'UI.DataField', Value : divisionCd },
            { $Type : 'UI.DataField', Value : seq },
            { $Type : 'UI.DataField', Value : isWarrRepl },
            { $Type : 'UI.DataField', Value : dealerOwnerGrp },
            { $Type : 'UI.DataField', Value : dealerCd },
            { $Type : 'UI.DataField', Value : salesDocType },
            { $Type : 'UI.DataField', Value : createdAt },
            { $Type : 'UI.DataField', Value : createdBy },
            { $Type : 'UI.DataField', Value : modifiedAt },
            { $Type : 'UI.DataField', Value : modifiedBy }
        ]
    }

}) {
    createdAt  @readonly;
    createdBy  @readonly;
    modifiedAt @readonly;
    modifiedBy @readonly;
};