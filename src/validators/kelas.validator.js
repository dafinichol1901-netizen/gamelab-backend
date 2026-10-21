const { body, param, query } = require("express-validator");

const allowedSortFields = ["_id", "nama", "nama_kelas", "deskripsi"];

function safeDocument(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const keys = Object.keys(value).filter((key) => key !== "_id");
  if (!keys.length) return false;

  for (const field of ["nama", "nama_kelas"]) {
    if (Object.hasOwn(value, field)
      && (typeof value[field] !== "string" || !value[field].trim() || value[field].length > 120)) return false;
  }
  if (Object.hasOwn(value, "deskripsi")
    && (typeof value.deskripsi !== "string" || value.deskripsi.length > 2000)) return false;
  if (Object.hasOwn(value, "versi")
    && (!Number.isSafeInteger(value.versi) || value.versi < 1)) return false;

  const isSafeValue = (item, depth = 0) => {
    if (depth > 5) return false;
    if (item === null || ["string", "number", "boolean"].includes(typeof item)) {
      return typeof item !== "number" || Number.isFinite(item);
    }
    if (Array.isArray(item)) return item.length <= 100 && item.every((child) => isSafeValue(child, depth + 1));
    if (typeof item === "object") return Object.entries(item).every(([key, child]) =>
      key !== "__proto__" && !key.startsWith("$") && !key.includes(".") && isSafeValue(child, depth + 1));
    return false;
  };

  return keys.every((key) => key !== "__proto__" && !key.startsWith("$") && !key.includes(".")
    && key.length <= 100 && isSafeValue(value[key]));
}

const idValidator = param("id").isString().trim().isLength({ min: 1, max: 100 })
  .matches(/^[A-Za-z0-9_-]+$/).withMessage("ID hanya boleh berisi huruf, angka, garis bawah, atau tanda hubung.");
const listValidator = [
  query("page").optional().isInt({ min: 1, max: 1000000 }).withMessage("page minimal 1.").toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit harus antara 1 dan 100.").toInt(),
  query("q").optional().isString().trim().isLength({ max: 100 }).withMessage("q maksimal 100 karakter."),
  query("sortBy").optional().isIn(allowedSortFields).withMessage(`sortBy hanya boleh: ${allowedSortFields.join(", ")}.`),
  query("order").optional().toLowerCase().isIn(["asc", "desc"]).withMessage("order hanya boleh asc atau desc.")
];
const documentValidator = body().custom((value) => safeDocument(value))
  .withMessage("Body harus object JSON berisi data aman dan tidak boleh kosong.");

module.exports = { idValidator, listValidator, documentValidator };
