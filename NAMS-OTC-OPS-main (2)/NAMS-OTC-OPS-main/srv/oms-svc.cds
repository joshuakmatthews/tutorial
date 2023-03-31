using {oms} from '../db/oms';

service OMSService {
    @readonly
    entity SalesOption @(restrict : [
        {
            grant : 'READ',
            to    : 'Reader',
            where : 'DIVISION_CODE = $user.Division'
        },
        {
            grant : 'READ',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ]) as projection on oms.CV_DIM_SALES_OPTION;
}
