const express = require("express");
const KelasController = require("../controllers/kelas.controller");
const { protect } = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/restrictTo.middleware");
const validate = require("../middlewares/validate.middleware");
const { idValidator, listValidator, documentValidator } = require("../validators/kelas.validator");
const router = express.Router();

/**
 * @openapi
 * /api/kelas:
 *   get:
 *     tags: [Kelas]
 *     summary: Daftar kelas dengan pencarian dan pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
 *       - in: query
 *         name: q
 *         schema: { type: string, maxLength: 100 }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [_id, nama, deskripsi], default: _id }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: asc }
 *     responses:
 *       200: { description: Daftar kelas }
 *       400: { description: Query tidak valid }
 *   post:
 *     tags: [Kelas]
 *     summary: Tambah kelas (admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, example: { nama: "Kelas JavaScript", deskripsi: "Belajar dasar JavaScript" } }
 *     responses:
 *       201: { description: Kelas dibuat }
 *       401: { description: Token tidak valid }
 *       403: { description: Hanya admin yang boleh menulis }
 * /api/kelas/{id}:
 *   get:
 *     tags: [Kelas]
 *     summary: Ambil detail kelas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Detail kelas }
 *       404: { description: Kelas tidak ditemukan }
 *   put:
 *     tags: [Kelas]
 *     summary: Ubah kelas (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, example: { deskripsi: "Belajar HTML5 dasar" } }
 *     responses:
 *       200: { description: Kelas diperbarui }
 *       404: { description: Kelas tidak ditemukan }
 *   delete:
 *     tags: [Kelas]
 *     summary: Hapus kelas (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Kelas dihapus }
 *       404: { description: Kelas tidak ditemukan }
 */
router.get("/", listValidator, validate, KelasController.getAllKelas);
router.post("/", protect, restrictTo("admin"), documentValidator, validate, KelasController.createKelas);
router.get("/:id", idValidator, validate, KelasController.getKelasById);
router.put("/:id", protect, restrictTo("admin"), idValidator, documentValidator, validate, KelasController.updateKelas);
router.delete("/:id", protect, restrictTo("admin"), idValidator, validate, KelasController.deleteKelas);
module.exports = router;
