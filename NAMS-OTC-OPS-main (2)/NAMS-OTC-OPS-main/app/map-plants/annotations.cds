using MapService as service from '../../srv/map-svc';

annotate service.Plants with @(UI : {

    SelectionFields : [
        divisionCd,
        plantCd
    ],

    LineItem : [
        { $Type : 'UI.DataField', Value : divisionCd },
        { $Type : 'UI.DataField', Value : plantCd },
        { $Type : 'UI.DataField', Value : USPlant },
        { $Type : 'UI.DataField', Value : CAPlant },
        { $Type : 'UI.DataField', Value : FETPlant }
    ],

    HeaderInfo      : { 
        Title          : { 
            $Type : 'UI.DataField',
            Value : plantCd
        },
        Description    : {
            $Type : 'UI.DataField',
            Value : plantCd
        },
        $Type          : 'UI.HeaderInfoType',
        TypeName       : '{i18n>plant}',
        TypeNamePlural : '{i18n>plants}',
    },

    Facets: [
        {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Mapping', Label: '{i18n>FacetMapping}'}
    ],

    FieldGroup#Mapping: {
        Data:[
            { $Type : 'UI.DataField', Value : divisionCd },
            { $Type : 'UI.DataField', Value : plantCd },
            { $Type : 'UI.DataField', Value : USPlant },
            { $Type : 'UI.DataField', Value : CAPlant },
            { $Type : 'UI.DataField', Value : FETPlant },
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