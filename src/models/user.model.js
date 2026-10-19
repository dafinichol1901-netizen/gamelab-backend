const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const collection = () => getDB().collection("users");
function toPublicUser(user) {
  if (!user) return null;
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}
async function findByEmail(email) {
  return collection().findOne({ email: email.toLowerCase() });
}
async function findById(id) {
  if (!ObjectId.isValid(id)) return null;
  return collection().findOne({ _id: new ObjectId(id) });
}
async function createUser({ nama, email, passwordHash, role = "user" }) {
  const user = { nama, email: email.toLowerCase(), passwordHash, role, createdAt: new Date() };
  const result = await collection().insertOne(user);
  return toPublicUser({ ...user, _id: result.insertedId });
}

module.exports = { findByEmail, findById, createUser, toPublicUser };
