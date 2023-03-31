/* checksum : 09700a208573d83133a5718be2ce1970 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.supported.formats : 'atom json xlsx'
service ZC_CHASSISLIST_CDS {};

@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Chassis List'
entity ZC_CHASSISLIST_CDS.ZC_ChassisList {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Order'
  key SalesOrder : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Item'
  @sap.quickinfo : 'Sales Order Item'
  key SalesOrderItem : String(6);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Billing Status'
  @sap.quickinfo : 'Billing Status for Order-Related Billing Documents'
  BillingStatus : String(1);
  @sap.display.format : 'Date'
  @sap.label : 'Cancellation Date'
  @sap.quickinfo : 'Last Customer Contact Date'
  CancellationDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chassis'
  @sap.quickinfo : 'Material Number'
  Chassis : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Distribution Channel'
  DistributionChannel : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Division'
  Division : String(2);
  @sap.label : 'Document Currency'
  @sap.quickinfo : 'SD document currency'
  @sap.semantics : 'currency-code'
  DocumentCurrency : String(5);
  @sap.label : 'DTPO Number'
  @sap.quickinfo : 'Customer Reference'
  DTPONumber : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Invoice'
  Invoice : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Invoice Cancelled'
  @sap.quickinfo : 'Billing document is canceled'
  InvoiceCancelled : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Reason for Rejection'
  @sap.quickinfo : 'Reason for Rejection of Sales Documents'
  Rejected : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Reversed'
  @sap.quickinfo : 'Line Item Reversed'
  Reversed : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Organization'
  SalesOrganization : String(4);
  @odata.Type : 'Edm.Byte'
  @sap.label : 'Counter'
  Counter : Integer;
  @sap.unit : 'DocumentCurrency'
  @sap.label : 'Net Value'
  @sap.quickinfo : 'Net Value of the Order Item in Document Currency'
  NetValue : Decimal(16, 3);
};

