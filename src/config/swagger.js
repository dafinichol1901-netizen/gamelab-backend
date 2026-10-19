const swaggerJsdoc = require("swagger-jsdoc");

module.exports = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "GameLab Backend API",
      version: "1.0.0",
      description: "API kelas GameLab dengan MongoDB Driver, autentikasi, validasi, dan pagination."
    },
    servers: [{ url: "/", description: "Server yang sedang dibuka" }],
    components: { securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      apiKeyAuth: { type: "apiKey", in: "header", name: "x-api-key" }
    } }
  },
  apis: ["./src/routes/*.js"]
});
