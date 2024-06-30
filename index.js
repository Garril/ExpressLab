// 同步数据库
require('./models/sync');

const adminServ = require('./services/adminService');
// adminServ.addAdmin({
//   loginId: 'admin',
//   loginPwd: '123456'
// })
adminServ.login('admin', '123456').then(res => {
  console.log(res);
})