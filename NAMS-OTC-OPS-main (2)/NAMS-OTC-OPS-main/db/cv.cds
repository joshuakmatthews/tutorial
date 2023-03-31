// If you have more than 1 database connection then:
//   1) Use hana-cli copy2DefaultEnv to copy .env file and reformat
//   2) rename default-env.json to default-env-admin.json
//   3) remove secondary HDI references from default-env-admin.json
// Then continue with following:
// 4) Use hana-cli inspectView -a -v CV_S4ORDERS -o cds to get below output generated from CV defition
//   a) -a switch tells it to use admin file, default-env-admin.json
//   b) provide column view name when prompted
// 5) Replace @title : 'VBELN: VBELN' with '{i18n>VBELN}' etc. and maintain entries in srv/i18n/i18n.properties file
// See: https://developers.sap.com/tutorials/hana-cloud-cap-calc-view.html
// See the following for info on using calc views with parameters in CDS
// https://cap.cloud.sap/docs/advanced/hana#views-with-parameters
namespace cv;

// --------------------------------------------------------------------
// Calculation View Facades ("CV_" prefix comes from namespace)
// --------------------------------------------------------------------
@cds.persistence.calcview
@cds.persistence.exists
entity![DIM_DIVISION]{
    key![DIVISION]      : String(2)  @title : '{i18n>division}';
    key![OPS_DIVISION]  : String(1)  @title : '{i18n>OPSDivision}';
       ![DIVISION_NAME] : String(20) @title : '{i18n>DESCRIPTION}';
}
