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

## 代理

node 一般作为中间服务器。而不是直接后端服务器
搭载静态资源 或者 非业务数据库

这里需要将客户端的请求，转发给后端服务器
然后接收后端服务器响应，把响应转发给客户端

### http-proxy-middleware

`npm i http-proxy-middleware`

手写看 proxyMiddleware.js

## 模板引擎

ejs
`npm i ejs`

服务端渲染，具体实现看/routes/api/template.js
以及 routes/views/templates.ejs
爬虫可以之间看到页面源代码，利于 seo

区别于 vue、react 的客户端渲染

<%= art%>: 对 art 进行编码，防止脚本攻击。
<%- art%>: 不编码，原样显示，比如 art 是一个字符串
`<div>test msg</div>`会被渲染出来，编码过后则是字符串，而不是 div

## 生成二维码

二维码：承载了数据 -> 表现的就是一个字符串

### 一些概念

1、二维码靠矩阵点里的一个个 1 和 0，去表示信息。

2、位置探测组，三个位于角落的嵌套矩形，用于定位二维码的方向，什么角度扫都可以扫出来

3、version：1-40 的数字，越大表示二维码矩阵越大`（1 代表 21*21 个点）`
4、mode：字符编码方式 -- Numeric、Alphanumeric、Kanji、Byte（从左到右，代表：只能数字、可以是字母、可以中文日文等、类 ASCII 编码。）从左到右，能承载的数据也逐渐变小。

5、纠错等级：二维码比较模糊不清，也可以扫出来的原因（现在有些二维码中间就是一个 logo，损坏了，但是也可以扫出来），L、M、Q、H（从左到右，纠错等级越高，等级越高可以表达的字符量也越少）

### node-qrcode

`npm i qrcode`

支持服务端/客户端使用，客户端使用的话，需要自己用 webpack 打包一下。客户端也可以直接使用其他库 qrcodejs`https://www.bootcdn.cn/qrcodejs/`

## 生成验证码

作用：防止机器、脚本提交
类别：普通验证码、行为验证码（付费）

### canvas

`npm i canvas`
验证码的图，灵活就自己 canvas 画

### svg-captcha

简单不灵活的，用库
`npm i --save svg-captcha`

思路：登陆第三次失败时，服务器设置 req.session.needCaptcha=true 表示开启验证登陆模式。
客户端收到 401 的响应码，需要自己请求/captcha 获取验证码（不区分大小写），
服务端接收到/captcha 请求，保存答案在 req.session.captcha 中，返回 svg 图片二进制数据。
客户端显示验证码输入框和 svg 验证码，登录时，发送请求，请求体加上字段 “captcha”，保存用户输入的验证码
服务端之后每次登陆，不管成功失败，都需要清空 req.session.captcha，正确提示错误的位置是“验证码”还是“帐号或密码”

## 客户端缓存

Cache-Control: no-cache 表示的是，可以缓存，但是要用到文件的时候，不要直接使用缓存，问一下服务器文件是否有所变动（看 ETag 是否变动）
没有就 304 使用缓存的。
如果更新 js、css，webpack 打包后 hash 变了，html 也变了，那么文件会更新的。

## 富文本

库：wangEditor
`https://www.wangeditor.com/v5/installation.html`

关于上传图片在富文本的两方案：
1、用户上传，选择图片
2、富文本框将图片信息送到服务器，服务器返回图片 url 路径
3、服务端返回图片 url 路径，富文本生成 img 元素使用 url，插入富文本内部

1、用户上传，选择图片
2、在客户端生成图片 base64 格式
3、富文本生成 img 元素使用 base64 作为图片路径，插入富文本内部

## websocket

实时通讯：
一、轮询
二、长连接
长连接的断开，可能是由客户端/服务端发起的，keep-alive 会导致等待，所以可能是两边的任意一边出现问题，让另外一边干等着。

三、websocket
比 socket 多出：http 握手（第二步）
1、客户端服务端 TCP/IP 三次握手建立连接
2、客户端发送一个 http 格式的消息（特殊格式），服务器也响应一个 http 格式的消息（特殊格式）
`（特殊格式：get请求，有头，没有请求体，多了个Connection: Upgrade 和 Upgrade: websocket）`
3、全双工通信（但是 websocket 发送的消息有格式限制，socket 则无）
4、任意一方主动断开，通道销毁

### 库: socket.io

`https://socket.io/zh-CN/docs/v4/`
`npm i socket.io`

## CSRF

Cross Site Request Forgery 跨站请求伪造

原理：
1、用户访问正常站点，获取到令牌，假设是 pc 端，保存在 cookie 中

2、用户恶意访问站点，恶意站点通过某种形式去请求了正常站点（请求伪造），迫使正常用户把令牌传递到正常站点，完成攻击。
（比如: 恶意站点搞了个 html，看起来是正常的，但是 html 里面有个 iframe，iframe 是另外的一个 html，这个 html 里面可能就有一个 img 标签，设置 src 就为正常网址请求路径，请求就会自己带上正常网站的 token，暗自被发送出去。）

问题的根源：
用户在跨越站点的请求中，他附带了 cookie，自动的附带（同源策略）

### 防御

用的多的打\*号

#### SameSite\*

浏览器支持的：cookie 的 SameSite，禁止跨域附带的 cookie。

1、Strict: 严格，所有跨站都不带 cookie，甚至是超链接（点过去原先登录过的网站，又变不登录状态了）

2、Lax：宽松，所有跨站超链接、GET 请求的表单、预加载连接时会发送的 cookie，其他时候不发

3、None：不限制

#### referer 和 Origin\*

页面中的二次请求都会带 referer 或者 Origin 请求头，向服务器表明，该请求来自于哪一个页面，服务器根据其地址进行验证。

缺陷：极少的情况，部分浏览器的 referer 会被用户禁用。

#### authorization\*

token 不放 cookie，丢请求头的 authorization 里。

#### 验证码

1、客户端请求服务器，请求添加学生的页面，传递 cookie。
2、服务器
2.1、生成一个随机数，丢到 session 中
2.2、生成页面的时候，表单中加入一个隐藏的表单域`<input type="hidden" name="hash" value="<%=session['key'] %>"`
3、填好信息后，提交表单，自动提交隐藏的随机数
4、服务器
4.1、先拿到 cookie，判断是否登陆过
4.2、对比提交过来的随机数和之前的随机数是否一致
4.3、清除掉 session 中的随机数
（随机数只能用一次）

假设： 恶意站点搞了个 html，看起来是正常的，但是 html 里面有个 iframe，iframe 是另外的一个 html，这个 html 里面有一个 form 表单，做 post：

```html
<form id="xxx" action="http://xxx" method="POST">
  <input type="text" name="username" value="攻击者" />
  <input type="text" name="sex" value="0" />
</form>
```

这个 html 发送请求到 http://xxx，cookie 是会自动传过去，但是，form 里面的生成的随机数，他传过去
就算他自己伪造了一个 input 也是，不知道随机数多少。

#### 二次验证\*

做出敏感操作就让用户二次验证。

## XSS 攻击

Cross Site Scripting 跨站脚本攻击

CSRF 的话，还是需要用户去访问恶意网站，才会被攻击，而 XSS 就完全是网站安全性问题。

### 存储型 XSS

1、恶意用户恶意内容到服务器
2、服务器没识别，保存恶意内容到数据库
3、正常用户访问服务器，
4、服务器在不知情的情况下，给予之前的恶意内容，用户被攻击。

比如：发布文章，文章内容里面写 script 标签，内嵌脚本代码。ejs 模板内允许，没做编译时，会被攻击

### 反射型 XSS

1、恶意用户分享了一个正常网站的连接，但是连接中带有恶意的内容
2、用户点击了该连接
3、服务器在不知情的情况下，把恶意内容读取了出来，放进了页面中，让用户遭到攻击。

比如：ejs 和 render，模板里面 a 标签的跳转，读取的访问路径里面的 query 中的某个属性
=》 query 会放到 a 标签的 href 里，那么需要考虑编码问题，他可能会写`localhost:8000/users?redirect="><script>....</script>`
或者 `localhost:8000/users?redirect=javascript:alert(1)` 这样的内容。

### DOM 型

有些 js 读取 dom 里的一些数据，去处理。但是他注入了错误的 dom。

### 防御方法：

`npm i xss`
该库：处理利用 script 标签和超链接点击等，进行非法操作的代码，编译为字符串，其他正常的标签不影响他使用，可以配置过滤情况。

模板引擎渲染的时候，全部使用`<%=redirect>`加等号，编译，不相信任何 dom。

## 进程线程

一个进程有独立的、可伸缩的内存空间，进程之间可以通信，CPU 在不同进程之间切换执行，两进程遵守一定的协议，比如 ipc。

现在 node 支持线程模块，对进程操作基本没有使用，线程于进程中。
一个进程一定有一个主线程，其下有 n 个子线程，内存空间不隔离，所以如果有公共的变量，需要互相的作用和影响。
（nodejs 有自己的线程机制去尽力规避）

### 什么时候使用线程？

目的：充分使用多核 CPU，最优就是一个核一个线程，在大规模线程执行过程中，尽量不要阻塞（没有 io、只存在大量计算）

比如：多个/大型文件的加密，加密算法需要大量计算

线程最好，相互独立，不要使用共享数据。io 密集型不适合使用线程，适合异步

```js
const { Worker } = require("worker_threads");
const os = require("os");
const arr = require("./objArr.json"); // 数组文件
const cpuNumber = os.cpus().length;
const len = Math.ceil(arr.length / cpuNumber);

console.time();
let numbers = cpuNumber; // 目前的线程数量
const newArr = []; // 保存的最终结果
for (let i = 0; i < cpuNumber; i++) {
  const data = arr.slice(i * len, (i + 1) * len);
  const worker = new Worker("./worker.js", {
    workerData: data,
  }); // workder是子线程实例
  worker.on("message", (result) => {
    newArr.push(...result);
    numbers--;
    if (numbers === 0) {
      console.timeEnd();
      // 输出最终结果
      console.log(newArr);
    }
    worker.terminate();
  });
}

// worker.js文件
const calcFn = require("./calcFn.js"); // 计算函数
const {
  parentPort, // 用于与父线程通信的端口
  workerData, // 获取线程启动时传递的数据
  threadId, // 获取线程的唯一编号
} = require("worker_threads");
const name = `线程${threadId}`;

const newArr = [];
for (const n of workerData) {
  if (calcFn(n)) {
    newArr.push(n);
  }
}
console.log(`${name}处理完成,并把结果给予了主线程`);
parentPort.postMessage(newArr);
```
