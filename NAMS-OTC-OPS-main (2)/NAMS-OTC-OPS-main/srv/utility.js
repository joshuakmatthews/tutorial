const { v4: uuidv4 } = require('uuid'); // Destructuring of v4 attribute into top-level const called uuidv4, see https://stackoverflow.com/a/60250217
const cds = require("@sap/cds");

function getChassisOffset(chassis, offset) {
    return (parseInt(chassis) + offset).toString().padStart(6, "0");
}

function getDBDate(d, tz = 'America/Los_Angeles') {
    const o = {
        "timeZone": tz
    };
    return new Intl.DateTimeFormat('fr-CA', o).format(d); // fr-CA uses yyyy-MM-dd format
}

function getMaterialFromChassis(chassisNo, orderAddDt, division) {
    return chassisNo.substring(0, 6).concat("-", orderAddDt.substring(2, 4)).concat("-", division);
}

async function OPSToS4Division(divisionCd) {
    // Manual mapping of the 2 division codes that are currently in scope
    switch (divisionCd) {
        case "K":
            return "KW";
        case "P":
            return "PB";
        default:
            // Fall back to checking the mapping table in case another division code is encountered, e.g. if KenMex ("F")
            // gets added, but there is currently no division code defined in S4 for that.
            const map = await cds.connect.to("MapService");
            const { Divisions } = map.entities;
            try {
                const d = await SELECT.one`spart`.from(Divisions)
                    .where`divisionCd = ${divisionCd}`;
                if (d) return d.spart;
            } catch (err) {
                console.error(err);
                throw err;
            }
            return divisionCd;
    }
}

function getCurrency(exchangeRate) {
    switch (Number(exchangeRate)) {
        case 0:
        case 100:
            return "USD";
        default:
            return "CAD";
    }
}

function getUnique(array, prop) {
    if (Array.isArray(array) && array.length > 0) {
        return Object.keys(array.reduce(function (obj, item) {
            obj[item[prop]] = item[prop];
            return obj;
        }, {}));
    } else {
        return [];
    }
}

function getSalesOrg(country) {
    return country === "CA" ? "2010" : "1010";
}

module.exports = {
    getChassisOffset,
    uuidv4,
    getDBDate,
    getMaterialFromChassis,
    OPSToS4Division,
    getCurrency,
    getUnique,
    getSalesOrg,
};