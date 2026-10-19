const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const UserModel = require("../models/user.model");

function makeToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new AppError("JWT_SECRET harus berisi nilai acak minimal 32 karakter.", 500);
  return jwt.sign({ sub: user._id.toString(), role: user.role }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d", algorithm: "HS256"
  });
}

async function register({ nama, email, password }) {
  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const user = await UserModel.createUser({ nama, email, passwordHash });
    return { user, token: makeToken(user) };
  } catch (error) {
    if (error.code === 11000) throw new AppError("Email tersebut sudah terdaftar.", 409);
    throw error;
  }
}

async function login({ email, password }) {
  const user = await UserModel.findByEmail(email);
  const matches = user && await bcrypt.compare(password, user.passwordHash);
  if (!matches) throw new AppError("Email atau password salah.", 401);
  const publicUser = UserModel.toPublicUser(user);
  return { user: publicUser, token: makeToken(publicUser) };
}

module.exports = { register, login };
