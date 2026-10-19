const { MongoMemoryServer } = require("mongodb-memory-server");
let mongoServer;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-only-secret-with-at-least-32-characters";
  process.env.JWT_EXPIRES_IN = "1h";
  process.env.EXTERNAL_API_KEY = "test-only-api-key";
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri("gamelab_test");
  const { connectDB } = require("../src/config/db");
  await connectDB();
}, 60000);

afterEach(async () => {
  const { getDB } = require("../src/config/db");
  await Promise.all([
    getDB().collection("users").deleteMany({}),
    getDB().collection("daftar_kelas_pemrograman").deleteMany({})
  ]);
});

afterAll(async () => {
  const { closeDB } = require("../src/config/db");
  await closeDB();
  if (mongoServer) await mongoServer.stop();
});
