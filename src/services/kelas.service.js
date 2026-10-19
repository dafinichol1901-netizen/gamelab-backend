const AppError = require("../utils/AppError");
const KelasModel = require("../models/kelas.model");

async function getAllKelas(query = {}) {
  return KelasModel.getAllKelas({
    page: query.page ? Number(query.page) : 1,
    limit: query.limit ? Number(query.limit) : 10,
    q: query.q || "",
    sortBy: query.sortBy || "_id",
    order: (query.order || "asc").toLowerCase()
  });
}
async function getKelasById(id) {
  const kelas = await KelasModel.getKelasById(id);
  if (!kelas) throw new AppError("Kelas tidak ditemukan.", 404);
  return kelas;
}
async function createKelas(payload) {
  const { _id, ...document } = payload;
  if (!Object.keys(document).length) throw new AppError("Body tidak boleh hanya berisi _id.", 400);
  return KelasModel.createKelas(document);
}
async function updateKelas(id, payload) {
  const { _id, ...changes } = payload;
  if (!Object.keys(changes).length) throw new AppError("Body tidak boleh hanya berisi _id.", 400);
  const kelas = await KelasModel.updateKelas(id, changes);
  if (!kelas) throw new AppError("Kelas tidak ditemukan.", 404);
  return kelas;
}
async function deleteKelas(id) {
  if (!await KelasModel.deleteKelas(id)) throw new AppError("Kelas tidak ditemukan.", 404);
}

module.exports = { getAllKelas, getKelasById, createKelas, updateKelas, deleteKelas };
