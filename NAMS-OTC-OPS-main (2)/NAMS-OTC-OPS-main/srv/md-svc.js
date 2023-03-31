const cds = require("@sap/cds");
module.exports = cds.service.impl((srv) => {
  // @restrict does not check attribute values during CREATE event
  // https://launchpad.support.sap.com/#/incident/pointer/002075129400000525242022
  // https://cap.cloud.sap/docs/guides/authorization#instance-based-auth:
  /* "This means that, the condition applies following standard CDS events only:
        READ (as result filter)
        UPDATE (as reject condition)
        DELETE (as reject condition)"
  */
  srv.before("CREATE", "*", (req) => {
    if (
      !req.user.is("Admin") &&
      !req.user.is("system-user") &&
      !(
        req.user.attr.Division &&
        (req.user.attr.Division === "$UNRESTRICTED" ||
          req.user.attr.Division.includes(req.data.divisionCd))
      )
    )
      req.reject(
        403,
        "User " +
          req.user.id +
          " is not authorized to " +
          req.event +
          " entity " +
          req.entity +
          " for division " +
          req.data.divisionCd
    );
  });
});
