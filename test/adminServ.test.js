// 同步数据库
require("./models/sync");

// 验证库 配置
require("./services/init");


const adminServ = require('./services/adminService');
adminServ.addAdmin({
  loginId: 'admin',
  loginPwd: '123456'
})
adminServ.login('admin', '123456').then(res => {
  console.log(res);
})
