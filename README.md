# notes

## Node 中的 ORM

让开发者使用同样的数据操作接口，完成对不同数据库的操作。

| TypeORM 与 TypeScript 配合更好，但这里使用 Sequelize，数据库 Mysql

`npm i sequelize mysql2`

## 数据用 Mock 模拟

## 数据抓取

cheerio(Jquery 核心库，与 dom 无关，字符串分析 html 片段中有什么元素可以去选择)

axios

`npm i axios cheerio`

## 加密 md5

（单向加密，可加密，不可解密）hash 加密算法的一种，可以将任何一个字符串，加密成一个固定长度的字符串。

同样数据加密后，得到结果一致。

`npm i md5`

## 数据验证

库：validator，验证某字符串是否满足某个规则

这里使用 validate.js，验证某个对象的属性是否满足某些规则
`npm i validate.js`

## 日志记录

库: log4js
日志级别：调试日志、错误日志、信息日志等，输出范围从大到小，依次为：`（all、trace、debug、info、warn、error、fatal、mark、off）`
可能不同等级，会输出到不同的出口中。

`npm i log4js`

## nodemon

nodemon 是一个监视器，用于监控工程中文件变化，如果发现文件变化，执行一段脚本

可以添加配置文件`nodemon.json`，配置要监听什么文件，不会让`package.json`变化也要重启服务器

`npm i -D nodemon`

## 统一时间 moment

`npm i moment`

```js
const moment = require("moment");
const formats = ["YYYY-MM-DD HH:mm:ss", "YYYY-M-D H:m:s", "x"];
console.log(moment.utc("2024-07-01 00:00:00", formats, true).toString());
console.log(moment.utc("2024-7-1 0:0:0", formats, true).toString());
console.log(moment.utc(0, formats, true).toString());
const invalidMoment = moment.utc(
  "Mon Jul 01 2024 00:00:00 GMT+0000",
  formats,
  true
);
console.log(invalidMoment.isValid()); // false
console.log(invalidMoment.toString()); // Invalid date
console.log(+invalidMoment); // NaN

const m = moment.utc("2024-07-01 00:00:00", formats, true);
console.log(m.format("YYYY年MM月DD日 HH点mm分ss秒"));

// 判断是否utc时间
console.log(m.isUTC());
// utc转换为本地时间
console.log(m.local().format("YYYY年MM月DD日 HH点mm分ss秒"));
// 本地转换为utc
console.log(m.utc().format("YYYY-MM-DD HH:mm:ss"));
// 获取文字描述，比如：多少分钟前，几天前
m.local().fromNow();
// 转化描述为中文
moment.locale("zh-cn");
```

## 中间件

需要手动交由后续中间件处理
若后续没了中间件，express 会响应 404

中间件发生错误时，不会自动停止服务器，相当于`next(new Error("err msg"))`,且响应 500

中间件参数`err,req,res,next`

