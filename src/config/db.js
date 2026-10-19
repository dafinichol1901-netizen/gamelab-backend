require("dotenv").config({ quiet: true });

const os = require("node:os");
const { MongoClient } = require("mongodb");
const databaseName = process.env.MONGODB_DB_NAME || "db_gamelab_indonesia";
let client;
let database;
let connecting;

async function connectDB() {
  if (database) return database;
  if (connecting) return connecting;
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("MONGODB_URI wajib diisi sebelum aplikasi dijalankan.");

  connecting = (async () => {
    // Node driver 7.6+ needs the OS adapter explicitly in Jest's CommonJS runtime.
    const nextClient = new MongoClient(mongoUri, { runtimeAdapters: { os } });
    try {
      await nextClient.connect();
      const nextDatabase = nextClient.db(databaseName);
      await nextDatabase.collection("users").createIndex({ email: 1 }, { unique: true });
      client = nextClient;
      database = nextDatabase;
      console.log(`Terhubung ke MongoDB (database: ${databaseName})`);
      return database;
    } catch (error) {
      await nextClient.close().catch(() => {});
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
  if (!database) throw new Error("MongoDB belum terhubung. Jalankan connectDB() terlebih dahulu.");
  return database;
}

async function closeDB() {
  if (client) await client.close();
  client = undefined;
  database = undefined;
  connecting = undefined;
}

module.exports = { connectDB, getDB, closeDB };
