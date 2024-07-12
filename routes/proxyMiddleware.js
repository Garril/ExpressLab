const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');

const context = "/proxy";

// 手动处理代理请求的中间件
exports.handProxyMiddleware = (req, res, next) => {
  if (!req.path.startsWith(context)) {
    // 不需要代理
    return next();
  }

  // 需要代理
  const path = req.path.substr(context.length);

  // 代理请求对象
  const request = http.request({
    host: 'localhost',
    port: 8888,
    path: path,
    method: req.method,
    headers: req.headers
  }, response => {
    // 代理响应对象
    res.status(response.statusCode);
    for (const key in response.headers) {
      res.setHeader(key, response.headers[key]);
    }
    response.pipe(res);
  });

  // 处理代理请求错误
  request.on('error', (err) => {
    console.error('Proxy request error:', err);
    res.status(500).send('Proxy request error');
  });

  // 将客户端请求体写入代理请求的请求体
  req.pipe(request);
};

// 使用 http-proxy-middleware 处理代理请求的中间件
exports.httpProxyMiddleware = createProxyMiddleware({
  target: 'http://127.0.0.1:8888',
  pathRewrite: function (path, req) {
    console.log(`Rewriting path from ${path} to ${path}`);
    return path;
  },
  onProxyReq: function (proxyReq, req, res) {
    console.log(`Proxying request ${req.method} ${req.url}`);
  },
  onProxyRes: function (proxyRes, req, res) {
    console.log(`Received response with status ${proxyRes.statusCode}`);
  },
  logLevel: 'debug' // 添加详细日志信息
});
