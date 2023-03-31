using MDMaintService as service from '../../srv/md-svc';

annotate service.SpecialRanges with @(UI : {

    SelectionFields : [
        divisionCd,
        rangeNameText,
        rangeSeqNo,
        rangeNameDesc,
        rangeSeqEffDate,
        fromValue,
        toValue,
        lastModDate
    ],

    LineItem : [
        { $Type : 'UI.DataField', Value : divisionCd },
        { $Type : 'UI.DataField', Value : rangeNameText },
        { $Type : 'UI.DataField', Value : rangeSeqNo },
        { $Type : 'UI.DataField', Value : rangeNameDesc },
        { $Type : 'UI.DataField', Value : rangeSeqEffDate },
        { $Type : 'UI.DataField', Value : fromValue },
        { $Type : 'UI.DataField', Value : toValue },
        { $Type : 'UI.DataField', Value : lastModDate },
        { $Type : 'UI.DataField', Value : createdAt },
        { $Type : 'UI.DataField', Value : createdBy },
        { $Type : 'UI.DataField', Value : modifiedAt },
        { $Type : 'UI.DataField', Value : modifiedBy }
    ],

    HeaderInfo      : { 
        Title          : { 
            $Type : 'UI.DataField',
            Value : rangeNameText
        },
        Description    : {
            $Type : 'UI.DataField',
            Value : divisionCd
        },
        $Type          : 'UI.HeaderInfoType',
        TypeName       : '{i18n>SpecialRange}',
        TypeNamePlural : '{i18n>SpecialRanges}',
    },

    Facets: [
        {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Attr', Label: '{i18n>Attributes}'}
    ],

    FieldGroup#Attr: {
        Data:[
            { $Type : 'UI.DataField', Value : divisionCd },
            { $Type : 'UI.DataField', Value : rangeNameText },
            { $Type : 'UI.DataField', Value : rangeSeqNo },
            { $Type : 'UI.DataField', Value : rangeNameDesc },
            { $Type : 'UI.DataField', Value : rangeSeqEffDate },
            { $Type : 'UI.DataField', Value : fromValue },
            { $Type : 'UI.DataField', Value : toValue },
            { $Type : 'UI.DataField', Value : lastModDate },
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
