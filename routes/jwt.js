const { secretCode } = require('./secret');
const jwt = require('jsonwebtoken');
const cookieKey = 'token';

exports.createJWT = function (res, maxAge = 1000 * 3600 * 24 * 7, info = {}) {
  const token = jwt.sign(info, secretCode, {
    expiresIn: maxAge
  });
  // 添加到cookie
  res.cookie(cookieKey, token, {
    maxAge,
    path: '/',
    domain: 'localhost'
  })
  // 添加到头部
  res.header("authorization", token);
}

exports.verifyJWT = function (req) {
  let token;
  token = req.cookies[cookieKey];
  if (!token) {
    // 没有token,header中拿
    token = req.headers.authorization;
    if (!token) {
      return null;
    }
  }
  token = token.split(' '); // 考虑token开头有无 bearer 的情况
  token = token.length === 1 ? token[0] : token[1];
  try {
    const result = jwt.verify(token, secretCode);
    return result;
  } catch {
    return null;
  }
}