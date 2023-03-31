const cds = require("@sap/cds");

module.exports = cds.service.impl(async (srv) => {

    const { Messages } = srv.entities;

    srv.before("CREATE", "Messages", (req) => {
        // Auth check since @restrict doesn't work on CREATE because there is no such thing as a WHERE clause on an insert.
        req.user.is("Admin") || req.user.is("system-user") || req.user.attr.Division === "$UNRESTRICTED" || req.user.attr.Division?.includes(req.data.divisionCd) || req.reject(403);
    });

    srv.on("updateStatus", "Messages", async (req) => {
        try {
            const ID = req.params[0];
            await UPDATE(Messages, ID).with({
                orderSaved: req.data.orderSaved,
                timesProcessed: req.data.timesProcessed,
                returns: req.data.returns,
            });
        } catch (err) {
            console.error(err);
            req.error(562, err.message);
            return;
        }
    });
});
