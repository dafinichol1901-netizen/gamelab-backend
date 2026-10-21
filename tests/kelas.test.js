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

  test("mengurutkan koleksi lama berdasarkan nama_kelas", async () => {
    await getDB().collection("daftar_kelas_pemrograman").insertMany([
      { _id: 1, nama_kelas: "Zebra" },
      { _id: 2, nama_kelas: "Alfa" }
    ]);
    const response = await request(app).get("/api/kelas?sortBy=nama_kelas&order=asc").expect(200);
    expect(response.body.data.items.map((item) => item.nama_kelas)).toEqual(["Alfa", "Zebra"]);
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
    for (const query of ["page=0", "page=-1", "page=abc", "page=1.5", "page=", "limit=500", "sortBy=constructor"]) {
      const response = await request(app).get("/api/kelas?" + query).expect(400);
      expect(response.body).toMatchObject({ success: false, message: "Input tidak valid." });
      expect(response.body.errors).toEqual(expect.any(Array));
    }
    await request(app).get("/api/kelas/999999").expect(404);
  });
  test("field kelas divalidasi saat membuat dan mengubah data", async () => {
    const token = await createAdminToken("admin-validation@example.com");
    await request(app).post("/api/kelas").set("Authorization", "Bearer " + token)
      .send({ nama: 123 }).expect(400);

    const created = await request(app).post("/api/kelas").set("Authorization", "Bearer " + token)
      .send({ nama: "Kelas Valid", deskripsi: "Deskripsi valid", versi: 1 }).expect(201);
    const id = String(created.body.data._id);
    await request(app).put("/api/kelas/" + id).set("Authorization", "Bearer " + token)
      .send({ deskripsi: ["bukan", "teks"] }).expect(400);
    await request(app).put("/api/kelas/" + id).set("Authorization", "Bearer " + token)
      .send({ versi: 1.5 }).expect(400);
  });
});
