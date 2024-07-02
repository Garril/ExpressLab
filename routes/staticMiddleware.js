// 获取静态资源
module.exports = (req, res, next) => {
  if (!req.path.startWith('/static')) {
    next();
  } else {
    // 请求静态资源
    if (true) { // 静态资源存在
      res.send("静态资源")
    } else {
      next();
    }
  }
}