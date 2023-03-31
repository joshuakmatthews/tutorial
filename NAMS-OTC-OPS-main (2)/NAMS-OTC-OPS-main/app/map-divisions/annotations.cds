using MapService as service from '../../srv/map-svc';

annotate service.Divisions with @(UI : {

    SelectionFields : [
        divisionCd,
        spart
    ],

    LineItem : [
        { $Type : 'UI.DataField', Value : divisionCd },
        { $Type : 'UI.DataField', Value : spart }
    ],

    HeaderInfo      : { 
        Title          : { 
            $Type : 'UI.DataField',
            Value : divisionCd
        },
        Description    : {
            $Type : 'UI.DataField',
            Value : divisionCd
        },
        $Type          : 'UI.HeaderInfoType',
        TypeName       : '{i18n>division}',
        TypeNamePlural : '{i18n>divisions}',
    },

    Facets: [
        {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Mapping', Label: '{i18n>FacetMapping}'}
    ],

    FieldGroup#Mapping: {
        Data:[
            { $Type : 'UI.DataField', Value : divisionCd },
            { $Type : 'UI.DataField', Value : spart },
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