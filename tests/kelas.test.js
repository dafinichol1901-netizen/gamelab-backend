const request = require("supertest");
const app = require("../src/app");
const { getDB } = require("../src/config/db");
const { createAdminToken } = require("./helpers");

describe("API kelas", () => {
  test("membaca daftar dengan pagination dan pencarian", async () => {
    await getDB().collection("daftar_kelas_pemrograman").insertMany([
      { _id: 1, nama: "HTML Dasar", deskripsi: "Belajar HTML" },
      { _id: 2, nama: "JavaScript", deskripsi: "Belajar JS" }
    ]);
    const response = await request(app).get("/api/kelas?q=html&page=1&limit=1").expect(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.total).toBe(1);
    expect(response.body.data.page).toBe(1);
  });

  test("hanya admin yang dapat membuat, mengubah, dan menghapus kelas", async () => {
    const user = await request(app).post("/api/auth/register").send({
      nama: "Dafi", email: "dafi@example.com", password: "password-kuat-123"
    });
    await request(app).post("/api/kelas").set("Authorization", `Bearer ${user.body.data.token}`)
      .send({ nama: "Kelas Baru" }).expect(403);

    const token = await createAdminToken();
    const created = await request(app).post("/api/kelas").set("Authorization", `Bearer ${token}`)
      .send({ nama: "Kelas Baru", deskripsi: "Latihan backend" }).expect(201);
    const id = String(created.body.data._id);
    await request(app).put(`/api/kelas/${id}`).set("Authorization", `Bearer ${token}`)
      .send({ deskripsi: "Deskripsi diperbarui" }).expect(200);
    await request(app).delete(`/api/kelas/${id}`).set("Authorization", `Bearer ${token}`).expect(200);
  });

  test("validasi menolak pagination salah dan kelas yang tidak ditemukan", async () => {
    await request(app).get("/api/kelas?limit=500").expect(400);
    await request(app).get("/api/kelas/999999").expect(404);
  });
});
