const express = require('express');
const app = express(); // app本质：一个处理请求的函数

// 静态资源
app.use(require('./staticMiddleware'))


app.get("/news", (req, res, next) => {
  console.log("test1");
  next();
}, (req, res, next) => {
  next(new Error("test"));
})



// 错误处理
app.use(require('./errorMiddleware'))

app.listen(8888, () => {
  console.log("environment: ", process.env.NODE_ENV);
  console.log("server listening on 8888");
});