using {CV_OPS_RECON} from '../db/recon';

service ReconViewerService {
    @readonly
    entity OPSRecon @(restrict : [
        {
            grant : 'READ',
            to    : 'OPSRecon_READ',
            where : 'division = $user.S4Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ]) as select * from CV_OPS_RECON;
}