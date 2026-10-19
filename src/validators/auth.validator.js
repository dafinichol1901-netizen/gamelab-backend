const { body } = require("express-validator");

const registerValidator = [
  body().custom((value) => value && typeof value === "object" && !Array.isArray(value)
    && Object.keys(value).every((key) => ["nama", "email", "password"].includes(key)))
    .withMessage("Body hanya boleh berisi nama, email, dan password."),
  body("nama").isString().withMessage("Nama wajib berupa teks.").bail().trim()
    .isLength({ min: 2, max: 80 }).withMessage("Nama harus berisi 2 sampai 80 karakter."),
  body("email").isString().withMessage("Email wajib berupa teks.").bail().trim().toLowerCase()
    .isEmail().withMessage("Format email tidak valid.").bail().isLength({ max: 254 }),
  body("password").isString().withMessage("Password wajib berupa teks.").bail()
    .isLength({ min: 12, max: 72 }).withMessage("Password harus berisi 12 sampai 72 karakter.")
];

const loginValidator = [
  body().custom((value) => value && typeof value === "object" && !Array.isArray(value)
    && Object.keys(value).every((key) => key === "email" || key === "password"))
    .withMessage("Body hanya boleh berisi email dan password."),
  body("email").isString().withMessage("Email wajib berupa teks.").bail().trim().toLowerCase()
    .isEmail().withMessage("Format email tidak valid."),
  body("password").isString().withMessage("Password wajib berupa teks.").bail()
    .isLength({ min: 1, max: 72 }).withMessage("Password tidak boleh kosong dan maksimal 72 karakter.")
];

module.exports = { registerValidator, loginValidator };
