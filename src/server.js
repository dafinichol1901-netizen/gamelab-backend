require("dotenv").config();
const app = require("./app");
const { connectDB, closeDB } = require("./config/db");

let server;
async function startServer() {
  await connectDB();
  const port = Number(process.env.PORT) || 3000;
  server = app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
    console.log(`Mode aplikasi: ${process.env.NODE_ENV || "development"}`);
    console.log(`Dokumentasi API: http://localhost:${port}/api-docs`);
  });
  return server;
}
async function shutdown(signal) {
  console.log(`Menerima ${signal}, menutup server...`);
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  await closeDB();
}

if (require.main === module) {
  process.once("SIGINT", () => shutdown("SIGINT").catch((error) => { console.error(error); process.exitCode = 1; }));
  process.once("SIGTERM", () => shutdown("SIGTERM").catch((error) => { console.error(error); process.exitCode = 1; }));
  startServer().catch(async (error) => {
    console.error("Server gagal dijalankan:", error.message);
    await closeDB();
    process.exitCode = 1;
  });
}

module.exports = { startServer };
