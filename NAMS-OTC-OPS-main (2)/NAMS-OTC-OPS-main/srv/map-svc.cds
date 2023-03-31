using {map} from '../db/map';

service MapService {

    @odata.draft.enabled : true
    entity Divisions @(restrict : [
        {
            grant : 'READ',
            to    : 'MapDivisions_READ',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'MapDivisions_WRITE',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ])             as projection on map.Divisions;

    @odata.draft.enabled : true
    entity SalesDocTypes @(restrict : [
        {
            grant : 'READ',
            to    : 'MapSalesDocTypes_READ',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'MapSalesDocTypes_WRITE',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ])             as projection on map.SalesDocTypes;

    @odata.draft.enabled : true
    entity Plants @(restrict : [
        {
            grant : 'READ',
            to    : 'MapPlants_READ',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'MapPlants_WRITE',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ])             as projection on map.Plants;

    @odata.draft.enabled : true
    entity BaseModel @(restrict : [
        {
            grant : 'READ',
            to    : 'MapBaseModel_READ',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'MapBaseModel_WRITE',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ])             as projection on map.BaseModel;

}
