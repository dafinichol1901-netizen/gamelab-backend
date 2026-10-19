const bcrypt = require("bcryptjs");
const request = require("supertest");
const app = require("../src/app");
const UserModel = require("../src/models/user.model");

async function createAdminToken(email = "admin@example.com") {
  const password = "admin-test-password-123";
  const passwordHash = await bcrypt.hash(password, 4);
  await UserModel.createUser({ nama: "Admin Test", email, passwordHash, role: "admin" });
  const response = await request(app).post("/api/auth/login").send({ email, password });
  return response.body.data.token;
}

module.exports = { createAdminToken };
