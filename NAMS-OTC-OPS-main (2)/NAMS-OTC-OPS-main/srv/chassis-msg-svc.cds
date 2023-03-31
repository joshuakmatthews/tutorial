using {bapi} from '../db/bapi';
using {chassis.msg as chassismsg} from '../db/chassis-msg';

service ChassisMsgService {
    entity Messages @(restrict : [
        {
            grant : 'READ',
            to    : 'ChassisMessages_READ',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'ChassisMessages_WRITE',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ]) as projection on chassismsg.Chassis {
        *,
        @readonly to_Order.salesOrder,
        @readonly to_Order.salesOrderItem
    } actions {
        action updateStatus(orderSaved : Boolean, timesProcessed : Integer, returns : bapi.returns);
    };
}
