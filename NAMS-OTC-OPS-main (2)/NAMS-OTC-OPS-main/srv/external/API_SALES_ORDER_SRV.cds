/* checksum : 91e75cd7d5c9f84359acffb196ace241 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.supported.formats : 'atom json xlsx'
service API_SALES_ORDER_SRV {};

type API_SALES_ORDER_SRV.ApprovalType {
  @sap.label : 'Approved By'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  ApprovedBy : String(12);
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 0
  @sap.label : 'Approved At'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  ApprovedAt : DateTime;
  @sap.label : 'Billing Block'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  HeaderBillingBlockReason : String(2);
};

@cds.persistence.skip : true
@sap.content.version : '1'
@sap.label : 'Sales Order (API)'
entity API_SALES_ORDER_SRV.A_SalesOrder {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Order'
  key SalesOrder : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales document type'
  @sap.quickinfo : 'Sales Document Type'
  SalesOrderType : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Organization'
  SalesOrganization : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Distribution Channel'
  DistributionChannel : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Division'
  OrganizationDivision : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales group'
  SalesGroup : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales office'
  SalesOffice : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales District'
  SalesDistrict : String(6);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sold-To Party'
  SoldToParty : String(10);
  @sap.display.format : 'Date'
  @sap.label : 'Created on'
  @sap.quickinfo : 'Date on which the record was created'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CreationDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Created by'
  @sap.quickinfo : 'Name of Person who Created the Object'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CreatedByUser : String(12);
  @sap.display.format : 'Date'
  @sap.label : 'Changed On'
  @sap.quickinfo : 'Date of Last Change'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  LastChangeDate : Date;
  @odata.Type : 'Edm.DateTimeOffset'
  @odata.Precision : 7
  @sap.label : 'Time Stamp'
  @sap.quickinfo : 'UTC Time Stamp in Long Form (YYYYMMDDhhmmssmmmuuun)'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  LastChangeDateTime : Timestamp;
  @sap.label : 'Customer Reference'
  PurchaseOrderByCustomer : String(35);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purchase Order Type'
  @sap.quickinfo : 'Customer Purchase Order Type'
  CustomerPurchaseOrderType : String(4);
  @sap.display.format : 'Date'
  @sap.label : 'Customer Ref. Date'
  @sap.quickinfo : 'Customer Reference Date'
  CustomerPurchaseOrderDate : Date;
  @sap.display.format : 'Date'
  @sap.label : 'Document Date'
  @sap.quickinfo : 'Document Date (Date Received/Sent)'
  SalesOrderDate : Date;
  @sap.unit : 'TransactionCurrency'
  @sap.label : 'Net Value'
  @sap.quickinfo : 'Net Value of the Sales Order in Document Currency'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  TotalNetAmount : Decimal(16, 3);
  @sap.label : 'Document Currency'
  @sap.quickinfo : 'SD document currency'
  @sap.semantics : 'currency-code'
  TransactionCurrency : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Order Reason'
  @sap.quickinfo : 'Order Reason (Reason for the Business Transaction)'
  SDDocumentReason : String(3);
  @sap.display.format : 'Date'
  @sap.label : 'Pricing Date'
  @sap.quickinfo : 'Date for pricing and exchange rate'
  PricingDate : Date;
  @sap.display.format : 'Date'
  @sap.label : 'Reqd Delivery Date'
  @sap.quickinfo : 'Requested Delivery Date'
  RequestedDeliveryDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Shipping Conditions'
  ShippingCondition : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Complete Delivery'
  @sap.quickinfo : 'Complete Delivery Defined for Each Sales Order?'
  CompleteDeliveryIsDefined : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Shipping Type'
  ShippingType : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Billing Block'
  @sap.quickinfo : 'Billing Block in SD Document'
  HeaderBillingBlockReason : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Delivery Block'
  @sap.quickinfo : 'Delivery Block (Document Header)'
  DeliveryBlockReason : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Incoterms'
  @sap.quickinfo : 'Incoterms (Part 1)'
  IncotermsClassification : String(3);
  @sap.label : 'Incoterms (Part 2)'
  IncotermsTransferLocation : String(28);
  @sap.label : 'Incoterms Location 1'
  IncotermsLocation1 : String(70);
  @sap.label : 'Incoterms Location 2'
  IncotermsLocation2 : String(70);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Incoterms Version'
  IncotermsVersion : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Payment terms'
  @sap.quickinfo : 'Terms of payment key'
  CustomerPaymentTerms : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Payment Method'
  PaymentMethod : String(1);
  @sap.label : 'Assignment'
  @sap.quickinfo : 'Assignment number'
  AssignmentReference : String(18);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Reference document'
  @sap.quickinfo : 'Document number of the reference document'
  ReferenceSDDocument : String(10);
  @sap.label : 'Preceding Doc.Categ.'
  @sap.quickinfo : 'Document Category of Preceding SD Document'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ReferenceSDDocumentCategory : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Overall Status'
  @sap.quickinfo : 'Overall Processing Status of Document'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  OverallSDProcessStatus : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Credit Status'
  @sap.quickinfo : 'Overall Status of Credit Checks'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  TotalCreditCheckStatus : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Ovrl Delivery Status'
  @sap.quickinfo : 'Overall Delivery Status for all Items'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  OverallTotalDeliveryStatus : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Rejection Status'
  @sap.quickinfo : 'Overall Rejection Status of All Document Items'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  OverallSDDocumentRejectionSts : String(1);
  @sap.label : 'Name'
  @sap.quickinfo : 'Name of orderer'
  EndCustomer : String(35);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Overall Block Status'
  @sap.quickinfo : 'Overall Billing Block Status'
  BillingBlockStatus : String(1);
  @sap.display.format : 'UpperCase'
  FormatedOrderNo : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Customer'
  @sap.quickinfo : 'Customer Number'
  DealerOwnerGroup : String(10);
  @sap.display.format : 'Date'
  @sap.label : 'Date'
  @sap.quickinfo : 'Field of type DATS'
  TentativeSchedDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purchase Order Type'
  @sap.quickinfo : 'Customer Purchase Order Type'
  PurchaseOrderType : String(4);
  TotalNetAmountRound : Integer;
  @sap.label : 'Your Reference'
  @sap.quickinfo : 'Ship-To Party Character'
  OPSProcessingStatus : String(12);
  @sap.display.format : 'Date'
  @sap.label : 'Last Contact Date'
  @sap.quickinfo : 'Last Customer Contact Date'
  CancellationDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Bill.stat.order-rel.'
  @sap.quickinfo : 'Billing status (order-related billing document)'
  OverallOrdReltdBillgStatus : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Yes / No'
  OpenOrder : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Yes / No'
  Blocked : String(1);
  @sap.label : 'Approved By'
  ZZ1_APPROVEDBY_SDH : String(12);
  @odata.Type : 'Edm.DateTimeOffset'
  @odata.Precision : 7
  @sap.label : 'Approved At'
  ZZ1_ApprovedAt_SDH : Timestamp;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Forward to Person'
  @sap.quickinfo : 'Forward To person'
  ZZ1_FORWARDTO : String(12);
  @sap.label : 'Approval Comment'
  ZZ1_APPROVALCOMMENT_SDH : String(255);
  @sap.label : 'Forwarding Comment'
  ZZ1_APPRFRWCOMMENT_SDH : String(255);
  @cds.ambiguous : 'missing on condition?'
  to_Item : Association to many API_SALES_ORDER_SRV.A_SalesOrderItem {  };
  @cds.ambiguous : 'missing on condition?'
  to_Partner : Association to many API_SALES_ORDER_SRV.A_SalesOrderHeaderPartner {  };
  @cds.ambiguous : 'missing on condition?'
  to_PricingElement : Association to many API_SALES_ORDER_SRV.A_SalesOrderHeaderPrElement {  };
} actions {
  action ZFN_Approve(
    ApprovalComment : String(255)
  ) returns API_SALES_ORDER_SRV.ApprovalType;
};

@cds.persistence.skip : true
@sap.content.version : '1'
@sap.label : 'Sales Order Header Partner (API)'
entity API_SALES_ORDER_SRV.A_SalesOrderHeaderPartner {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Order'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key SalesOrder : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Partner Function'
  key PartnerFunction : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Customer'
  @sap.quickinfo : 'Customer Number'
  Customer : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Account Number of Vendor or Creditor'
  Supplier : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Personnel Number'
  Personnel : String(8);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Contact Person'
  @sap.quickinfo : 'Number of contact person'
  ContactPerson : String(10);
  @cds.ambiguous : 'missing on condition?'
  to_SalesOrder : Association to API_SALES_ORDER_SRV.A_SalesOrder {  };
};

@cds.persistence.skip : true
@sap.content.version : '1'
@sap.label : 'Sales Order Header Pricing Element (API)'
entity API_SALES_ORDER_SRV.A_SalesOrderHeaderPrElement {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Order'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key SalesOrder : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Step Number'
  key PricingProcedureStep : String(3);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Counter'
  @sap.quickinfo : 'Condition Counter'
  key PricingProcedureCounter : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Condition type'
  ConditionType : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Valid From'
  @sap.quickinfo : 'Timestamp for Pricing'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  PricingDateTime : String(14);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Calculation Type'
  @sap.quickinfo : 'Calculation Type for Condition'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionCalculationType : String(3);
  @sap.label : 'Basis Value'
  @sap.quickinfo : 'Condition Basis Value'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionBaseValue : Decimal(24, 9);
  @sap.label : 'Amount'
  @sap.quickinfo : 'Rate (Amount or Percentage)'
  ConditionRateValue : Decimal(24, 9);
  @sap.label : 'Currency'
  @sap.quickinfo : 'Currency Key'
  @sap.semantics : 'currency-code'
  ConditionCurrency : String(5);
  @sap.label : 'Pricing Unit'
  @sap.quickinfo : 'Condition Pricing Unit'
  ConditionQuantity : Decimal(5, 0);
  @sap.label : 'Condition Unit'
  @sap.quickinfo : 'Condition Unit in the Document'
  @sap.semantics : 'unit-of-measure'
  ConditionQuantityUnit : String(3);
  @sap.label : 'Condition Category'
  @sap.quickinfo : 'Condition Category (Examples: Tax, Freight, Price, Cost)'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionCategory : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Statistical'
  @sap.quickinfo : 'Condition is used for statistics'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionIsForStatistics : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Scale Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  PricingScaleType : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Condition Origin'
  @sap.quickinfo : 'Origin of the Condition'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionOrigin : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Group Condition'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  IsGroupCondition : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Condition Record No.'
  @sap.quickinfo : 'Condition record number'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionRecord : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Sequent.No. of Cond.'
  @sap.quickinfo : 'Sequential Number of the Condition'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionSequentialNumber : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Code'
  @sap.quickinfo : 'Tax on sales/purchases code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  TaxCode : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'W/Tax Code'
  @sap.quickinfo : 'Withholding Tax Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  WithholdingTaxCode : String(2);
  @sap.unit : 'TransactionCurrency'
  @sap.label : 'Cond.Rounding Diff.'
  @sap.quickinfo : 'Rounding-Off Difference of the Condition'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CndnRoundingOffDiffAmount : Decimal(6, 3);
  @sap.unit : 'TransactionCurrency'
  @sap.label : 'Value'
  @sap.quickinfo : 'Condition Value'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionAmount : Decimal(16, 3);
  @sap.label : 'Document Currency'
  @sap.quickinfo : 'SD document currency'
  @sap.semantics : 'currency-code'
  TransactionCurrency : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Condition Control'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionControl : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Inactive Condition'
  @sap.quickinfo : 'Condition is Inactive'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionInactiveReason : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Condition Class'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionClass : String(1);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Counter'
  @sap.quickinfo : 'Condition Counter (Header)'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  PrcgProcedureCounterForHeader : String(3);
  @sap.label : 'Condition Factor'
  @sap.quickinfo : 'Factor for Condition Base Value'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  FactorForConditionBasisValue : Double;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Structure Condition'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  StructureCondition : String(1);
  @sap.label : 'Condition Factor'
  @sap.quickinfo : 'Factor for Condition Basis (Period)'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  PeriodFactorForCndnBasisValue : Double;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Scale Basis'
  @sap.quickinfo : 'Scale Basis Indicator'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  PricingScaleBasis : String(3);
  @sap.label : 'Scale Basis Value'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionScaleBasisValue : Decimal(24, 9);
  @sap.label : 'Scale Unit of Meas.'
  @sap.quickinfo : 'Condition Scale Unit of Measure'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.semantics : 'unit-of-measure'
  ConditionScaleBasisUnit : String(3);
  @sap.label : 'Scale Currency'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.semantics : 'currency-code'
  ConditionScaleBasisCurrency : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Intercomp.Billing'
  @sap.quickinfo : 'Condition for Intercompany Billing'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CndnIsRelevantForIntcoBilling : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Changed Manually'
  @sap.quickinfo : 'Condition Changed Manually'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionIsManuallyChanged : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Variant Condition'
  @sap.quickinfo : 'Condition for Configuration'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionIsForConfiguration : Boolean;
  @sap.label : 'Variant'
  @sap.quickinfo : 'Variant condition'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  VariantCondition : String(26);
  @cds.ambiguous : 'missing on condition?'
  to_SalesOrder : Association to API_SALES_ORDER_SRV.A_SalesOrder {  };
};

@cds.persistence.skip : true
@sap.content.version : '1'
@sap.label : 'Sales Order Item (API)'
entity API_SALES_ORDER_SRV.A_SalesOrderItem {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Order'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key SalesOrder : String(10);
  @sap.display.format : 'NonNegative'
  @sap.text : 'SalesOrderItemText'
  @sap.label : 'Item'
  @sap.quickinfo : 'Sales Order Item'
  key SalesOrderItem : String(6);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Higher-Level Item'
  @sap.quickinfo : 'Higher-Level item in bill of material structures'
  HigherLevelItem : String(6);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Item category'
  @sap.quickinfo : 'Sales document item category'
  SalesOrderItemCategory : String(4);
  @sap.label : 'Item Description'
  @sap.quickinfo : 'Short text for sales order item'
  SalesOrderItemText : String(40);
  @sap.label : 'Customer Reference'
  PurchaseOrderByCustomer : String(35);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  Material : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Customer Material'
  @sap.quickinfo : 'Material Number Used by Customer'
  MaterialByCustomer : String(35);
  @sap.display.format : 'Date'
  @sap.label : 'Pricing Date'
  @sap.quickinfo : 'Date for pricing and exchange rate'
  PricingDate : Date;
  @sap.unit : 'RequestedQuantityUnit'
  @sap.label : 'Requested Quantity'
  RequestedQuantity : Decimal(15, 3);
  @sap.label : 'Requested Qty Unit'
  @sap.quickinfo : 'Requested Quantity Unit'
  @sap.semantics : 'unit-of-measure'
  RequestedQuantityUnit : String(3);
  @sap.unit : 'ItemWeightUnit'
  @sap.label : 'Gross Weight'
  @sap.quickinfo : 'Gross Weight of the Item'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ItemGrossWeight : Decimal(15, 3);
  @sap.unit : 'ItemWeightUnit'
  @sap.label : 'Net Weight'
  @sap.quickinfo : 'Net Weight of the Item'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ItemNetWeight : Decimal(15, 3);
  @sap.label : 'Weight unit'
  @sap.quickinfo : 'Weight Unit'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.semantics : 'unit-of-measure'
  ItemWeightUnit : String(3);
  @sap.unit : 'ItemVolumeUnit'
  @sap.label : 'Volume'
  @sap.quickinfo : 'Volume of the item'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ItemVolume : Decimal(15, 3);
  @sap.label : 'Volume unit'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.semantics : 'unit-of-measure'
  ItemVolumeUnit : String(3);
  @sap.label : 'Document Currency'
  @sap.quickinfo : 'SD document currency'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.semantics : 'currency-code'
  TransactionCurrency : String(5);
  @sap.unit : 'TransactionCurrency'
  @sap.label : 'Net Value'
  @sap.quickinfo : 'Net Value of the Order Item in Document Currency'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  NetAmount : Decimal(16, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material Group'
  MaterialGroup : String(9);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material Price Grp'
  @sap.quickinfo : 'Material Price Group'
  MaterialPricingGroup : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Batch'
  @sap.quickinfo : 'Batch Number'
  Batch : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  @sap.quickinfo : 'Plant (Own or External)'
  ProductionPlant : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Storage location'
  StorageLocation : String(4);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Delivery Group'
  @sap.quickinfo : 'Delivery Group (Items are delivered together)'
  DeliveryGroup : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Shipping Point'
  @sap.quickinfo : 'Shipping Point/Receiving Point'
  ShippingPoint : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Shipping Type'
  ShippingType : String(2);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Delivery Priority'
  DeliveryPriority : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Incoterms'
  @sap.quickinfo : 'Incoterms (Part 1)'
  IncotermsClassification : String(3);
  @sap.label : 'Incoterms (Part 2)'
  IncotermsTransferLocation : String(28);
  @sap.label : 'Incoterms Location 1'
  IncotermsLocation1 : String(70);
  @sap.label : 'Incoterms Location 2'
  IncotermsLocation2 : String(70);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Payment terms'
  @sap.quickinfo : 'Terms of payment key'
  CustomerPaymentTerms : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Reason for Rejection'
  @sap.quickinfo : 'Reason for Rejection of Sales Documents'
  SalesDocumentRjcnReason : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Billing Block'
  @sap.quickinfo : 'Billing Block for Item'
  ItemBillingBlockReason : String(2);
  @sap.display.format : 'NonNegative'
  @sap.label : 'WBS Element'
  @sap.quickinfo : 'Work Breakdown Structure Element (WBS Element)'
  WBSElement : String(24);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Reference document'
  @sap.quickinfo : 'Document number of the reference document'
  ReferenceSDDocument : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Reference Item'
  @sap.quickinfo : 'Item number of the reference item'
  ReferenceSDDocumentItem : String(6);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Overall Status'
  @sap.quickinfo : 'Overall Processing Status of the SD Document Item'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  SDProcessStatus : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Delivery Status'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  DeliveryStatus : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Billing Status'
  @sap.quickinfo : 'Billing Status for Order-Related Billing Documents'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  OrderRelatedBillingStatus : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Requirement Segment'
  RequirementSegment : String(40);
  @sap.label : 'Your Reference'
  @sap.quickinfo : 'Ship-To Party Character'
  OPSProcessingStatus : String(12);
  @sap.display.format : 'Date'
  @sap.label : 'Billing Date'
  BillingDocumentDate : Date;
  @sap.label : 'Status'
  @sap.quickinfo : 'Individual status of an object (short form)'
  UserStatusShortName : String(4);
  @cds.ambiguous : 'missing on condition?'
  to_Partner : Association to many API_SALES_ORDER_SRV.A_SalesOrderItemPartner {  };
  @cds.ambiguous : 'missing on condition?'
  to_PricingElement : Association to many API_SALES_ORDER_SRV.A_SalesOrderItemPrElement {  };
  @cds.ambiguous : 'missing on condition?'
  to_SalesOrder : Association to API_SALES_ORDER_SRV.A_SalesOrder {  };
  @cds.ambiguous : 'missing on condition?'
  to_ScheduleLine : Association to many API_SALES_ORDER_SRV.A_SalesOrderScheduleLine {  };
};

@cds.persistence.skip : true
@sap.content.version : '1'
@sap.label : 'Sales Order Item Partner (API)'
entity API_SALES_ORDER_SRV.A_SalesOrderItemPartner {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Order'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key SalesOrder : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Item'
  @sap.quickinfo : 'Sales Order Item'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key SalesOrderItem : String(6);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Partner Function'
  key PartnerFunction : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Customer'
  @sap.quickinfo : 'Customer Number'
  Customer : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Account Number of Vendor or Creditor'
  Supplier : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Personnel Number'
  Personnel : String(8);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Contact Person'
  @sap.quickinfo : 'Number of contact person'
  ContactPerson : String(10);
  @cds.ambiguous : 'missing on condition?'
  to_SalesOrder : Association to API_SALES_ORDER_SRV.A_SalesOrder {  };
  @cds.ambiguous : 'missing on condition?'
  to_SalesOrderItem : Association to API_SALES_ORDER_SRV.A_SalesOrderItem {  };
};

@cds.persistence.skip : true
@sap.content.version : '1'
@sap.label : 'Sales Order Item Pricing Element (API)'
entity API_SALES_ORDER_SRV.A_SalesOrderItemPrElement {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Order'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key SalesOrder : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Item'
  @sap.quickinfo : 'Sales Order Item'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key SalesOrderItem : String(6);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Step Number'
  key PricingProcedureStep : String(3);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Counter'
  @sap.quickinfo : 'Condition Counter'
  key PricingProcedureCounter : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Condition type'
  ConditionType : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Valid From'
  @sap.quickinfo : 'Timestamp for Pricing'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  PricingDateTime : String(14);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Calculation Type'
  @sap.quickinfo : 'Calculation Type for Condition'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionCalculationType : String(3);
  @sap.label : 'Basis Value'
  @sap.quickinfo : 'Condition Basis Value'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionBaseValue : Decimal(24, 9);
  @sap.label : 'Amount'
  @sap.quickinfo : 'Rate (Amount or Percentage)'
  ConditionRateValue : Decimal(24, 9);
  @sap.label : 'Currency'
  @sap.quickinfo : 'Currency Key'
  @sap.semantics : 'currency-code'
  ConditionCurrency : String(5);
  @sap.unit : 'ConditionQuantityUnit'
  @sap.label : 'Pricing Unit'
  @sap.quickinfo : 'Condition Pricing Unit'
  ConditionQuantity : Decimal(5, 0);
  @sap.label : 'Condition Unit'
  @sap.quickinfo : 'Condition Unit in the Document'
  @sap.semantics : 'unit-of-measure'
  ConditionQuantityUnit : String(3);
  @sap.label : 'Condition Category'
  @sap.quickinfo : 'Condition Category (Examples: Tax, Freight, Price, Cost)'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionCategory : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Statistical'
  @sap.quickinfo : 'Condition is used for statistics'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionIsForStatistics : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Scale Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  PricingScaleType : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Accruals'
  @sap.quickinfo : 'Condition is Relevant for Accrual (e.g. Freight)'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  IsRelevantForAccrual : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Invoice List Cond.'
  @sap.quickinfo : 'Condition for Invoice List'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CndnIsRelevantForInvoiceList : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Condition Origin'
  @sap.quickinfo : 'Origin of the Condition'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionOrigin : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Group Condition'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  IsGroupCondition : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Condition Record No.'
  @sap.quickinfo : 'Condition record number'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionRecord : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Sequent.No. of Cond.'
  @sap.quickinfo : 'Sequential Number of the Condition'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionSequentialNumber : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Code'
  @sap.quickinfo : 'Tax on sales/purchases code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  TaxCode : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'W/Tax Code'
  @sap.quickinfo : 'Withholding Tax Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  WithholdingTaxCode : String(2);
  @sap.label : 'Cond.Rounding Diff.'
  @sap.quickinfo : 'Rounding-Off Difference of the Condition'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CndnRoundingOffDiffAmount : Decimal(6, 3);
  @sap.unit : 'TransactionCurrency'
  @sap.label : 'Value'
  @sap.quickinfo : 'Condition Value'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionAmount : Decimal(16, 3);
  @sap.label : 'Document Currency'
  @sap.quickinfo : 'SD document currency'
  @sap.semantics : 'currency-code'
  TransactionCurrency : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Condition Control'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionControl : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Inactive Condition'
  @sap.quickinfo : 'Condition is Inactive'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionInactiveReason : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Condition Class'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionClass : String(1);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Counter'
  @sap.quickinfo : 'Condition Counter (Header)'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  PrcgProcedureCounterForHeader : String(3);
  @sap.label : 'Condition Factor'
  @sap.quickinfo : 'Factor for Condition Base Value'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  FactorForConditionBasisValue : Double;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Structure Condition'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  StructureCondition : String(1);
  @sap.label : 'Condition Factor'
  @sap.quickinfo : 'Factor for Condition Basis (Period)'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  PeriodFactorForCndnBasisValue : Double;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Scale Basis'
  @sap.quickinfo : 'Scale Basis Indicator'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  PricingScaleBasis : String(3);
  @sap.label : 'Scale Basis Value'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionScaleBasisValue : Decimal(24, 9);
  @sap.label : 'Scale Unit of Meas.'
  @sap.quickinfo : 'Condition Scale Unit of Measure'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.semantics : 'unit-of-measure'
  ConditionScaleBasisUnit : String(3);
  @sap.label : 'Scale Currency'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.semantics : 'currency-code'
  ConditionScaleBasisCurrency : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Intercomp.Billing'
  @sap.quickinfo : 'Condition for Intercompany Billing'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CndnIsRelevantForIntcoBilling : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Changed Manually'
  @sap.quickinfo : 'Condition Changed Manually'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionIsManuallyChanged : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Variant Condition'
  @sap.quickinfo : 'Condition for Configuration'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ConditionIsForConfiguration : Boolean;
  @sap.label : 'Variant'
  @sap.quickinfo : 'Variant condition'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  VariantCondition : String(26);
  @cds.ambiguous : 'missing on condition?'
  to_SalesOrder : Association to API_SALES_ORDER_SRV.A_SalesOrder {  };
  @cds.ambiguous : 'missing on condition?'
  to_SalesOrderItem : Association to API_SALES_ORDER_SRV.A_SalesOrderItem {  };
};

@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Sales Order Schedule Line (API)'
entity API_SALES_ORDER_SRV.A_SalesOrderScheduleLine {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales document'
  @sap.quickinfo : 'Sales Document'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key SalesOrder : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Sales Document Item'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key SalesOrderItem : String(6);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Schedule line number'
  @sap.quickinfo : 'Schedule Line Number'
  key ScheduleLine : String(4);
  @sap.label : 'Sales unit'
  @sap.semantics : 'unit-of-measure'
  OrderQuantityUnit : String(3);
  @sap.unit : 'OrderQuantityUnit'
  @sap.label : 'Confirmed Quantity'
  ConfdOrderQtyByMatlAvailCheck : Decimal(13, 3);
  @sap.unit : 'OrderQuantityUnit'
  @sap.label : 'Delivered Quantity'
  DeliveredQtyInOrderQtyUnit : Decimal(13, 3);
  @sap.unit : 'OrderQuantityUnit'
  @sap.label : 'Open Quantity'
  @sap.quickinfo : 'Open Confirmed Delivery Quantity'
  OpenConfdDelivQtyInOrdQtyUnit : Decimal(13, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Delivery Block'
  @sap.quickinfo : 'Schedule Line Blocked for Delivery'
  DelivBlockReasonForSchedLine : String(2);
};

