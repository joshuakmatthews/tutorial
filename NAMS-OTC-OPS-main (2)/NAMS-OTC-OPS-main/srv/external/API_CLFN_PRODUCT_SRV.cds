/* checksum : 2dc5921b1c117e801bdd6abe723db082 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.supported.formats : 'atom json xlsx'
service API_CLFN_PRODUCT_SRV {};

@cds.persistence.skip : true
@sap.content.version : '1'
@sap.label : 'Classification Class for Key Date'
entity API_CLFN_PRODUCT_SRV.A_ClfnClassForKeyDate {
  @sap.display.format : 'NonNegative'
  @sap.label : 'Internal class no.'
  @sap.quickinfo : 'Internal Class Number'
  key ClassInternalID : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Class Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ClassType : String(3);
  @sap.label : 'Description'
  @sap.quickinfo : 'Text describing class type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ClassTypeName : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Class'
  @sap.quickinfo : 'Class number'
  Class : String(18);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Status'
  @sap.quickinfo : 'Class status'
  ClassStatus : String(1);
  @sap.label : 'Text'
  @sap.quickinfo : 'Text for a table entry'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ClassStatusName : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Class group'
  @sap.quickinfo : 'Class Group'
  ClassGroup : String(10);
  @sap.label : 'Class Group'
  @sap.quickinfo : 'Class Group Description'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ClassGroupName : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Find objects'
  @sap.quickinfo : 'Authorization group for finding objects'
  ClassSearchAuthGrp : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Classification'
  @sap.quickinfo : 'Classification authorization group'
  ClassClassfctnAuthGrp : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Class maintenance'
  @sap.quickinfo : 'Class maintenance authorization group'
  ClassMaintAuthGrp : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Document'
  @sap.quickinfo : 'Document number'
  DocNumber : String(25);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Document Type'
  DocumentType : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Document part'
  DocumentPart : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Document version'
  DocumentVersion : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : ''
  @sap.quickinfo : 'Single-Character Flag'
  SameClassfctnReaction : String(1);
  @sap.label : 'Standard'
  @sap.quickinfo : 'Name of standards organization'
  ClassStandardOrgName : String(10);
  @sap.label : 'Standard number'
  @sap.quickinfo : 'Standard Number'
  ClassStandardNumber : String(20);
  @sap.display.format : 'Date'
  @sap.label : 'Issue date'
  ClassStandardStartDate : Date;
  @sap.display.format : 'Date'
  @sap.label : 'Version date'
  ClassStandardVersionStartDate : Date;
  @sap.display.format : 'NonNegative'
  @sap.label : 'Version Number'
  ClassStandardVersion : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chars table'
  @sap.quickinfo : 'Characteristics table'
  ClassStandardCharcTable : String(20);
  @sap.display.format : 'Date'
  @sap.label : 'Created on'
  @sap.quickinfo : 'Date on which the record was created'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CreationDate : Date;
  @sap.display.format : 'Date'
  @sap.label : 'Changed On'
  @sap.quickinfo : 'Date of Last Change'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  LastChangeDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Local class'
  ClassIsLocal : Boolean;
  @sap.display.format : 'Date'
  @sap.label : 'Valid From'
  @sap.quickinfo : 'Valid-From Date'
  ValidityStartDate : Date;
  @sap.display.format : 'Date'
  @sap.label : 'Valid to'
  @sap.quickinfo : 'Valid-to date'
  ValidityEndDate : Date;
  @odata.Type : 'Edm.DateTimeOffset'
  @odata.Precision : 7
  @sap.label : 'Time Stamp'
  @sap.quickinfo : 'UTC Time Stamp in Long Form (YYYYMMDDhhmmssmmmuuun)'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ClassLastChangedDateTime : Timestamp;
  @sap.display.format : 'Date'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  KeyDate : Date;
};

@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'API for Product with Classifications'
entity API_CLFN_PRODUCT_SRV.A_ClfnProduct {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Product'
  @sap.quickinfo : 'Product Number'
  key Product : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Product Type'
  ProductType : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'CrossPlantProdStatus'
  @sap.quickinfo : 'Cross-Plant Product Status'
  CrossPlantStatus : String(2);
  @sap.display.format : 'Date'
  @sap.label : 'Valid from'
  @sap.quickinfo : 'Date from which the cross-plant material status is valid'
  CrossPlantStatusValidityDate : Date;
  @sap.display.format : 'Date'
  @sap.label : 'Created On'
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
  @sap.label : 'Last Change'
  @sap.quickinfo : 'Date of Last Change'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  LastChangeDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Changed by'
  @sap.quickinfo : 'Name of person who changed object'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  LastChangedByUser : String(12);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Marked for Deletion'
  @sap.quickinfo : 'Deletion Indicator'
  IsMarkedForDeletion : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Old product number'
  @sap.quickinfo : 'Old Product Number'
  ProductOldID : String(40);
  @sap.unit : 'WeightUnit'
  @sap.label : 'Gross weight'
  GrossWeight : Decimal(13, 3);
  @sap.label : 'Order Unit'
  @sap.quickinfo : 'Purchase Order Unit of Measure'
  @sap.semantics : 'unit-of-measure'
  PurchaseOrderQuantityUnit : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Source of supply'
  @sap.quickinfo : 'Source of Supply'
  SourceOfSupply : String(1);
  @sap.label : 'Weight unit'
  @sap.quickinfo : 'Weight Unit'
  @sap.semantics : 'unit-of-measure'
  WeightUnit : String(3);
  @sap.unit : 'WeightUnit'
  @sap.label : 'Net weight'
  NetWeight : Decimal(13, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Country of origin'
  @sap.quickinfo : 'Country of Origin of Material (Non-Preferential Origin)'
  CountryOfOrigin : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Competitor'
  CompetitorID : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Product Group'
  ProductGroup : String(9);
  @sap.label : 'Base Unit of Measure'
  @sap.semantics : 'unit-of-measure'
  BaseUnit : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Gen. item cat. grp'
  @sap.quickinfo : 'General item category group'
  ItemCategoryGroup : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Product hierarchy'
  ProductHierarchy : String(18);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Division'
  Division : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Var. Order Unit'
  @sap.quickinfo : 'Variable Purchase Order Unit Active'
  VarblPurOrdUnitIsActive : String(1);
  @sap.label : 'Volume unit'
  @sap.semantics : 'unit-of-measure'
  VolumeUnit : String(3);
  @sap.unit : 'VolumeUnit'
  @sap.label : 'Volume'
  MaterialVolume : Decimal(13, 3);
  @sap.display.format : 'NonNegative'
  @sap.label : 'ANP Code'
  ANPCode : String(9);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Brand'
  Brand : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Procurement rule'
  ProcurementRule : String(1);
  @sap.display.format : 'Date'
  @sap.label : 'Valid From'
  @sap.quickinfo : 'Valid-From Date'
  ValidityStartDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Low-Level Code'
  LowLevelCode : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Generic Material'
  @sap.quickinfo : 'Material Number of the Generic Material in Prepack Materials'
  ProdNoInGenProdInPrepackProd : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Serial No. Profile'
  @sap.quickinfo : 'Serial Number Profile'
  SerialIdentifierAssgmtProfile : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Size/dimensions'
  SizeOrDimensionText : String(32);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Industry Std Desc.'
  @sap.quickinfo : 'Industry Standard Description (such as ANSI or ISO)'
  IndustryStandardName : String(18);
  @sap.display.format : 'UpperCase'
  @sap.label : 'GTIN'
  @sap.quickinfo : 'The global trade item number (EAN/UPC/GTIN)'
  ProductStandardID : String(18);
  @sap.display.format : 'UpperCase'
  @sap.label : 'EAN category'
  @sap.quickinfo : 'Category of International Article Number (EAN)'
  InternationalArticleNumberCat : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Configurable'
  @sap.quickinfo : 'Configurable Material'
  ProductIsConfigurable : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Batch management'
  @sap.quickinfo : 'Batch management requirement indicator'
  IsBatchManagementRequired : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Ext. Product Group'
  @sap.quickinfo : 'External Product Group'
  ExternalProductGroup : String(18);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Cross-plant CP'
  @sap.quickinfo : 'Cross-Plant Configurable Product'
  CrossPlantConfigurableProduct : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Serialization level'
  @sap.quickinfo : 'Level of Explicitness for Serial Number'
  SerialNoExplicitnessLevel : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Mfr Part Number'
  @sap.quickinfo : 'Manufacturer Part Number'
  ProductManufacturerNumber : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Mfr part profile'
  ManufacturerPartProfile : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Change Number'
  ChangeNumber : String(12);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Revision Level'
  MaterialRevisionLevel : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Handling Indicator'
  HandlingIndicator : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'WH Material Group'
  @sap.quickinfo : 'Warehouse Material Group'
  WarehouseProductGroup : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'WH Storage Condition'
  @sap.quickinfo : 'Warehouse Storage Condition'
  WarehouseStorageCondition : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Standard HU Type'
  StandardHandlingUnitType : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Serial No. Profile'
  @sap.quickinfo : 'Serial Number Profile'
  SerialNumberProfile : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Adjust. Profile'
  @sap.quickinfo : 'Adjustment Profile'
  AdjustmentProfile : String(3);
  @sap.label : 'Preferred UoM'
  @sap.quickinfo : 'Preferred Alternative UoM for Warehouse Operations'
  @sap.semantics : 'unit-of-measure'
  PreferredUnitOfMeasure : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Pilferable'
  IsPilferable : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Relevant for HS'
  @sap.quickinfo : 'Relevant for Hazardous Substances'
  IsRelevantForHzdsSubstances : Boolean;
  @sap.unit : 'TimeUnitForQuarantinePeriod'
  @sap.label : 'Quarant. Per.'
  @sap.quickinfo : 'Quarantine Period'
  QuarantinePeriod : Decimal(3, 0);
  @sap.label : 'Time Unit'
  @sap.quickinfo : 'Time Unit for Quarantine Period'
  @sap.semantics : 'unit-of-measure'
  TimeUnitForQuarantinePeriod : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Quality Inspec. Grp'
  @sap.quickinfo : 'Quality Inspection Group'
  QualityInspectionGroup : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Authorization Group'
  AuthorizationGroup : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Handling Unit Type'
  HandlingUnitType : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Varb. Tare Weight'
  @sap.quickinfo : 'Variable Tare Weight'
  HasVariableTareWeight : Boolean;
  @sap.label : 'Max. Pack. Length'
  @sap.quickinfo : 'Maximum Packing Length of Packaging Material'
  MaximumPackagingLength : Decimal(15, 3);
  @sap.label : 'Max. Pack. Width'
  @sap.quickinfo : 'Maximum Packing Width of Packaging Material'
  MaximumPackagingWidth : Decimal(15, 3);
  @sap.label : 'Max. Pack. Height'
  @sap.quickinfo : 'Maximum Packing Height of Packaging Material'
  MaximumPackagingHeight : Decimal(15, 3);
  @cds.ambiguous : 'missing on condition?'
  to_Description : Association to many API_CLFN_PRODUCT_SRV.A_ProductDescription {  };
  @cds.ambiguous : 'missing on condition?'
  to_Plant : Association to many API_CLFN_PRODUCT_SRV.A_ProductPlant {  };
  @cds.ambiguous : 'missing on condition?'
  to_ProductCharc : Association to many API_CLFN_PRODUCT_SRV.A_ProductCharc {  };
  @cds.ambiguous : 'missing on condition?'
  to_ProductClass : Association to many API_CLFN_PRODUCT_SRV.A_ProductClass {  };
  @cds.ambiguous : 'missing on condition?'
  to_ProductSalesTax : Association to many API_CLFN_PRODUCT_SRV.A_ProductSalesTax {  };
  @cds.ambiguous : 'missing on condition?'
  to_SalesDelivery : Association to many API_CLFN_PRODUCT_SRV.A_ProductSalesDelivery {  };
};

@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'API for Product Characteristic'
entity API_CLFN_PRODUCT_SRV.A_ProductCharc {
  @sap.label : 'Object'
  @sap.quickinfo : 'Key of Object to be Classified'
  key Product : String(90);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Internal char no.'
  @sap.quickinfo : 'Internal characteristic number without conversion routine'
  key CharcInternalID : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Class Type'
  key ClassType : String(3);
  @sap.display.format : 'Date'
  KeyDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Change Number'
  ChangeNumber : String(12);
  @cds.ambiguous : 'missing on condition?'
  to_Valuation : Association to many API_CLFN_PRODUCT_SRV.A_ProductCharcValue {  };
};

@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'API for Product Characteristic Valuation'
entity API_CLFN_PRODUCT_SRV.A_ProductCharcValue {
  @sap.label : 'Object'
  @sap.quickinfo : 'Key of Object to be Classified'
  key Product : String(90);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Class Type'
  key ClassType : String(3);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Internal char no.'
  @sap.quickinfo : 'Internal characteristic number without conversion routine'
  key CharcInternalID : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Counter'
  @sap.quickinfo : 'Characteristic value counter'
  key CharcValuePositionNumber : String(3);
  @sap.display.format : 'Date'
  KeyDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Change Number'
  ChangeNumber : String(12);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Code'
  @sap.quickinfo : 'Code for value dependency'
  CharcValueDependency : String(1);
  @sap.label : 'Characteristic Value'
  CharcValue : String(70);
  @sap.label : 'Value from'
  @sap.quickinfo : 'Internal floating point from'
  CharcFromNumericValue : Double;
  @sap.label : 'Internal UoM'
  @sap.quickinfo : 'Unit of Measurement'
  @sap.semantics : 'unit-of-measure'
  CharcFromNumericValueUnit : String(3);
  @sap.label : 'Value to'
  @sap.quickinfo : 'Internal floating point value to'
  CharcToNumericValue : Double;
  @sap.label : 'Internal UoM'
  @sap.quickinfo : 'Unit of Measurement'
  @sap.semantics : 'unit-of-measure'
  CharcToNumericValueUnit : String(3);
  @sap.label : 'LowrBndry Nmrc'
  @sap.quickinfo : 'Lower Boundary for Numeric Field'
  CharcFromDecimalValue : Decimal(31, 14);
  @sap.label : 'UprBndry Nmrc'
  @sap.quickinfo : 'Upper Boundary for Numeric Field'
  CharcToDecimalValue : Decimal(31, 14);
  @sap.unit : 'Currency'
  @sap.label : 'LowrBndry Crcy'
  @sap.quickinfo : 'Lower Boundary for Currency Field'
  CharcFromAmount : Decimal(24, 3);
  @sap.unit : 'Currency'
  @sap.label : 'UprBndry Crcy'
  @sap.quickinfo : 'Upper Boundary for Currency Field'
  CharcToAmount : Decimal(24, 3);
  @sap.label : 'Currency'
  @sap.quickinfo : 'Currency Key'
  @sap.semantics : 'currency-code'
  Currency : String(5);
  @sap.display.format : 'Date'
  @sap.label : 'LowrBndry Date'
  @sap.quickinfo : 'Lower Boundary for Date-Interval'
  CharcFromDate : Date;
  @sap.display.format : 'Date'
  @sap.label : 'UprBndry Date'
  @sap.quickinfo : 'Upper Boundary for Date-Interval'
  CharcToDate : Date;
  @sap.label : 'LowrBndry Time'
  @sap.quickinfo : 'Lower Boundary for Time-Interval'
  CharcFromTime : Time;
  @sap.label : 'UprBndry Time'
  @sap.quickinfo : 'Upper Boundary for Time-Interval'
  CharcToTime : Time;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Author'
  @sap.quickinfo : 'Classification: Author'
  CharacteristicAuthor : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Authorization Group'
  @sap.quickinfo : 'Authorization Group for Characteristics Maintenance'
  CharcMaintAuthGrp : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Characteristic Name'
  Characteristic : String(30);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Format'
  @sap.quickinfo : 'Data type of characteristic'
  CharcDataType : String(4);
};

@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'API for Product Class'
entity API_CLFN_PRODUCT_SRV.A_ProductClass {
  @sap.label : 'Object'
  @sap.quickinfo : 'Key of Object to be Classified'
  key Product : String(90);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Internal class no.'
  @sap.quickinfo : 'Internal Class Number'
  key ClassInternalID : String(10);
  @sap.display.format : 'Date'
  KeyDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Change Number'
  ChangeNumber : String(12);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Class Type'
  ClassType : String(3);
  @cds.ambiguous : 'missing on condition?'
  to_Characteristics : Association to many API_CLFN_PRODUCT_SRV.A_ProductClassCharc {  };
  @cds.ambiguous : 'missing on condition?'
  to_ClassDetails : Association to API_CLFN_PRODUCT_SRV.A_ClfnClassForKeyDate {  };
};

@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'API for Product Class Characteristic'
entity API_CLFN_PRODUCT_SRV.A_ProductClassCharc {
  @sap.label : 'Object'
  @sap.quickinfo : 'Key of Object to be Classified'
  key Product : String(90);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Internal class no.'
  @sap.quickinfo : 'Internal Class Number'
  key ClassInternalID : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Internal char no.'
  @sap.quickinfo : 'Internal characteristic number without conversion routine'
  key CharcInternalID : String(10);
  @sap.display.format : 'Date'
  KeyDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Change Number'
  ChangeNumber : String(12);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Class Type'
  ClassType : String(3);
  @cds.ambiguous : 'missing on condition?'
  to_Valuation : Association to many API_CLFN_PRODUCT_SRV.A_ProductCharcValue {  };
};

@cds.persistence.skip : true
@sap.content.version : '1'
@sap.label : 'Product Desc Active Core Entity (API)'
entity API_CLFN_PRODUCT_SRV.A_ProductDescription {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Product'
  @sap.quickinfo : 'Product Number'
  key Product : String(40);
  @sap.label : 'Language Key'
  key Language : String(2);
  @sap.label : 'Product Description'
  ProductDescription : String(40);
};

@cds.persistence.skip : true
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Product Plant Active Core Entity (API)'
entity API_CLFN_PRODUCT_SRV.A_ProductPlant {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  key Product : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  key Plant : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purchasing Group'
  PurchasingGroup : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Country of origin'
  @sap.quickinfo : 'Country of Origin of Material (Non-Preferential Origin)'
  CountryOfOrigin : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Region of origin'
  @sap.quickinfo : 'Region of Origin of Material (Non-Preferential Origin)'
  RegionOfOrigin : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Prod. stor. location'
  @sap.quickinfo : 'Issue Storage Location'
  ProductionInvtryManagedLoc : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant-sp.matl status'
  @sap.quickinfo : 'Plant-Specific Material Status'
  ProfileCode : String(2);
  @sap.display.format : 'Date'
  @sap.label : 'Valid from'
  @sap.quickinfo : 'Date from which the plant-specific material status is valid'
  ProfileValidityStartDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Availability check'
  @sap.quickinfo : 'Checking Group for Availability Check'
  AvailabilityCheckType : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Fiscal Year Variant'
  FiscalYearVariant : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Period Indicator'
  PeriodType : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Profit Center'
  ProfitCenter : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Commodity Code'
  Commodity : String(17);
  @sap.label : 'GR processing time'
  @sap.quickinfo : 'Goods receipt processing time in days'
  GoodsReceiptDuration : Decimal(3, 0);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Maintenance status'
  MaintenanceStatusName : String(15);
  @sap.display.format : 'UpperCase'
  @sap.label : 'DF at plant level'
  @sap.quickinfo : 'Flag Material for Deletion at Plant Level'
  IsMarkedForDeletion : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'MRP Type'
  MRPType : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'MRP Controller'
  MRPResponsible : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ABC Indicator'
  ABCIndicator : String(1);
  @sap.label : 'Minimum Lot Size'
  MinimumLotSizeQuantity : Decimal(13, 3);
  @sap.label : 'Maximum Lot Size'
  MaximumLotSizeQuantity : Decimal(13, 3);
  @sap.label : 'Fixed lot size'
  FixedLotSizeQuantity : Decimal(13, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Control code'
  @sap.quickinfo : 'Control code for consumption taxes in foreign trade'
  ConsumptionTaxCtrlCode : String(16);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Co-product'
  @sap.quickinfo : 'Indicator: Material can be co-product'
  IsCoProduct : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'ConfigurableProduct'
  @sap.quickinfo : 'Configurable Product'
  ProductIsConfigurable : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Stock det. grp'
  @sap.quickinfo : 'Stock determination group'
  StockDeterminationGroup : String(4);
  StockInTransferQuantity : Decimal(13, 3);
  StockInTransitQuantity : Decimal(13, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Post to insp. stock'
  @sap.quickinfo : 'Has Post to Inspection Stock'
  HasPostToInspectionStock : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Batch Mgmt Rqt(Plnt)'
  @sap.quickinfo : 'Batch Management Requirement Indicator for Plant'
  IsBatchManagementRequired : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Serial No. Profile'
  @sap.quickinfo : 'Serial Number Profile'
  SerialNumberProfile : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Neg. stocks in plant'
  @sap.quickinfo : 'Negative stocks allowed in plant'
  IsNegativeStockAllowed : Boolean;
  GoodsReceiptBlockedStockQty : Decimal(13, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Consign.Control'
  @sap.quickinfo : 'Consignment Control'
  HasConsignmentCtrl : String(1);
  @sap.display.format : 'NonNegative'
  FiscalYearCurrentPeriod : String(4);
  @sap.display.format : 'NonNegative'
  FiscalMonthCurrentPeriod : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Procurement type'
  @sap.quickinfo : 'Procurement Type'
  ProcurementType : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Batch Management'
  @sap.quickinfo : 'Batch management indicator (internal)'
  IsInternalBatchManaged : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Mat. CFOP category'
  @sap.quickinfo : 'Material CFOP category'
  ProductCFOPCategory : String(2);
  @cds.ambiguous : 'missing on condition?'
  to_ProductPlantProcurement : Association to API_CLFN_PRODUCT_SRV.A_ProductPlantProcurement {  };
  @cds.ambiguous : 'missing on condition?'
  to_ProductSupplyPlanning : Association to API_CLFN_PRODUCT_SRV.A_ProductSupplyPlanning {  };
  @cds.ambiguous : 'missing on condition?'
  to_ProductWorkScheduling : Association to API_CLFN_PRODUCT_SRV.A_ProductWorkScheduling {  };
  @cds.ambiguous : 'missing on condition?'
  to_StorageLocation : Association to many API_CLFN_PRODUCT_SRV.A_ProductStorageLocation {  };
};

@cds.persistence.skip : true
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Product Plant Procurement API CDS view'
entity API_CLFN_PRODUCT_SRV.A_ProductPlantProcurement {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  key Product : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  key Plant : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Automatic PO'
  @sap.quickinfo : 'Indicator: &quot;automatic purchase order allowed&quot;'
  IsAutoPurOrdCreationAllowed : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Source list'
  @sap.quickinfo : 'Indicator: Source list requirement'
  IsSourceListRequired : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Source of supply'
  @sap.quickinfo : 'Source of Supply'
  SourceOfSupplyCategory : String(1);
};

@cds.persistence.skip : true
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Product Sales Delivery Core Entity (API)'
entity API_CLFN_PRODUCT_SRV.A_ProductSalesDelivery {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Product'
  @sap.quickinfo : 'Product Number'
  key Product : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Organization'
  key ProductSalesOrg : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Distribution Channel'
  key ProductDistributionChnl : String(2);
  @sap.label : 'Minimum order qty'
  @sap.quickinfo : 'Minimum order quantity in base unit of measure'
  MinimumOrderQuantity : Decimal(13, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Delivering Plant'
  @sap.quickinfo : 'Delivering Plant (Own or External)'
  SupplyingPlant : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Product Price Grp'
  @sap.quickinfo : 'Product Pricing Group'
  PriceSpecificationProductGroup : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Acct Assmt Grp Mat.'
  @sap.quickinfo : 'Account Assignment Group for Material'
  AccountDetnProductGroup : String(2);
  @sap.label : 'Minimum Delivery Qty'
  @sap.quickinfo : 'Minimum Delivery Quantity in Delivery Note Processing'
  DeliveryNoteProcMinDelivQty : Decimal(13, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Item category group'
  @sap.quickinfo : 'Item category group from material master'
  ItemCategoryGroup : String(4);
  @sap.label : 'Unit of measure'
  @sap.quickinfo : 'Unit of measure of delivery unit'
  @sap.semantics : 'unit-of-measure'
  DeliveryQuantityUnit : String(3);
  @sap.label : 'Delivery unit'
  DeliveryQuantity : Decimal(13, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'DChain-spec. status'
  @sap.quickinfo : 'Distribution-chain-specific material status'
  ProductSalesStatus : String(2);
  @sap.display.format : 'Date'
  @sap.label : 'Valid from'
  @sap.quickinfo : 'Date from which distr.-chain-spec. material status is valid'
  ProductSalesStatusValidityDate : Date;
  @sap.label : 'Sales unit'
  @sap.semantics : 'unit-of-measure'
  SalesMeasureUnit : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'DF distr. chain lvl'
  @sap.quickinfo : 'Ind.: Flag material for deletion at distribution chain level'
  IsMarkedForDeletion : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Product hierarchy'
  ProductHierarchy : String(18);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Product group 1'
  @sap.quickinfo : 'Product Group 1'
  FirstSalesSpecProductGroup : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Product group 2'
  @sap.quickinfo : 'Product Group 2'
  SecondSalesSpecProductGroup : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Product group 3'
  @sap.quickinfo : 'Product Group 3'
  ThirdSalesSpecProductGroup : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Product group 4'
  @sap.quickinfo : 'Product Group 4'
  FourthSalesSpecProductGroup : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Product group 5'
  @sap.quickinfo : 'Product Group 5'
  FifthSalesSpecProductGroup : String(3);
  @sap.label : 'Min. MtO quantity'
  @sap.quickinfo : 'Minimum make-to-order quantity'
  MinimumMakeToOrderOrderQty : Decimal(13, 3);
};

@cds.persistence.skip : true
@sap.content.version : '1'
@sap.label : 'Product Sales Tax (API)'
entity API_CLFN_PRODUCT_SRV.A_ProductSalesTax {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Product'
  @sap.quickinfo : 'Product Number'
  key Product : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Country'
  @sap.quickinfo : 'Departure country (country from which the goods are sent)'
  key Country : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax category'
  @sap.quickinfo : 'Tax category (sales tax, federal sales tax,...)'
  key TaxCategory : String(4);
  @sap.display.format : 'UpperCase'
  key TaxClassification : String(1);
};

@cds.persistence.skip : true
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Prod Stor Loc Active Core Entity (API)'
entity API_CLFN_PRODUCT_SRV.A_ProductStorageLocation {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  key Product : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  key Plant : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Storage location'
  key StorageLocation : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Storage Bin'
  WarehouseStorageBin : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Maintenance status'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  MaintenanceStatus : String(15);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Phys. Inv. Block'
  @sap.quickinfo : 'Physical Inventory Blocking Indicator'
  PhysicalInventoryBlockInd : String(1);
  @sap.display.format : 'Date'
  @sap.label : 'Created On'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CreationDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'DF stor. loc. level'
  @sap.quickinfo : 'Flag Material for Deletion at Storage Location Level'
  IsMarkedForDeletion : Boolean;
  @sap.display.format : 'Date'
  @sap.label : 'Date of Last Count'
  @sap.quickinfo : 'Date of Last Posted Count'
  DateOfLastPostedCntUnRstrcdStk : Date;
  @sap.label : 'Invent. corr. factor'
  @sap.quickinfo : 'Inventory Correction Factor'
  InventoryCorrectionFactor : Double;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Restricted-use stock'
  @sap.quickinfo : 'Physical inventory indicator for restricted-use stock'
  InvtryRestrictedUseStockInd : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Warehouse stock CY'
  @sap.quickinfo : 'Physical inventory indicator for whse stock in current year'
  InvtryCurrentYearStockInd : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Qual. insp. stock CY'
  @sap.quickinfo : 'Phys. inventory ind. f. stock in qual. insp. in current year'
  InvtryQualInspCurrentYrStkInd : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Blocked stock'
  @sap.quickinfo : 'Physical inventory indicator for blocked stock'
  InventoryBlockStockInd : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Restricted use, PP'
  @sap.quickinfo : 'Physical inventory ind. for restricted-use stock, prev.pd'
  InvtryRestStockPrevPeriodInd : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Warehouse stock PY'
  @sap.quickinfo : 'Physical inventory indicator for stock in previous year'
  InventoryStockPrevPeriod : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'QualInspStock prv.pd'
  @sap.quickinfo : 'Phys. inventory ind. f. stock in qual. insp. in prev. period'
  InvtryStockQltyInspPrevPeriod : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Blcked stock prev.pd'
  @sap.quickinfo : 'Phys. inventory indicator for blocked stock in prev. period'
  HasInvtryBlockStockPrevPeriod : String(3);
  @sap.display.format : 'NonNegative'
  FiscalYearCurrentPeriod : String(4);
  @sap.display.format : 'NonNegative'
  FiscalMonthCurrentPeriod : String(2);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Fiscal year of current physical inventory indicator'
  @sap.heading : ''
  FiscalYearCurrentInvtryPeriod : String(4);
};

@cds.persistence.skip : true
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Product Supply Planning API CDS view'
entity API_CLFN_PRODUCT_SRV.A_ProductSupplyPlanning {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  key Product : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  key Plant : String(4);
  @sap.label : 'Fixed lot size'
  FixedLotSizeQuantity : Decimal(13, 3);
  @sap.label : 'Maximum Lot Size'
  MaximumLotSizeQuantity : Decimal(13, 3);
  @sap.label : 'Minimum Lot Size'
  MinimumLotSizeQuantity : Decimal(13, 3);
  @sap.label : 'Rounding value'
  @sap.quickinfo : 'Rounding value for purchase order quantity'
  LotSizeRoundingQuantity : Decimal(13, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Lot Sizing Procedure'
  @sap.quickinfo : 'Lot Sizing Procedure within Materials Planning'
  LotSizingProcedure : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'MRP Type'
  MRPType : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'MRP Controller'
  MRPResponsible : String(3);
  @sap.label : 'Safety stock'
  SafetyStockQuantity : Decimal(13, 3);
  @sap.label : 'Min safety stock'
  @sap.quickinfo : 'Minimum Safety Stock'
  MinimumSafetyStockQuantity : Decimal(13, 3);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Planning time fence'
  PlanningTimeFence : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ABC Indicator'
  ABCIndicator : String(1);
  @sap.label : 'Maximum Stock Level'
  MaximumStockQuantity : Decimal(13, 3);
  @sap.label : 'Reorder Point'
  ReorderThresholdQuantity : Decimal(13, 3);
  @sap.label : 'Planned Deliv. Time'
  @sap.quickinfo : 'Planned Delivery Time in Days'
  PlannedDeliveryDurationInDays : Decimal(3, 0);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Safety time/act.cov.'
  @sap.quickinfo : 'Safety time (in workdays)'
  SafetyDuration : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Strategy Group'
  @sap.quickinfo : 'Planning Strategy Group'
  PlanningStrategyGroup : String(2);
  @sap.label : 'Tot. repl. lead time'
  @sap.quickinfo : 'Total replenishment lead time (in workdays)'
  TotalReplenishmentLeadTime : Decimal(3, 0);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Procurement type'
  @sap.quickinfo : 'Procurement Type'
  ProcurementType : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Special procurement'
  @sap.quickinfo : 'Special procurement type'
  ProcurementSubType : String(2);
  @sap.label : 'Assembly scrap (%)'
  @sap.quickinfo : 'Assembly scrap in percent'
  AssemblyScrapPercent : Decimal(5, 2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Availability check'
  @sap.quickinfo : 'Checking Group for Availability Check'
  AvailabilityCheckType : String(2);
  @sap.label : 'GR processing time'
  @sap.quickinfo : 'Goods receipt processing time in days'
  GoodsReceiptDuration : Decimal(3, 0);
};

@cds.persistence.skip : true
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Product Work Scheduling API CDS view'
entity API_CLFN_PRODUCT_SRV.A_ProductWorkScheduling {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  key Product : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  key Plant : String(4);
  @sap.label : 'Base quantity'
  MaterialBaseQuantity : Decimal(13, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Unltd Overdelivery'
  @sap.quickinfo : 'Indicator: Unlimited Overdelivery Allowed'
  UnlimitedOverDelivIsAllowed : Boolean;
  @sap.label : 'Overdely tolerance'
  @sap.quickinfo : 'Overdelivery tolerance limit'
  OverDelivToleranceLimit : Decimal(3, 1);
  @sap.label : 'Underdely tolerance'
  @sap.quickinfo : 'Underdelivery tolerance limit'
  UnderDelivToleranceLimit : Decimal(3, 1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Prod. stor. location'
  @sap.quickinfo : 'Issue Storage Location'
  ProductionInvtryManagedLoc : String(4);
};

