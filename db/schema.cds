namespace CapitalExpenditures;

using
{
    Country,
    Currency,
    Language,
    User,
    cuid,
    extensible,
    managed,
    temporal
}
from '@sap/cds/common';

entity Capex
{
    key ID : UUID
        @Core.Computed;
    description : String;
    total_cost : Integer;
    contractor : Association to one Contractors;
}

entity Contractors
{
    key contractor : Integer;
    name : String;
}
