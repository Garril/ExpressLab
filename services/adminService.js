// 管理员初始化
// 若数据库无管理员，需要自动添加一个默认管理员

const Admin = require('../models/entity/Admin');

/* adminService.addAdmin({
    loginId: 'test1',
    loginPwd: '123'
  }) */
exports.addAdmin = async function (adminObj, operatorId) {
  // 操作权限
  if (operatorId) { }
  // 判断新用户的信息是否合理
  const ins = await Admin.create(adminObj);
  return ins.toJSON();
}


/* adminService.deleteAdmin('1'); */
exports.deleteAdmin = async function (adminId, operatorId) {
  // 操作权限
  if (operatorId) { }

  // const ins = await Admin.findByPk(adminId);
  // await ins?.destroy();

  // 优化，无实例，直接执行
  const res = Admin.destroy({
    where: {
      id: adminId
    }
  })
  return res;
}



/* 
  被删除，deletedAt有数值的，不会被修改，自动过滤
  adminService.updateAdmin('3', {
    loginId: 'ttt',
    loginPwd: '133',
    deletedAt: new Date()
  }).then(r => {
    console.log(r);
  })  
*/
exports.updateAdmin = async function (adminId, adminObj, operatorId) {
  // 操作权限
  if (operatorId) { }

  // const ins = await Admin.findByPk(adminId);
  // ins.loginId = adminObj.loginId;
  // ins.save();

  // 优化，无实例，直接执行
  const res = await Admin.update(adminObj, {
    where: {
      id: adminId,
    }
  })
  return res;
}
