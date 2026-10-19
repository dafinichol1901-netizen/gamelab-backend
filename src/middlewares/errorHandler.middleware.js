module.exports = function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  let statusCode = Number(error.statusCode || error.status) || 500;
  let message = error.message || "Terjadi kesalahan pada server.";
  let details = error.details;

  if (error.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Body harus berisi JSON yang valid.";
  } else if (error.type === "entity.too.large") {
    statusCode = 413;
    message = "Ukuran body melebihi batas 100 KB.";
  } else if (error.code === 11000) {
    statusCode = 409;
    message = "Data dengan nilai unik tersebut sudah terdaftar.";
  } else if (statusCode >= 500) {
    message = "Terjadi kesalahan pada server.";
    details = undefined;
    console.error(error);
  }

  const response = { success: false, message };
  if (details) response.errors = details;
  if (process.env.NODE_ENV === "development" && error.stack) response.stack = error.stack;
  return res.status(statusCode).json(response);
};
