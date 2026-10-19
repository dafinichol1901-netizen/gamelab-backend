module.exports = function catchAsync(handler) {
  return function asyncHandler(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};
