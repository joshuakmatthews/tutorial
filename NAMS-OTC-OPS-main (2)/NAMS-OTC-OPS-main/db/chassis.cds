namespace chassis;

using {
    cuid,
    managed
} from '@sap/cds/common';
using {order.msg as ordermsg} from './order-msg';
using {bapi} from './bapi';
using {map} from './map';

entity CSVFiles : managed {
    key filename    : String;
        isProcessed : Boolean default false;
        contentType : String       @Core.IsMediaType;
        csv         : LargeString  @Core.MediaType : contentType  @Core.ContentDisposition.Filename : filename;
}

@cds.persistence.journal
entity Files : cuid, managed {
    //  Message processing fields
    materialSaved     : Boolean default false;
    timesProcessed    : Integer default 0;
    divisionCd        : String(1);
    chassisNo         : ordermsg.ChassisNo;
    vinMfgCd          : String(3);
    vinModelCd        : String(1);
    vinAxleCd         : String(1);
    vinEngineCd       : String(1);
    vinGVWRCd         : String(1);
    vinUnuseCd        : String(1);
    vinCheckDigitCd   : String(1);
    vinYrCd           : String(1);
    pltCd             : String(1);
    engineSerNo       : String(9);
    vehActlWgt        : Decimal(10, 3);
    DTPONumber        : String(8);
    orderAddDt        : Date;
    tentSchedDt       : Date;
    firmSchedDt       : Date;
    frameSchedDt      : Date;
    cabSchedDt        : Date;
    actlDlvryDt       : Date;
    reqDelDt          : Date;
    frameLnSeqNo      : String(7);
    cabLnSeqNo        : String(7);
    opsStatus         : String(4);
    chsStatus         : String(2);
    destBusName       : String(45);
    destCntctName     : String(45);
    destAddrLn1       : String(45);
    destAddrLn2       : String(45);
    destCity          : String(20);
    destSt            : String(3);
    destZipCd         : String(10);
    destCntctPhoneNo  : String(21);
    destCntry         : String(50);
    preBillDt         : Date;
    streamNo          : Integer;
    lineNo            : Integer;
    salesOrderSaved   : Boolean default false;
    archiveVersion    : Integer;
    isDelta           : Boolean default true;
    businessError     : Boolean default false;
    materialReturn    : bapi.return;
    salesOrderReturns : bapi.returns;

    // Associations
    Division          : Association to map.Divisions
                            on Division.divisionCd = $self.divisionCd;
    Order             : Association to Orders
                            on Order.ID = $self.ID;
};

entity FilesArchive : Files {};

view Orders as
    select from Files
    inner join ordermsg.MaxIdByChassis
        on  MaxIdByChassis.divisionCd = Files.divisionCd
        and MaxIdByChassis.chassisNo  = Files.chassisNo
        and MaxIdByChassis.DTPONumber = Files.DTPONumber
    inner join ordermsg.Orders as Orders
        on Orders.ID = MaxIdByChassis.order_ID
    inner join ordermsg.Chassis as Chassis
        on  Chassis.order.ID  = MaxIdByChassis.order_ID
        and Chassis.chassisNo = Files.chassisNo
    {
        Files.ID,
        Orders.salesOrder,
        Chassis.salesOrderItem,
        Orders.salesOrg,
        Orders.startingChassis,
        Orders.endingChassis
    };
