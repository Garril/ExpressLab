// const express = require("express");
// const router = express.Router();

const adminServ = require("../../services/adminService");
const asyncHandler = require("../asyncHandler");

const cryptoJS = require('../../utils/crypto');
const { createJWT } = require('../jwt');
const { async } = require("validate.js");
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
          let cipherText = cryptoJS.encrypt(result.id);
          // 一、字符串设置到头，浏览器自动设置cookie，1小时后过期
          // res.header("set-cookie", `token=${result.id};path=/;domain=localhost;max-age=3600;`);

          // 二、res.token方法设置
          // res.cookie("token", cipherText, {
          //   path: '/',
          //   domain: 'localhost',
          //   maxAge: 7 * 24 * 3600 * 1000,  // 7天后过期
          //   // httpOnly: true
          //   // signed: true, // 根据密钥加密（但是需要考虑authorization，不推荐）
          // });
          // res.header('authorization', cipherText);

          // 三、JWT，另外一种方式加密，与cryptoJS.encrypt不同
          // cryptoJS.encrypt可以不要。这里没删，相当于两层加密
          createJWT(res, 1000 * 3600 * 24, {
            id: cipherText
          });
          /* 
            四、session方案，不响应cookie了，不修改res.cookie
            req.session.userInfo = result;
          */
        }
        return result;
      }),
    },
    {
      method: 'GET',
      needToken: true,
      path: '/whoami',
      handler: asyncHandler(async (req, res) => {
        return await adminServ.getAdminById(req.userId);
      })
    }
  ],
}
