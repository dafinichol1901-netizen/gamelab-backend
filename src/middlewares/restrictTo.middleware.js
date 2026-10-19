const AppError = require("../utils/AppError");

module.exports = function restrictTo(...allowedRoles) {
  return function roleGuard(req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError("Akun tidak memiliki izin untuk tindakan ini.", 403));
    }
    return next();
  };
};
