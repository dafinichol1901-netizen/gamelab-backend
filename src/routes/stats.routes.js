const express = require("express");
const apiKey = require("../middlewares/apiKey.middleware");
const StatsController = require("../controllers/stats.controller");
const router = express.Router();

/**
 * @openapi
 * /api/stats/summary:
 *   get:
 *     tags: [Stats]
 *     summary: Ringkasan jumlah kelas untuk integrasi layanan
 *     security: [{ apiKeyAuth: [] }]
 *     responses:
 *       200: { description: Jumlah kelas }
 *       401: { description: API key tidak valid }
 */
router.get("/summary", apiKey, StatsController.getSummary);
module.exports = router;
