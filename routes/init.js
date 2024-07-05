const express = require("express");
const router = express.Router();
const app = express(); // app本质：一个处理请求的函数

const fs = require('fs');
const path = require("path");
const staticRoot = path.join(__dirname, "../public");
// 根据req.path找静态资源
// 存在文件：直接返回，不移交后续操作
// 不存在文件：移交流程给后续中间件
app.use(express.static(staticRoot));

// 批量读取api文件夹下的配置文件，获取配置数组
const getApiCfgs = require("./getApiCfgs.js");
const { routesMap, needTokenApi } = getApiCfgs(fs, path);
// console.log(routesMap, needTokenApi);

// cookie-parser
// req对象中注入cookies属性，获取所有请求传递过来的cookie
// res对象中注入cookie方法设置cookie
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

// 处理 api 的请求
// app.use("/api/student", require("./api/student"));
// app.use("/api/admin", require("./api/admin"));

// 批量注册路由
for (const [baseURL, routes] of routesMap) {
  routes.forEach(item => {
    const method = item.method.toLowerCase();
    const url = baseURL + item.path;
    router[method](url, item.handler);
  })
}
app.use('/', router);

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
app.use(require("./errorMiddleware"));

app.listen(8888, () => {
  console.log("environment: ", process.env.NODE_ENV);
  console.log("server listening on 8888");
});
