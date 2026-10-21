const mongoose = require("mongoose");

const COLLECTION_NAME = "daftar_kelas_pemrograman";
const kelasSchema = new mongoose.Schema(
  { _id: mongoose.Schema.Types.Mixed },
  {
    collection: COLLECTION_NAME,
    strict: false,
    versionKey: false
  }
);
const Kelas = mongoose.models.Kelas || mongoose.model("Kelas", kelasSchema);

function idCandidates(id) {
  const candidates = [id];
  if (/^[a-f\d]{24}$/i.test(id)) candidates.push(new mongoose.Types.ObjectId(id));
  if (/^-?(0|[1-9]\d*)$/.test(id)) {
    const numericId = Number(id);
    if (Number.isSafeInteger(numericId)) candidates.push(numericId);
  }
  return candidates;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^$(){}|[\]\\]/g, "\\$&");
}

async function getAllKelas({ page, limit, q, sortBy, order }) {
  const filter = q
    ? {
        $or: ["nama", "nama_kelas", "deskripsi"].map((field) => ({
          [field]: { $regex: escapeRegex(q), $options: "i" }
        }))
      }
    : {};
  const direction = order === "desc" ? -1 : 1;
  const [items, total] = await Promise.all([
    Kelas.find(filter)
      .sort({ [sortBy]: direction })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec(),
    Kelas.countDocuments(filter).exec()
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

async function getKelasById(id) {
  return Kelas.findOne({ _id: { $in: idCandidates(id) } }).lean().exec();
}

async function createKelas(data) {
  const kelas = await Kelas.create({ ...data, _id: new mongoose.Types.ObjectId() });
  return kelas.toObject();
}

async function updateKelas(id, changes) {
  const result = await Kelas.updateOne(
    { _id: { $in: idCandidates(id) } },
    { $set: changes }
  ).exec();

  return result.matchedCount ? getKelasById(id) : null;
}

async function deleteKelas(id) {
  const result = await Kelas.deleteOne({ _id: { $in: idCandidates(id) } }).exec();
  return result.deletedCount > 0;
}

async function countKelas() {
  return Kelas.countDocuments({}).exec();
}

module.exports = { getAllKelas, getKelasById, createKelas, updateKelas, deleteKelas, countKelas };
