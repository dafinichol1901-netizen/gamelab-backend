const catchAsync = require("../utils/catchAsync");
const AuthService = require("../services/auth.service");

module.exports = {
  register: catchAsync(async (req, res) => {
    const data = await AuthService.register(req.body);
    return res.status(201).json({ success: true, message: "Akun berhasil dibuat.", data });
  }),
  login: catchAsync(async (req, res) => {
    const data = await AuthService.login(req.body);
    return res.status(200).json({ success: true, message: "Login berhasil.", data });
  })
};
