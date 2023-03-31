/* checksum : 64e0843dd9988dbb7c261efd30de53ea */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.supported.formats : 'atom json xlsx'
service ZC_OPSRECON_CDS {};

@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'OPS Recon Snapshot'
entity ZC_OPSRECON_CDS.ZC_OPSRecon {
  @sap.display.format : 'UpperCase'
  key SalesOrder : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Item'
  @sap.quickinfo : 'Sales Order Item'
  key SalesOrderItem : String(6);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Blocked'
  @sap.quickinfo : 'Yes / No'
  Blocked : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chassis'
  @sap.quickinfo : 'Material Number'
  Chassis : String(40);
  @sap.unit : 'DocumentCurrency'
  @sap.label : 'Chassis Net Value'
  @sap.quickinfo : 'Net Value of the Order Item in Document Currency'
  ChassisNetPrice : Decimal(16, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Division'
  Division : String(2);
  @sap.label : 'Document Currency'
  @sap.quickinfo : 'SD document currency'
  @sap.semantics : 'currency-code'
  DocumentCurrency : String(5);
  @sap.label : 'DTPO Number'
  @sap.quickinfo : 'Customer Reference'
  DTPONumber : String(35);
  @sap.display.format : 'UpperCase'
  EndingChassis : String(6);
  @sap.label : 'Exchng. Rate Accntg.'
  @sap.quickinfo : 'Exchange rate for FI postings'
  ExchangeRateAmt : Decimal(9, 5);
  @sap.display.format : 'Date'
  @sap.label : 'Firm Schedule Date'
  @sap.quickinfo : 'Lower Boundary for Date-Interval'
  FirmScheduleDate : Date;
  @sap.unit : 'GlobalCurrency'
  @sap.label : 'Delivery Revenue'
  @sap.quickinfo : 'Rate (Amount or Percentage)'
  Freight : Decimal(24, 9);
  @sap.label : 'Global Currency'
  @sap.semantics : 'currency-code'
  GlobalCurrency : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Open Order'
  @sap.quickinfo : 'Yes / No'
  OpenOrder : String(1);
  @sap.display.format : 'UpperCase'
  OPSChassisNo : String(6);
  @sap.display.format : 'UpperCase'
  OPSProcessingStatus : String(12);
  @sap.display.format : 'Date'
  @sap.label : 'Order Add Date'
  @sap.quickinfo : 'Customer Reference Date'
  OrderAddDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  @sap.quickinfo : 'Plant (Own or External)'
  Plant : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Reason for Rejection'
  @sap.quickinfo : 'Reason for Rejection of Sales Documents'
  RejectionReason : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Organization'
  SalesOrganization : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sold-To Party'
  SoldTo : String(10);
  @sap.display.format : 'UpperCase'
  StartingChassis : String(6);
  @sap.unit : 'DocumentCurrency'
  @sap.label : 'Tax Amount'
  @sap.quickinfo : 'Tax amount in document currency'
  TaxAmount : Decimal(14, 3);
  @sap.display.format : 'Date'
  @sap.label : 'Tentative Schedule Date'
  @sap.quickinfo : 'Lower Boundary for Date-Interval'
  TentativeScheduleDate : Date;
};

