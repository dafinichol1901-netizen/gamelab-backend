const catchAsync = require("../utils/catchAsync");
const KelasService = require("../services/kelas.service");

module.exports = {
  getAllKelas: catchAsync(async (req, res) => res.status(200).json({
    success: true, message: "Daftar kelas berhasil diambil.", data: await KelasService.getAllKelas(req.query)
  })),
  getKelasById: catchAsync(async (req, res) => res.status(200).json({
    success: true, message: "Detail kelas berhasil diambil.", data: await KelasService.getKelasById(req.params.id)
  })),
  createKelas: catchAsync(async (req, res) => res.status(201).json({
    success: true, message: "Kelas berhasil dibuat.", data: await KelasService.createKelas(req.body)
  })),
  updateKelas: catchAsync(async (req, res) => res.status(200).json({
    success: true, message: "Kelas berhasil diperbarui.", data: await KelasService.updateKelas(req.params.id, req.body)
  })),
  deleteKelas: catchAsync(async (req, res) => {
    await KelasService.deleteKelas(req.params.id);
    return res.status(200).json({ success: true, message: "Kelas berhasil dihapus.", data: { id: req.params.id } });
  })
};
