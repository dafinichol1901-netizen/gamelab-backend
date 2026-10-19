const request = require("supertest");
const app = require("../src/app");

describe("autentikasi", () => {
  test("registrasi membuat user biasa dan menolak role dari client", async () => {
    const body = { nama: "Dafi", email: "dafi@example.com", password: "password-kuat-123" };
    await request(app).post("/api/auth/register").send({ ...body, role: "admin" }).expect(400);
    const response = await request(app).post("/api/auth/register").send(body).expect(201);
    expect(response.body.data.user.role).toBe("user");
    expect(response.body.data.user.passwordHash).toBeUndefined();
    expect(response.body.data.token).toEqual(expect.any(String));
  });

  test("login menolak password yang salah", async () => {
    await request(app).post("/api/auth/register").send({
      nama: "Dafi", email: "dafi@example.com", password: "password-kuat-123"
    }).expect(201);
    const response = await request(app).post("/api/auth/login").send({
      email: "dafi@example.com", password: "password-salah"
    }).expect(401);
    expect(response.body.message).toMatch(/Email atau password salah/);
  });

  test("email duplikat menghasilkan 409", async () => {
    const body = { nama: "Dafi", email: "dafi@example.com", password: "password-kuat-123" };
    await request(app).post("/api/auth/register").send(body).expect(201);
    await request(app).post("/api/auth/register").send(body).expect(409);
  });
});
