const { pathToRegexp } = require('path-to-regexp');

const buildResponse = require("./buildResponse");

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

    let token = req.cookies.token;
    if (!token) {
      // 从header的authorization中获取（移动端等其他设备需要）
      token = req.headers.authorization;
    }
    if (!token) {
      // 没有认证过
      handleNoToken(req, res, next);
      return;
    }
    console.log("token: ", token);
    console.log("cookie: ", req.cookies);
    // 验证token...

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
