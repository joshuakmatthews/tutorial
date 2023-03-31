using MDMaintService as service from '../../srv/md-svc';

annotate service.CostModels with @(UI : {

    SelectionFields : [
        divisionCd,
        costModelCd,
        class,
        cabType
    ],

    LineItem : [
        { $Type : 'UI.DataField', Value : divisionCd },
        { $Type : 'UI.DataField', Value : costModelCd },
        { $Type : 'UI.DataField', Value : class },
        { $Type : 'UI.DataField', Value : cabType },
        { $Type : 'UI.DataField', Value : createdAt },
        { $Type : 'UI.DataField', Value : createdBy },
        { $Type : 'UI.DataField', Value : modifiedAt },
        { $Type : 'UI.DataField', Value : modifiedBy }
    ],

    HeaderInfo      : { 
        Title          : { 
            $Type : 'UI.DataField',
            Value : costModelCd
        },
        Description    : {
            $Type : 'UI.DataField',
            Value : divisionCd
        },
        $Type          : 'UI.HeaderInfoType',
        TypeName       : '{i18n>CostModel}',
        TypeNamePlural : '{i18n>CostModels}',
    },

    Facets: [
        {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Class', Label: '{i18n>FacetClass}'}
    ],

    FieldGroup#Class: {
        Data:[
            {$Type: 'UI.DataField', Value: class },
            {$Type: 'UI.DataField', Value: cabType },
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
