// 同步所有模型
const fs = require('fs');
const path = require('path');

const sequelize = require("./datebase");

// 获取 entity文件夹的绝对路径
const entityFolderPath = path.resolve(__dirname, 'entity');

// 同步读取 entity 文件夹中的所有文件
const files = fs.readdirSync(entityFolderPath);

// 过滤，获得所有的 js文件（实体类）并 require里面的模型
files.forEach(file => {
  if (path.extname(file) === '.js') {
    // console.log(`Requiring ${file}`);
    require(path.join(entityFolderPath, file));
  }
});

// 同步所有模型到数据库
sequelize
  .sync({
    alter: true, // 数据库匹配模型，模型优先级高
    // force: true, // 删除重建表，
  })
  .then(() => {
    console.log("所有模型同步完毕");
  }).catch(err => {
    console.error("同步模型出错：", err);
  });
