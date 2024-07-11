const asyncHandler = require("../asyncHandler");
const path = require("path");

module.exports = {
  baseURL: "/api/download",
  config: [
    {
      method: "GET",
      needToken: false,
      path: "/:filename",
      // handler: asyncHandler(async (req, res, next) => {
      //   const filePath = path.resolve(__dirname, '../../public/downloads', req.params.filename)
      //   // download方法第三参数为错误处理函数，不处理，则抛出
      //   // 这里让他抛出，让最后的错误处理中间件处理。
      //   return res.download(filePath, "default file name",err=> {console.error(err});
      // }),
      // res.download 和 asyncHandler的res.send两次发送请求结果，所以这里不用asyncHandler
      // res.download 异步，res.send同步，导致结果返回的都为res.send的
      handler: (req, res, next) => {
        const filename = req.params.filename;
        const filePath = path.resolve(__dirname, '../../public/downloads', filename);
        res.download(filePath, filename);
      }
    },
  ],
};
