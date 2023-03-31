namespace chassis.msg;

using {
    cuid,
    managed
} from '@sap/cds/common';
using {bapi} from './bapi';
using {order.msg as ordermsg} from './order-msg';

@cds.persistence.journal
entity Chassis : cuid, managed {
    // Fields that come directly from the UpdateNAMSChassis/NAMSSalesInfo message from OPS/Biztalk/Apigee/CPI
    action                 : String(6);
    divisionCd             : String(1);
    chassisNo              : ordermsg.ChassisNo;
    orderType              : String(1);
    plantCd                : String(1);
    startingChassis        : ordermsg.ChassisNo;
    endingChassis          : ordermsg.ChassisNo;
    fleetQty               : Integer;
    statusCode             : String(4);
    DTPOControlNumber      : String(8);
    chassisAddDt           : Date;
    changeOrderNo          : Integer;
    engineSerialNo         : String(9);
    vehicleActualWeight    : Decimal(10, 3);
    createTimestamp        : Timestamp;
    invoiceQueueDt         : Date;
    // Extra columns filled by CPI using the updateStatus action to record BAPI processing results
    orderSaved             : Boolean default false;
    timesProcessed         : Integer default 0;
    returns                : bapi.returns;

    // Associations
    to_Order               : Association to Order
                                 on to_Order.ID = $self.ID;
}

// Link a Chassis to its order (and chassis) to get sales order and item
view Order as
    select from Chassis
    inner join ordermsg.MaxIdByChassis
        on  MaxIdByChassis.divisionCd = Chassis.divisionCd
        and MaxIdByChassis.chassisNo  = Chassis.chassisNo
        and MaxIdByChassis.DTPONumber = Chassis.DTPOControlNumber
    inner join ordermsg.Orders as Orders
        on Orders.ID = MaxIdByChassis.order_ID
    inner join ordermsg.Chassis as OrderChassis
        on  OrderChassis.order.ID  = MaxIdByChassis.order_ID
        and OrderChassis.chassisNo = Chassis.chassisNo
    {
        Chassis.ID,
        Orders.salesOrder,
        OrderChassis.salesOrderItem
    };
