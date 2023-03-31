using MDMaintService as service from '../../srv/md-svc';

annotate service.MarketingFees with @(UI : {

    SelectionFields : [
        divisionCd,
        class,
        unitTypeCd,
        effectiveDt
    ],

    LineItem : [
        { $Type : 'UI.DataField', Value : divisionCd },
        { $Type : 'UI.DataField', Value : class },
        { $Type : 'UI.DataField', Value : unitTypeCd },
        { $Type : 'UI.DataField', Value : effectiveDt },
        { $Type : 'UI.DataField', Value : fee },
        { $Type : 'UI.DataField', Value : createdAt },
        { $Type : 'UI.DataField', Value : createdBy },
        { $Type : 'UI.DataField', Value : modifiedAt },
        { $Type : 'UI.DataField', Value : modifiedBy }
    ],

    HeaderInfo      : { 
        Title          : { 
            $Type : 'UI.DataField',
            Value : class
        },
        Description    : {
            $Type : 'UI.DataField',
            Value : divisionCd
        },
        $Type          : 'UI.HeaderInfoType',
        TypeName       : '{i18n>MarketingFee}',
        TypeNamePlural : '{i18n>MarketingFees}',
    },

    Facets: [
        {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Fees', Label: '{i18n>FacetFee}'}
    ],

    FieldGroup#Fees: {
        Data:[
            {$Type: 'UI.DataField', Value: effectiveDt },
            {$Type: 'UI.DataField', Value: fee },
            {$Type: 'UI.DataField', Value: createdAt },
            {$Type: 'UI.DataField', Value: createdBy },
            {$Type: 'UI.DataField', Value: modifiedAt },
            {$Type: 'UI.DataField', Value: modifiedBy }
        ]
    }

}) {
    createdAt  @readonly;
    createdBy  @readonly;
    modifiedAt @readonly;
    modifiedBy @readonly;
};
