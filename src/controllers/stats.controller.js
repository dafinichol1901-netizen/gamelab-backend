const catchAsync = require("../utils/catchAsync");
const StatsService = require("../services/stats.service");

module.exports = {
  getSummary: catchAsync(async (req, res) => res.status(200).json({
    success: true, message: "Ringkasan berhasil diambil.", data: await StatsService.getSummary()
  }))
};
