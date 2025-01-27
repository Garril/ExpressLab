const buildResponse = require('./buildResponse');

module.exports = function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      const result = await handler(req, res, next);
      res.send(buildResponse('200', result, ''));
    } catch (err) {
      console.log("asyncHandler err: ", err);
      next(err);
    }
  }
}