const express = require("express");
const router = express.Router();
const app = express(); // app本质：一个处理请求的函数

/* 
如果使用的是session方案
  const session = require('express-session');
  const { secretCode } = require('./secret.js');
  app.use(session({
    secret: secretCode,
    name: 'sessionid',
    resave: false,
    saveUninitialized: true,
  }))
*/

// 验证码功能实现：加上session，把验证码文本放session中
const { secretCode } = require('./secret.js');
app.use(require('express-session')({
  secret: secretCode,
  resave: false,
  saveUninitialized: true,
}))

const fs = require('fs');
const path = require("path");

// CORS
// （自己实现）
// app.use(require('./corsMiddleware'));
// cors库
const cors = require("cors");
const whiteList = ["http://localhost:8000", "http://localhost:8888", "http://localhost:5173", "null"]
// 坑：
// 1、本地测试记得：发送请求origin写的127.0.0.1，这里会自动转换为localhost
// 2、localhost和127.0.0.1这里不匹配
app.use(cors({
  origin(origin, callback) {
    // console.log(origin);
    if (whiteList.includes(origin) || !origin) {
      // 测试环境：浏览器和postman发送，origin均为undefined
      callback(null, origin);
    } else {
      callback(new Error("not allowed"))
    }
  },
  credentials: true
}));

// 防盗链
app.use(require('./antiHotlink'));
// 代理
const { handProxyMiddleware, httpProxyMiddleware } = require('./proxyMiddleware');
// app.use(handProxyMiddleware);
app.use('/proxy', httpProxyMiddleware);


// 批量读取api文件夹下的配置文件，获取配置数组
const getApiCfgs = require("./getApiCfgs.js");
const { routesMap, needTokenApi } = getApiCfgs(fs, path);
// console.log(routesMap, needTokenApi);


// cookie-parser
// req对象中注入cookies属性，获取所有请求传递过来的cookie
const cookieParser = require("cookie-parser");
// const { secretCode } = require('./secret.js');
// app.use(cookieParser(secretCode));
app.use(cookieParser());

// 应用token中间件
const tokenVerifyMidWare = require("./tokenMiddleware.js")(needTokenApi);
app.use(tokenVerifyMidWare);


// 请求头Content-type为application/x-www-form-urlencoded时
// 解析消息体，将流数据读出，放到body中
app.use(
  express.urlencoded({
    extended: true, // 使用querystring/qs库解析
  })
);

// 解析 Content-type为application/json的情况
app.use(express.json());

// 处理xss
const xss = require("xss");
const myxss = new xss.FilterXSS({
  onTagAttr(tag, name, value, isWhiteAttr) {
    // 允许style属性
    if (name === 'style') {
      return `style="${value}"`;
    }
  }
})
app.use((req, res, next) => {
  for (const key in req.body) {
    const val = req.body[key];
    req.body[key] = myxss.process(val);
  }
  next();
})

// 处理 api 的请求
// app.use("/api/student", require("./api/student"));
// app.use("/api/admin", require("./api/admin"));

// 模板引擎，设置模板路径
app.set("views", path.resolve(__dirname, './views'));

// 批量注册路由
for (const [baseURL, routes] of routesMap) {
  routes.forEach(item => {
    const method = item.method.toLowerCase();
    const url = baseURL + item.path;
    if (Array.isArray(item.handler)) {
      router[method](url, ...item.handler);
    } else {
      router[method](url, item.handler);
    }
  })
}
app.use('/', router);

// 通过 rewrites 选项来确保所有以 /api 开头的请求不会被 connect-history-api-fallback 处理
const history = require("connect-history-api-fallback");
app.use(history({
  rewrites: [
    { from: /^\/api\/.*$/, to: context => context.parsedUrl.path }
  ]
}));

const staticRoot = path.join(__dirname, "../public");
// 根据req.path找静态资源
// 存在文件：直接返回，不移交后续操作
// 不存在文件：移交流程给后续中间件
app.use(express.static(staticRoot, {
  setHeaders(res, path) {
    // html不太希望一直缓存，要请求最新的，其他文件缓存久一点
    if (!path.endsWith(".html")) {
      res.header('Cache-Control', `max-age=${3600 * 24 * 365}`) // 一年
    }
  },
}));

/* 
  app.get(
    "/error",
    (req, res, next) => {
      console.log("test1");
      next();
    },
    (req, res, next) => {
      next(new Error("test"));
    }
  ); 
*/
// 错误处理
// app.use(require("./errorMiddleware"));



app.listen(8888, () => {
  // 启动需加上nodemon才读取得到 NODE_ENV
  console.log("environment: ", process.env.NODE_ENV);
  console.log("server listening on 8888");
});
