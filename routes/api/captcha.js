const express = require("express");
const svgCaptcha = require("svg-captcha");

module.exports = {
  baseURL: "/api/captcha",
  config: [
    {
      method: "GET",
      needToken: false,
      path: "/",
      handler: async (req, res, next) => {
        // createMathExpr 方法 --> 公式验证码
        const captcha = svgCaptcha.create({
          size: 4, // 长度
          ignoreChars: "iI0oO", // 排除字符
          noise: 6, // 干扰线数量
          color: true, // 颜色
        })
        // 不区分大小写
        req.session.captcha = captcha.text.toLowerCase();
        console.log("验证码: ", req.session.captcha);
        res.type('svg');
        res.status(200).send(captcha.data);
      }
    },
  ],
};
