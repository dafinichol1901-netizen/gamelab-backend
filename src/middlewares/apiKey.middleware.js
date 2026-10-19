const { timingSafeEqual } = require("node:crypto");
const AppError = require("../utils/AppError");

module.exports = function apiKey(req, res, next) {
  const expected = process.env.EXTERNAL_API_KEY;
  const supplied = req.get("x-api-key") || "";
  if (!expected) return next(new AppError("EXTERNAL_API_KEY belum dikonfigurasi.", 500));
  const expectedBytes = Buffer.from(expected);
  const suppliedBytes = Buffer.from(supplied);
  const matches = expectedBytes.length === suppliedBytes.length && timingSafeEqual(expectedBytes, suppliedBytes);
  if (!matches) return next(new AppError("API key tidak valid.", 401));
  return next();
};
