// const express = require("express");
// const router = express.Router();

const adminServ = require("../../services/adminService");
const asyncHandler = require("../asyncHandler");

// 测试: 帐号：admin、密码：123456
// router.post(
//   "/login",
//   asyncHandler(async (req, res) => {
//     const result = await adminServ.login(req.body.loginId, req.body.loginPwd);
//     if (result) {
//       // 1小时后过期
//       // res.header("set-cookie", `token=${result.id};path=/;domain=localhost;max-age=3600;`);
//       res.cookie("token", result.id, {
//         path: '/',
//         domain: 'localhost',
//         maxAge: 7 * 24 * 3600 * 1000,  // 7天后过期
//         // httpOnly: true
//       });
//       res.header('authorization', result.id);
//     }
//     return result;
//   })
// );

// module.exports = router;

module.exports = {
  baseURL: "/api/admin",
  config: [
    {
      method: "POST",
      needToken: false,
      path: "/login",
      handler: asyncHandler(async (req, res) => {
        const result = await adminServ.login(req.body.loginId, req.body.loginPwd);
        if (result) {
          // 1小时后过期
          // res.header("set-cookie", `token=${result.id};path=/;domain=localhost;max-age=3600;`);
          res.cookie("token", result.id, {
            path: '/',
            domain: 'localhost',
            maxAge: 7 * 24 * 3600 * 1000,  // 7天后过期
            // httpOnly: true
          });
          res.header('authorization', result.id);
        }
        return result;
      }),
    },
  ],
}
