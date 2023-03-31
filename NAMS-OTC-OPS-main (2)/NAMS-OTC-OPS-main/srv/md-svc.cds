using {md} from '../db/md';

service MDMaintService {
    @odata.draft.enabled : true
    entity CostModels @(restrict : [
        {
            grant : 'READ',
            to    : 'MDCostModels_READ',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'MDCostModels_WRITE',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ])                   as projection on md.CostModels;

    entity DefaultDiscount @(restrict : [
        {
            grant : 'READ',
            to    : 'MDDefaultDiscount_READ',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'MDDefaultDiscount_WRITE',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ])                   as projection on md.DefaultDiscount;

    @odata.draft.enabled : true
    entity SpecialRanges @(restrict : [
        {
            grant : 'READ',
            to    : 'MDSpecialRanges_READ',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'MDSpecialRanges_WRITE',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ])                   as projection on md.SpecialRanges;

    @odata.draft.enabled : true
    entity MarketingFees @(restrict : [
        {
            grant : 'READ',
            to    : 'MDMarketingFees_READ',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'MDMarketingFees_WRITE',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ])                   as projection on md.MarketingFees;

    @odata.draft.enabled : true
    entity Reserves @(restrict : [
        {
            grant : 'READ',
            to    : 'MDReserves_READ',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'MDReserves_WRITE',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ])                   as projection on md.Reserves;

}
