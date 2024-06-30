const sequelize = require("../datebase");

const { DataTypes } = require("sequelize");

const Admin = sequelize.define("Admin", {
  // id: {
  //   type: DataTypes.INTEGER,
  //   primaryKey: true,
  //   autoIncrement: true
  // },
  loginId: {
    type: DataTypes.STRING,
    allowNull: false,
    // field: 'login_id' // 数据库中的实际列名
  },
  loginPwd: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  // tableName: 'admins', // 数据库中的表名
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
