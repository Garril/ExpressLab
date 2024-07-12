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

## 登录认证

cookie-parser

`npm i cookie-parser`

解析匹配：
/api/student/:id
用 /api/student/1771 通过
用 /api/student/1771/222 不通过
`npm i path-to-regexp`

```js
const { secretCode } = require("./secret.js");
app.use(cookieParser(secretCode));
```

然后 在 routes/api/admin.js 中
通过 res.cookie 中配置参数 signed 为 true
自动对 cookie 中 token 进行加密(req.signedCookies.token 获取)
但是需要考虑非 web 端，响应头中 authorization 的设置，也需要加密，所以不推荐，这里直接自己根据密钥进行加密，然后两边一块设置。(req.cookies.token 获取)

## cookie

存在客户端，不占用服务器资源，但是：只能是字符串格式，存储量有限，一般 4KB，数据容易被获取，被篡改，容易丢失

存储量如果用 sessionStorage、localStorage，就不会自动发送，且没有 cookie 的一些安全性限制（比如 httponly 的设置，js 不可读，secure 只随 https 发送）

获取和篡改可以通过 httponly 和加密解决，但是丢失（清除缓存）

## session

sessionID（uuid）

存在服务器端，可以是任何格式，数组对象日期等，存储量理论上无限，数据难以被获取，难以被篡改

占用服务器资源

`npm i express-session`

## 跨域

`npm i cors`
cors 库 默认下不允许带 cookie。
如果是 fetch，注意是否有设置 credentials:true --- 一直带 cookie

```js
// 针对某些接口进行跨域设置
const cors = require("cors");
app.get("/login/:id", cors(), function (req, res, next) {
  // ....
});

app.post(
  "/student/:id",
  cors({
    origin: "http://example.com",
    optionsSuccessStatus: 200,
  }),
  function (req, res, next) {
    // ....
  }
);
```

## jwt

中心服务器，单点登录使用的一个身份令牌（只是一个令牌格式），可以存 cookie 也可以存 localstorage，随意

无论什么样的终端设备，都可以用同样的规范，来进行处理，不需要考虑其他设备是不是有完善的 cookie 管理机制

组成的三部分：
header、payload、signature

### header

```js
window.btoa(
  JSON.stringify({
    alg: "HS256",
    typ: "JWT",
  })
);
// RS256 非对称加密, HS256 对称加密
```

将对象 进行 base64 url 编码
（base64 url 不是加密算法，是一种编码方式，在 base64 算法的基础上，对`+、=、/`等三个字符做特殊处理, btoa 函数可以完成这个操作。
base64：用 64 个可打印字符来表示一个二进制数据）

### payload

jwt 主体信息，是一个 json 对象（部分系统，属性有自己的规范）
json 对象，经过 btoa 加密后获取到 payload

### signature

jwt 的签名，保证 jwt 不被篡改。

获取：首先将 header 和 payload 的 base64 url 编码拼接，获取到字符串 str1，然后根据 header 指定的算法和自定的密钥，对拼接后的字符串进行加密，获取到字符串 str2。
（服务器解密需要密钥和算法，验证时重新加密对比即可）

将 str1 和 str2 拼接，就是 jwt
（拼接用.隔开）

### jwt 库

express-jwt 和 jsonwebtoken 二选一

这里用 jsonwebtoken
`npm i jsonwebtoken`

## 打包后的刷新问题

打包后默认为 `http://localhost:8888/`打开页面
路由跳转到`http://localhost:8888/login`按 F5 刷新，not found
服务器没有找到`http://localhost:8888/login`对应的 静态资源 / api

服务器端：
`npm i connect-history-api-fallback`

```js
const history = require("connect-history-api-fallback");
app.use(history());
```

## 处理 multipart/form-data

`npm i --save multer`

## 迅雷下载

假设下载地址为：---
完整的下载地址为：
1、AA---ZZ
2、将 1 获取的字符串进行 base64 编码
3、thunder:// + 2 获取的字符串

a 超链接做个特殊标志

```html
<a resrole="thunder" href="#">下载</a>
```

```js
function getThunderLink(href = "http://localhost:8888/api/download/robot.jpg") {
  let thunderLink = `AA${href}ZZ`;
  thunderLink = btoa(thunderLink);
  return "thunder://" + thunderLink;
}
```

断点续传：迅雷和浏览器，下载都是一段一段的，可以打断点看看，在 req 中有个 range 属性，表示某段的范围

某些工具支持一开始发送一个 HEAD 请求，确定文件信息，多大，支不支持断点续传

## 图片水印

方案：
1、用户上传原始图片，服务器保留：原始图 + 水印图
2、用户上传原始图片，服务器保留：原始图，请求时再动态加水印。

`npm i jimp`
图片裁剪，翻转，颜色，合成，模糊合成等都可以用这个库

## 图片防盗链

防止白嫖：其他的网址直接拿的这边服务器的图片地址，用着服务器的带宽。
