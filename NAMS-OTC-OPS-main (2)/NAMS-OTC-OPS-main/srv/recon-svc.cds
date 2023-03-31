using {recon} from '../db/recon';

service ReconService @(requires : [
    'Admin',
    'system-user'
]) {
    entity RemoteSnapshot as projection on recon.RemoteSnapshot;
    entity S4Snapshot     as projection on recon.S4Snapshot;
}
