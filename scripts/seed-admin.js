require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB, closeDB } = require("../src/config/db");
const UserModel = require("../src/models/user.model");

async function main() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (!email || !password || password.length < 12 || password.length > 72) {
    throw new Error("Isi BOOTSTRAP_ADMIN_EMAIL dan password 12–72 karakter di .env terlebih dahulu.");
  }
  await connectDB();
  if (await UserModel.findByEmail(email)) {
    throw new Error("Email tersebut sudah memiliki akun. Gunakan email admin lain untuk bootstrap awal.");
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await UserModel.createUser({ nama: "Admin GameLab", email, passwordHash, role: "admin" });
  console.log(`Akun admin awal dibuat untuk ${email}. Hapus variabel bootstrap dari .env setelah selesai.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
}).finally(closeDB);
