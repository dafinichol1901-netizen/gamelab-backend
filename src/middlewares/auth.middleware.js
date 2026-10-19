const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const UserModel = require("../models/user.model");

const protect = catchAsync(async (req, res, next) => {
  const [scheme, token] = (req.get("authorization") || "").split(" ");
  if (scheme !== "Bearer" || !token) throw new AppError("Token Bearer diperlukan untuk endpoint ini.", 401);
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new AppError("JWT_SECRET belum dikonfigurasi dengan aman.", 500);

  let payload;
  try {
    payload = jwt.verify(token, secret, { algorithms: ["HS256"] });
  } catch {
    throw new AppError("Token tidak valid atau sudah kedaluwarsa.", 401);
  }
  if (!payload.sub) throw new AppError("Token tidak valid.", 401);
  const user = await UserModel.findById(payload.sub);
  if (!user) throw new AppError("Akun pada token tidak ditemukan.", 401);
  req.user = user;
  next();
});

module.exports = { protect };
