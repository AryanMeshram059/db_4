const logAction = require("../utils/logger");

function allowRoles(...roles) {
  return (req, res, next) => {

    //  If role not allowed
    if (!roles.includes(req.user.role)) {

      logAction(
        "ACCESS_DENIED",
        `user=${req.user.id} role=${req.user.role} tried=${req.method} ${req.originalUrl}`
      );

      return res.status(403).send("Access denied");
    }

    // If role allowed
    logAction(
      "ACCESS_GRANTED",
      `user=${req.user.id} role=${req.user.role} allowed=${req.method} ${req.originalUrl}`
    );

    next();
  };
}

module.exports = allowRoles;