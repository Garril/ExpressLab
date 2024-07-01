// 同步数据库
require("./models/sync");

// 验证库 配置
require("./services/init");

const moment = require("moment");

const stuServ = require("./services/studentService");
stuServ.getStudents().then(res => {
  console.log(res);
})