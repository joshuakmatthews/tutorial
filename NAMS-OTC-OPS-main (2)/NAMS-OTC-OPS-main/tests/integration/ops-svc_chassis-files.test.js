const cds = require('@sap/cds/lib');
cds.User.default = cds.User.Privileged; // forces authentication
const test = cds.test(__dirname + '/../..');
const { POST, PUT, DEL, expect } = test; // Use DEL to avoid conflicts with cds.ql.DELETE

describe('on process ChassisFilesCSV', () => {

    let ManageService = {};

    beforeAll(async () => {
        // Retrieve the test order by DB select (bypass entity handler)
        ManageService = await cds.connect.to('ManageService');
    });

    it('should fill destSt when it\'s null and destBusName is a valid dealer code', async () => {

        const filename = 'INTEGRATION_TEST.csv';

        await DELETE.from(ManageService.entities.ChassisFilesCSV, filename);
        await DELETE.from(ManageService.entities.ChassisFiles).where`divisionCd = 'K' and DTPONumber = '10076246' and chassisNo = '965263'`;

        await POST(`/manage/ChassisFilesCSV`, { "filename": filename, "contentType": "text/csv" });

        // See also https://stackoverflow.com/a/68215516 which describes using Postman </> (code) tab to view sample NodeJs - Axios (which uses axios.request({ method: 'put', url: `/manage/ChassisFilesCSV('${filename}')/csv`, headers: { 'Content-Type': 'text/csv' }, data: 'plain-text-goes-here' }))
        await PUT(`/manage/ChassisFilesCSV('${filename}')/csv`, 'K,965263,,,,,10076246,07/14/2022,,,,,,,,,,,I137,,,,,  ,,,  ,', { headers: { 'Content-Type': 'text/csv' } });
    
        await POST(`/manage/ChassisFilesCSV('${filename}')/process`);

        const [chassis] = await SELECT.from(ManageService.entities.ChassisFiles).where`divisionCd = 'K' and DTPONumber = '10076246' and chassisNo = '965263'`;
        expect(chassis).to.have.property('destSt', 'AZ');

        await DEL(`/manage/ChassisFilesCSV('${filename}')`);

    });

});

describe('before CREATE ChassisFiles', () => {

    let cleanup = [];

    it('should fill destSt when it\'s null and destBusName is a valid dealer code', async () => {

        const given = {
            divisionCd: 'K',
            DTPONumber: '10076246',
            chassisNo: '965263',
            orderAddDt: '2022-07-14',
            destBusName: 'I137'
        };

        const { data } = await POST(`/manage/ChassisFiles`, given);

        cleanup.push(data?.ID);

        expect(data).to.have.property('destSt', 'AZ');

    });

    /**
     * Reset the order messages after the tests
     */
    afterAll(async () => {
        for (let id of cleanup) await DEL(`/manage/ChassisFiles(${id})`);
    });

});
