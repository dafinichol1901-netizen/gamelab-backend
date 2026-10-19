const AppError = require("../utils/AppError");

module.exports = function notFound(req, res, next) {
  next(new AppError(`Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.`, 404));
};
