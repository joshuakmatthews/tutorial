using MDMaintService as service from '../../srv/md-svc';

annotate service.DefaultDiscount with @(
    odata.draft.enabled : true,

    UI.SelectionFields  : [
        divisionCd,
        effectiveDt
    ],

    UI.LineItem         : [
        {
            $Type : 'UI.DataField',
            Value : divisionCd,
        },
        {
            $Type : 'UI.DataField',
            Value : effectiveDt,
        },
        {
            $Type : 'UI.DataField',
            Value : discPct,
        },
    ]
);

annotate service.DefaultDiscount with @(
    UI.FieldGroup #GeneratedGroup1 : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            {
                $Type : 'UI.DataField',
                Value : divisionCd,
            },
            {
                $Type : 'UI.DataField',
                Value : effectiveDt,
            },
            {
                $Type : 'UI.DataField',
                Value : discPct,
            },
        ],
    },
    UI.Facets                      : [{
        $Type  : 'UI.ReferenceFacet',
        ID     : 'GeneratedFacet1',
        Label  : '{i18m>FacetDefaultDiscount}',
        Target : '@UI.FieldGroup#GeneratedGroup1',
    }, ]
) {
    ID          @(
        Core.Computed,
        Common.Text            : divisionCd,
        Common.TextArrangement : #TextOnly
    );
    createdAt   @readonly;
    createdBy   @readonly;
    modifiedAt  @readonly;
    modifiedBy  @readonly;
    divisionCd  @title : '{i18n>divisionCd}';
    effectiveDt @title : '{i18n>effectiveDt}';
    discPct     @title : '{i18n>discPct}';
};
