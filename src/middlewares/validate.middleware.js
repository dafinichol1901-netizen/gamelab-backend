const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

module.exports = function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = result.array().map(({ path, msg, location }) => ({ field: path, location, message: msg }));
  return next(new AppError("Input tidak valid.", 400, errors));
};
