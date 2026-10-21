const logger = require("../src/middlewares/logger.middleware");
const errorHandler = require("../src/middlewares/errorHandler.middleware");

describe("middleware keamanan dan error", () => {
  test("logger tidak mencatat query string yang bisa berisi kredensial", () => {
    let onFinish;
    const res = {
      statusCode: 200,
      on: (event, callback) => {
        if (event === "finish") onFinish = callback;
      }
    };
    const next = jest.fn();
    const log = jest.spyOn(console, "log").mockImplementation(() => {});

    logger({
      method: "GET",
      path: "/api/stats/summary",
      originalUrl: "/api/stats/summary?x-api-key=dummy-secret&token=dummy-token"
    }, res, next);
    onFinish();

    const line = log.mock.calls[0][0];
    expect(line).toContain("GET /api/stats/summary 200");
    expect(line).not.toContain("dummy-secret");
    expect(line).not.toContain("dummy-token");
    expect(next).toHaveBeenCalled();
    log.mockRestore();
  });

  test("error tak dikenal menjadi 500 generik tanpa stack di response production", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const log = jest.spyOn(console, "error").mockImplementation(() => {});
    const res = {
      headersSent: false,
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    try {
      errorHandler(new Error("detail internal"), {}, res, jest.fn());
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Terjadi kesalahan pada server."
      });
    } finally {
      if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = originalNodeEnv;
      log.mockRestore();
    }
  });
});
