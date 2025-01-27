const { Sequelize } = require("sequelize");
/* 
-- secret.js
  module.exports = {
    dbname: '',
    name: '',
    pw: ''
  };
*/
const secret = require("./secret");

// 日志配置
const { sqlLogger } = require('../logger');

const sequelize = new Sequelize(secret.dbname, secret.name, secret.pw, {
  host: "localhost",
  dialect: "mysql",
  // logging: null // 关闭sql操作记录
  logging: (msg) => {
    sqlLogger.debug(msg);
  }
});

// (async function () {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// })();

module.exports = sequelize;

