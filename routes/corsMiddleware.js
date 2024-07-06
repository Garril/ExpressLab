// 假设 live server插件直接打开 html文件，给端口为8000
// 直接打开html，Origin为null
const allowOrigins = ["http://127.0.0.1:8000", "null"];

module.exports = function (req, res, next) {
  // 处理预检请求
  if (req.method === "OPTIONS") {
    // 设定允许请求的方法和请求头
    res.header(
      "Access-Control-Allow-Methods",
      req.headers["access-control-request-method"]
    );
    res.header(
      "Access-Control-Allow-Headers",
      req.headers["access-control-request-headers"]
    );
  }
  // 设定允许携带cookie
  res.header("Access-Control-Allow-Credentials", true);

  // 白名单内，允许跨域
  if ("origin" in req.headers && allowOrigins.includes(req.headers.origin)) {
    res.header("access-control-allow-origin", req.headers.origin);
    // 跨域访问时，js只能拿到一些基本的响应头,服务器可以设置其他给js访问
    // res.header("Access-Control-Expose-Headers", 'authorization,a,b');
  }

  next();
};
