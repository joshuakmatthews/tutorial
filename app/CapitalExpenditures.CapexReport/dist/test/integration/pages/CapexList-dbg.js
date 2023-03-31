sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'CapitalExpenditures.CapexReport',
            componentId: 'CapexList',
            entitySet: 'Capex'
        },
        CustomPageDefinitions
    );
});