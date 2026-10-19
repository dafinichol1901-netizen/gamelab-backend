const express = require("express");
const AuthController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { registerValidator, loginValidator } = require("../validators/auth.validator");
const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Daftarkan akun user (role user diberikan otomatis)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nama, email, password]
 *             properties:
 *               nama: { type: string, example: Dafi }
 *               email: { type: string, format: email, example: dafi@example.com }
 *               password: { type: string, minLength: 12 }
 *     responses:
 *       201: { description: Akun dibuat dan token dikembalikan }
 *       400: { description: Input tidak valid }
 *       409: { description: Email sudah digunakan }
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login dan ambil JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login berhasil }
 *       401: { description: Kredensial salah }
 */
router.post("/register", registerValidator, validate, AuthController.register);
router.post("/login", loginValidator, validate, AuthController.login);
module.exports = router;
