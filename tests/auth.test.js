const request = require("supertest");
const jwt = require("jsonwebtoken");
const { getDB } = require("../src/config/db");
const app = require("../src/app");

describe("autentikasi", () => {
  test("registrasi membuat user biasa dan menolak role dari client", async () => {
    const body = { nama: "Dafi", email: "dafi@example.com", password: "password-kuat-123" };
    await request(app).post("/api/auth/register").send({ ...body, role: "admin" }).expect(400);
    const response = await request(app).post("/api/auth/register").send(body).expect(201);
    expect(response.body.data.user.role).toBe("user");
    expect(response.body.data.user.passwordHash).toBeUndefined();
    expect(response.body.data.token).toEqual(expect.any(String));
    const storedUser = await getDB().collection("users").findOne({ email: body.email });
    expect(storedUser.passwordHash).toMatch(/^\$2[aby]\$/);
    expect(storedUser.passwordHash).not.toBe(body.password);
  });

  test("login menolak password yang salah", async () => {
    await request(app).post("/api/auth/register").send({
      nama: "Dafi", email: "dafi@example.com", password: "password-kuat-123"
    }).expect(201);
    const response = await request(app).post("/api/auth/login").send({
      email: "dafi@example.com", password: "password-salah"
    }).expect(401);
    expect(response.body.message).toMatch(/Email atau password salah/);
    await request(app).post("/api/auth/login").send({
      email: "belum-terdaftar@example.com", password: "password-kuat-123"
    }).expect(401);
  });

  test("email duplikat menghasilkan 409", async () => {
    const body = { nama: "Dafi", email: "dafi@example.com", password: "password-kuat-123" };
    await request(app).post("/api/auth/register").send(body).expect(201);
    await request(app).post("/api/auth/register").send(body).expect(409);
  });
  test("endpoint admin menolak token hilang, rusak, dan kedaluwarsa", async () => {
    await request(app).post("/api/kelas").send({ nama: "Kelas" }).expect(401);
    await request(app).post("/api/kelas").set("Authorization", "Bearer token-rusak")
      .send({ nama: "Kelas" }).expect(401);
    const expiredToken = jwt.sign({
      sub: "507f1f77bcf86cd799439011",
      exp: Math.floor(Date.now() / 1000) - 60
    }, process.env.JWT_SECRET, { algorithm: "HS256" });
    await request(app).post("/api/kelas").set("Authorization", "Bearer " + expiredToken)
      .send({ nama: "Kelas" }).expect(401);
  });
});
