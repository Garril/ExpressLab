const sequelize = require("../datebase");

const { DataTypes } = require("sequelize");

const Admin = sequelize.define("Admin", {
  loginId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  loginPwd: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  // 取消默认加上的 createdAt、updatedAt
  createdAt: false,
  updatedAt: false,
  paranoid: true // 数据的删除通过 记录 删除时间 处理
});


// 在 sync.js统一同步

// (async function () {
//   Admin.sync({
//     alter: true, // 数据库匹配模型，模型优先级高
//     // force: true, // 删除重建表，
//   });
//   console.log("The database model synchronization is complete");
// })();

module.exports = Admin;
