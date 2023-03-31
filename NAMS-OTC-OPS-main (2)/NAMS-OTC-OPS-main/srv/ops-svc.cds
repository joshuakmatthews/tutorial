using {chassis} from '../db/chassis';
using {md} from '../db/md';
using {ops} from '../db/ops';
using {order.msg as msg} from '../db/order-msg';
using {recon} from '../db/recon';
using {bapi} from '../db/bapi';

service ManageService {

    entity ChassisFilesCSV @(requires : [
        'Admin',
        'system-user'
    ]) as projection on chassis.CSVFiles actions {
        @(restrict : [{to : [
            'Admin',
            'system-user'
        ]}])
        action process() returns Boolean;
    };

    entity ChassisFiles @(restrict : [
        {
            grant : 'READ',
            to    : 'Reader',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'Writer',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ]) as projection on chassis.Files {
        *,
        @readonly Order.salesOrder,
        @readonly Order.salesOrderItem,
        @readonly Order.salesOrg,
        @readonly Order.startingChassis,
        @readonly Order.endingChassis,
        @readonly Division.spart as division
    };

    entity ChassisFilesArchive @(requires : [
        'Admin',
        'system-user'
    ]) as projection on chassis.FilesArchive;

    entity MsgOrders @(restrict : [
        {
            grant : 'READ',
            to    : 'Reader',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'Writer',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ]) as projection on msg.Orders actions {
        @(restrict : [{to : [
            'Writer',
            'Admin',
            'system-user'
        ]}])
        action markSaved(divisionCd : String(1), orderSaved : Boolean, salesOrder : String(10), salesOrg : String(4), timesProcessed : Integer) returns Boolean;
    };

    //Composed entities (Orders contains Compositions of Options in ../db/data-model.cds) are auto-exposed but we need to extend this with fields from OrderOptions
    entity MsgOptions @(restrict : [
        {
            grant : 'READ',
            to    : 'Reader',
            where : 'order.divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'Writer',
            where : 'order.divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ]) as projection on msg.Options {
        *,
        @readonly Option.OPSLine1Description,
        @readonly Option.OPSLine2Description
    };

    entity MsgSplits @(restrict : [
        {
            grant : 'READ',
            to    : 'Reader',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'Writer',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ]) as projection on msg.Splits;

    entity MDOptionsRanges @(restrict : [
        {
            grant : 'READ',
            to    : 'Reader',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'Writer',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ]) as projection on md.OptionsRanges;

    entity MDFreight @(restrict : [
        {
            grant : 'READ',
            to    : 'Reader',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'Writer',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ]) as projection on md.Freight;

    entity MDModelDiscount @(restrict : [
        {
            grant : 'READ',
            to    : 'Reader',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'Writer',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ]) as projection on md.ModelDiscount;

    entity ReconFilesCSV @(requires : [
        'Admin',
        'system-user'
    ]) as projection on recon.CSVFiles actions {
        @(restrict : [{to : [
            'Admin',
            'system-user'
        ]}])
        action process() returns Boolean;
    };

    entity ReconFiles @(restrict : [
        {
            grant : 'READ',
            to    : 'Reader',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'Writer',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ]) as projection on recon.Files {
        *
    };

    entity PromoCodes @(restrict : [
        {
            grant : 'READ',
            to    : 'Reader',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : 'Writer',
            where : 'divisionCd = $user.Division'
        },
        {
            grant : '*',
            to    : [
                'Admin',
                'system-user'
            ]
        }
    ]) as projection on ops.PromoCodes;

    action truncateChassisFiles @(requires : [
        'Admin',
        'system-user'
    ])(divisionCd : String(1))                            returns Boolean;

    action archiveChassisFiles @(requires : [
        'Admin',
        'system-user'
    ])(divisionCd : String(1), versionsToKeep : Integer)  returns Boolean;

    action prepareChassisParallel @(requires : [
        'Admin',
        'system-user'
    ])(divisionCd : String(1), numberOfThreads : Integer) returns Boolean;

    action getNextChassisPacket @(requires : [
        'Admin',
        'system-user'
    ])(divisionCd : String(1), threadNo : Integer)        returns many ChassisFiles;

    action getOldestChassisError @(requires : [
        'Admin',
        'system-user'
    ])(divisionCd : String(1))                            returns many ChassisFiles;

    action updateChassisFiles @(requires : [
        'Admin',
        'system-user'
    ])(chassisFiles : many ChassisFiles)                  returns Boolean;

    action truncateRecon @(requires : [
        'Admin',
        'system-user'
    ])(divisionCd : String(1))                            returns Boolean;

    action truncateFreight @(requires : [
        'Admin',
        'system-user'
    ])(divisionCd : String(1))                            returns Boolean;

    action truncatePromoCodes @(requires : [
        'Admin',
        'system-user'
    ])(divisionCd : String(1))                            returns Boolean;

    action setCurrent @(requires : [
        'Admin',
        'system-user'
    ])(orderIds : array of UUID, newerMessageId : UUID, current : Boolean)   returns Boolean;

};
