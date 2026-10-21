const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    createdAt: { type: Date, default: Date.now }
  },
  {
    collection: "users",
    versionKey: false
  }
);
const User = mongoose.models.User || mongoose.model("User", userSchema);

function toPublicUser(user) {
  if (!user) return null;
  const document = typeof user.toObject === "function" ? user.toObject() : user;
  const { passwordHash, ...publicUser } = document;
  return publicUser;
}

async function findByEmail(email) {
  return User.findOne({ email: email.toLowerCase() }).lean().exec();
}

async function findById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return User.findById(id).lean().exec();
}

async function createUser({ nama, email, passwordHash, role = "user" }) {
  const user = await User.create({ nama, email: email.toLowerCase(), passwordHash, role });
  return toPublicUser(user);
}

module.exports = { findByEmail, findById, createUser, toPublicUser };
