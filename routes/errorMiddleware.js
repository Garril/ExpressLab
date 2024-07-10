const buildResponse = require("./buildResponse");
const multer = require("multer");

// 处理错误的中间件
module.exports = (err, req, res, next) => {
  if (err) {
    const errMsg = err instanceof Error ? err.message : err;
    if (err instanceof multer.MulterError) {
      res.status(200).send(buildResponse(200, [], errMsg));
      return;
    }
    res.status(500).send(buildResponse(500, [], errMsg));
  } else {
    next();
  }
};
