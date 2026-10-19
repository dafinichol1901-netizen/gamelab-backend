const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const COLLECTION_NAME = "daftar_kelas_pemrograman";
const collection = () => getDB().collection(COLLECTION_NAME);

function idCandidates(id) {
  const candidates = [id];
  if (/^[a-f\d]{24}$/i.test(id)) candidates.push(new ObjectId(id));
  if (/^-?(0|[1-9]\d*)$/.test(id)) {
    const numericId = Number(id);
    if (Number.isSafeInteger(numericId)) candidates.push(numericId);
  }
  return candidates;
}
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
async function getAllKelas({ page, limit, q, sortBy, order }) {
  const filter = q ? { $or: ["nama", "deskripsi"].map((field) => ({
    [field]: { $regex: escapeRegex(q), $options: "i" }
  })) } : {};
  const direction = order === "desc" ? -1 : 1;
  const [items, total] = await Promise.all([
    collection().find(filter).sort({ [sortBy]: direction }).skip((page - 1) * limit).limit(limit).toArray(),
    collection().countDocuments(filter)
  ]);
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}
async function getKelasById(id) {
  return collection().findOne({ _id: { $in: idCandidates(id) } });
}
async function createKelas(data) {
  const result = await collection().insertOne(data);
  return getKelasById(result.insertedId.toString());
}
async function updateKelas(id, changes) {
  const result = await collection().updateOne({ _id: { $in: idCandidates(id) } }, { $set: changes });
  return result.matchedCount ? getKelasById(id) : null;
}
async function deleteKelas(id) {
  const result = await collection().deleteOne({ _id: { $in: idCandidates(id) } });
  return result.deletedCount > 0;
}
async function countKelas() {
  return collection().countDocuments({});
}

module.exports = { getAllKelas, getKelasById, createKelas, updateKelas, deleteKelas, countKelas };
