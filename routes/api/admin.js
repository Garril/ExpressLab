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

function captchaHandler(req, res, next) {

  if (!req.session.records) {
    req.session.records = [];
  }
  const now = new Date().getTime();
  req.session.records.push(now);
  // 30s内登陆失败3次，就要显示验证码
  const duration = 30000; // 30s
  const max = 3; // 3次
  req.session.records = req.session.records.filter(time => ((now - time) <= duration))
  // 验证验证码
  if (req.session.records.length >= max || "captcha" in req.body) {
    req.session.needCaptcha = true;
    validateCaptcha(req, res, next);
  } else {
    res.send({
      code: 200,
      data: null,
      msg: '账号或密码错误'
    })
  }
}
function validateCaptcha(req, res, next) {
  // 用户输入的验证码
  const inputCaptcha = req.body.captcha ? req.body.captcha.toLowerCase() : '';
  if (!inputCaptcha || inputCaptcha !== req.session.captcha) {
    // 验证码 不管对不对，都清空，只能用一次
    req.session.captcha = "";
    // 验证码，错误
    res.send({
      code: 401,
      msg: "验证码错误"
    })
  } else {
    // 验证码 不管对不对，都清空，只能用一次
    req.session.captcha = "";
    // 验证码正确
    res.send({
      code: 200,
      data: null,
      msg: "账号或密码错误"
    })
  }
}


module.exports = {
  baseURL: "/api/admin",
  config: [
    {
      method: "POST",
      needToken: false,
      path: "/login",
      handler: async (req, res, next) => {

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
          if (req.session.captcha || req.session.needCaptcha) {
            // 是带了验证码的登陆
            const inputCaptcha = req.body.captcha ? req.body.captcha.toLowerCase() : '';
            if (!inputCaptcha || inputCaptcha !== req.session.captcha) {
              req.session.captcha = ""
              res.send({
                code: 401,
                msg: "验证码错误"
              })
              return;
            }
          }
          res.send({
            code: 200,
            data: result,
            msg: ''
          })
        } else {
          // 密码错误 / 没找到用户
          captchaHandler(req, res, next);
        }
      },
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
