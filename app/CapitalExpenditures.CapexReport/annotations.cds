using CapitalExpendituresService as service from '../../srv/service';

annotate service.Capex with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Description',
            Value : description,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Total Cost',
            Value : total_cost,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Contractor ID',
            Value : contractors_contractor,
        },
        {
            $Type : 'UI.DataField',
            Value : contractors.name,
            Label : 'Name',
        },
    ]
);
annotate service.Capex with @(
    UI.FieldGroup #GeneratedGroup1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Description',
                Value : description,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Total Cost',
                Value : total_cost,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup1',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Contractors',
            ID : 'Contractors',
            Target : '@UI.FieldGroup#Contractors',
        },
    ]
);
annotate service.Capex with @(
    UI.FieldGroup #Contractors : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : contractors_contractor,
                Label : 'Contractor ID',
            },
            {
                $Type : 'UI.DataField',
                Value : contractors.contractor,
                Label : 'Contractor Name',
            },],
    }
);
annotate service.Capex with @(
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : description,
        },
        TypeName : '',
        TypeNamePlural : '',
    }
);

annotate service.Capex with {
    contractors @Common.Text : {
            $value : contractors.name,
            ![@UI.TextArrangement] : #TextSeparate,
        }
};
annotate service.Contractors with {
    contractor @Common.Text : {
            $value : name,
            ![@UI.TextArrangement] : #TextOnly,
        }
};
annotate service.Contractors with {
    contractor @Common.FieldControl : #Mandatory
};
annotate service.Contractors with {
    name @Common.FieldControl : #Mandatory
};
annotate service.Capex with {
    contractors @Common.FieldControl : #Mandatory
};
annotate service.Capex with {
    total_cost @Common.FieldControl : #Mandatory
};
annotate service.Capex with {
    description @Common.FieldControl : #Mandatory
};
annotate service.Contractors with {
    contractor @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Contractors',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : contractor,
                    ValueListProperty : 'contractor',
                },
            ],
        },
        Common.ValueListWithFixedValues : true
)};
