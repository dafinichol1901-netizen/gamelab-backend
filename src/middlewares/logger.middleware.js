module.exports = function logger(req, res, next) {
  const startedAt = process.hrtime.bigint();
  res.on("finish", () => {
    const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    const requestPath = req.path || String(req.originalUrl || "/").split("?")[0];
    console.log(`${req.method} ${requestPath} ${res.statusCode} ${elapsedMs.toFixed(1)}ms`);
  });
  next();
};
