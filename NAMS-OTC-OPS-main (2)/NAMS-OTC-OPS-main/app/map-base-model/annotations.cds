using MapService as service from '../../srv/map-svc';

annotate service.BaseModel with @(UI : {

    SelectionFields     : [
        divisionCd,
        baseModelCd,
        salesModelFamily
    ],

    LineItem            : [
        {
            $Type : 'UI.DataField',
            Value : divisionCd
        },
        {
            $Type : 'UI.DataField',
            Value : baseModelCd
        },
        {
            $Type : 'UI.DataField',
            Value : salesModelFamily
        }
    ],

    HeaderInfo          : {
        Title          : {
            $Type : 'UI.DataField',
            Value : divisionCd
        },
        Description    : {
            $Type : 'UI.DataField',
            Value : baseModelCd
        },
        $Type          : 'UI.HeaderInfoType',
        TypeName       : '{i18n>division}',
        TypeNamePlural : '{i18n>divisions}',
    },

    Facets              : [{
        $Type  : 'UI.ReferenceFacet',
        Target : '@UI.FieldGroup#Mapping',
        Label  : '{i18n>FacetMapping}'
    }],

    FieldGroup #Mapping : {Data : [
        {
            $Type : 'UI.DataField',
            Value : divisionCd
        },
        {
            $Type : 'UI.DataField',
            Value : baseModelCd
        },
        {
            $Type : 'UI.DataField',
            Value : salesModelFamily
        },
        {
            $Type : 'UI.DataField',
            Value : createdAt
        },
        {
            $Type : 'UI.DataField',
            Value : createdBy
        },
        {
            $Type : 'UI.DataField',
            Value : modifiedAt
        },
        {
            $Type : 'UI.DataField',
            Value : modifiedBy
        }
    ]}

}) {
    divisionCd       @title : '{i18n>divisionCd}';
    baseModelCd      @title : '{i18n>baseModelCd}';
    salesModelFamily @title : '{i18n>salesModelFamily}';
    createdAt        @readonly;
    createdBy        @readonly;
    modifiedAt       @readonly;
    modifiedBy       @readonly;
};
