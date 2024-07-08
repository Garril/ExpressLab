const { pathToRegexp } = require('path-to-regexp');

const buildResponse = require("./buildResponse");
const cryptoJS = require('../utils/crypto');
const { verifyJWT } = require('./jwt');

// 批量获取api配置信息时获取
// const needTokenApi = [
//   // 注意： /api/student 和 /api/student/ 有区别
//   {
//     method: "POST",
//     path: "/api/student",
//   },
//   {
//     method: "PUT",
//     path: "/api/student/:id",
//   }
// ];

// 用于解析token
module.exports = function (needTokenApi) {
  return (req, res, next) => {
    // 判断是否需要token验证
    const apis = needTokenApi.filter(api => {
      const regex = pathToRegexp(api.path);
      // console.log(req.method, req.path, api.method);
      return (api.method === req.method && regex.test(req.path));
    })

    if (apis.length === 0) {
      next();
      return;
    }
    // 如果是使用自动加密，req.cookies获取不到加密后的cookie，需要signedCookies
    // let token = req.signedCookies.token;
    let token = req.cookies.token; // 这里的token是自定，需要自己加密解密

    if (!token) {
      // 从header的authorization中获取（移动端等其他设备需要）
      token = req.headers.authorization;
    }
    if (!token) {
      // 没有认证过
      handleNoToken(req, res, next);
      return;
    }
    // console.log("token: ", token);
    // console.log("cookie: ", req.cookies);

    // 验证token...
    // 一、没用JWT时
    // const userId = cryptoJS.decrypt(token);
    // req.userId = userId;

    // 二、使用JWT，多一层加密
    const cryptoContent = verifyJWT(req);
    if (cryptoContent) {
      const userId = cryptoJS.decrypt(cryptoContent.id);
      req.userId = userId;
    } else {
      handleNoToken(req, res, next);
      return;
    }
    /* 
      如果用的session
      直接验证 req.session，服务器重启 session清空
      if(req.session.userInfo) {
        next();
      } else {
        handleNoToken(req, res, next);
      }
    */
    next();
  }
};

function handleNoToken(req, res, next) {
  res
    .status(403)
    .send(
      buildResponse(403, null, "you dont have any token to access the api")
    );
}
