sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'CapitalExpenditures/CapexReport/test/integration/FirstJourney',
		'CapitalExpenditures/CapexReport/test/integration/pages/CapexList',
		'CapitalExpenditures/CapexReport/test/integration/pages/CapexObjectPage'
    ],
    function(JourneyRunner, opaJourney, CapexList, CapexObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('CapitalExpenditures/CapexReport') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheCapexList: CapexList,
					onTheCapexObjectPage: CapexObjectPage
                }
            },
            opaJourney.run
        );
    }
);