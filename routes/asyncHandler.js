const buildResponse = require('./buildResponse');

module.exports = function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      const result = await handler(req, res, next);
      console.log("result", result);
      res.send(buildResponse('200', result, ''));
    } catch (err) {
      console.log("err: ", err);
      next(err);
    }
  }
}