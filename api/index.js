require("dotenv").config();
const app = require("../src/app");
const { connectDB } = require("../src/config/db");

module.exports = async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Gagal menghubungkan API ke database:", error.message);
    return res.status(500).json({ success: false, message: "Layanan sementara tidak tersedia." });
  }
};
