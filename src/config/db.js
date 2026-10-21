require("dotenv").config({ quiet: true });

const os = require("node:os");
const mongoose = require("mongoose");
const databaseName = process.env.MONGODB_DB_NAME || "db_gamelab_indonesia";
let connecting;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection.db;
  if (connecting) return connecting;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("MONGODB_URI wajib diisi sebelum aplikasi dijalankan.");

  connecting = (async () => {
    try {
      await mongoose.connect(mongoUri, { dbName: databaseName, runtimeAdapters: { os } });
      const database = mongoose.connection.db;
      await database.collection("users").createIndex({ email: 1 }, { unique: true });
      console.log("Terhubung ke MongoDB (database: " + databaseName + ")");
      return database;
    } catch (error) {
      await mongoose.disconnect().catch(() => {});
      throw error;
    }
  })();

  try {
    return await connecting;
  } catch (error) {
    connecting = undefined;
    throw error;
  }
}

function getDB() {
  const database = mongoose.connection.db;
  if (mongoose.connection.readyState !== 1 || !database) {
    throw new Error("MongoDB belum terhubung. Jalankan connectDB() terlebih dahulu.");
  }
  return database;
}

async function closeDB() {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  connecting = undefined;
}

module.exports = { connectDB, getDB, closeDB };
