const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const logger = require("./middlewares/logger.middleware");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");
const authRoutes = require("./routes/auth.routes");
const kelasRoutes = require("./routes/kelas.routes");
const statsRoutes = require("./routes/stats.routes");

const app = express();
app.use(logger);
app.use(express.json({ limit: "100kb" }));
app.get("/", (req, res) => res.status(200).json({ success: true, message: "GameLab Backend API siap." }));
app.use("/api/auth", authRoutes);
app.use("/api/kelas", kelasRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(notFound);
app.use(errorHandler);

module.exports = app;
