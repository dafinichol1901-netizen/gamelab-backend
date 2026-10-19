const request = require("supertest");
const app = require("../src/app");
const { getDB } = require("../src/config/db");

describe("statistik dengan API key", () => {
  test("memerlukan API key dan menghitung jumlah kelas", async () => {
    await getDB().collection("daftar_kelas_pemrograman").insertMany([
      { nama: "HTML" }, { nama: "JavaScript" }
    ]);
    await request(app).get("/api/stats/summary").expect(401);
    const response = await request(app).get("/api/stats/summary")
      .set("x-api-key", process.env.EXTERNAL_API_KEY).expect(200);
    expect(response.body.data.totalKelas).toBe(2);
  });
});
