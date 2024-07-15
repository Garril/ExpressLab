const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
const path = require("path");

app.use(express.static(path.join(__dirname, '../public')))

io.on("connection", (socket) => {
  // 新的客户端连接到服务器成功后，触发的事件
  console.log("新的客户端连接进来了");

  // 监听客户端发来的msg消息
  socket.on("msg", (chunk) => {
    console.log(chunk.toString('utf8'));
  })
  // 发送消息到客户端
  socket.on('disconnect', () => {
    console.log("断开连接");
    clearInterval(timer);
  })
  const timer = setInterval(() => {
    socket.emit('test', "test msg from server");
  }, 2000);
});

httpServer.listen(8888, () => {
  console.log("server listening on 8888");
});