using MDMaintService as service from '../../srv/md-svc';

annotate service.Reserves with @(UI : {

    SelectionFields : [
        divisionCd,
        reserveType,
        engineType,
        class,
        salesModelFamily,
        country,
        typeOfSale,
        rate
    ],

    LineItem : [
        { $Type : 'UI.DataField', Value : divisionCd },
        { $Type : 'UI.DataField', Value : reserveType },
        { $Type : 'UI.DataField', Value : engineType },
        { $Type : 'UI.DataField', Value : class },
        { $Type : 'UI.DataField', Value : salesModelFamily },
        { $Type : 'UI.DataField', Value : country },
        { $Type : 'UI.DataField', Value : typeOfSale },
        { $Type : 'UI.DataField', Value : rate },
        { $Type : 'UI.DataField', Value : createdAt },
        { $Type : 'UI.DataField', Value : createdBy },
        { $Type : 'UI.DataField', Value : modifiedAt },
        { $Type : 'UI.DataField', Value : modifiedBy }
    ],

    HeaderInfo      : { 
        Title          : { 
            $Type : 'UI.DataField',
            Value : reserveType
        },
        Description    : {
            $Type : 'UI.DataField',
            Value : divisionCd
        },
        $Type          : 'UI.HeaderInfoType',
        TypeName       : '{i18n>Reserve}',
        TypeNamePlural : '{i18n>Reserves}',
    },

    Facets: [
        {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Attr', Label: '{i18n>Attributes}'}
    ],

    FieldGroup#Attr: {
        Data:[
            { $Type : 'UI.DataField', Value : divisionCd },
            { $Type : 'UI.DataField', Value : reserveType },
            { $Type : 'UI.DataField', Value : engineType },
            { $Type : 'UI.DataField', Value : class },
            { $Type : 'UI.DataField', Value : salesModelFamily },
            { $Type : 'UI.DataField', Value : country },
            { $Type : 'UI.DataField', Value : typeOfSale },
            { $Type : 'UI.DataField', Value : rate },
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
