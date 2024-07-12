const url = require("url");
const path = require("path");

function formatURL(url) {
  let formatURL = url;
  if (formatURL) {
    formatURL = formatURL.replace('localhost', '127.0.0.1').replace('http://', '').replace('https://', '');
  }
  return formatURL;
}
module.exports = (req, res, next) => {
  // 获取本网站的主机名（包括端口）
  let host = req.headers.host; // 服务器地址
  let referer = req.headers.referer; // 发送的网页路径
  if (host) {
    host = formatURL(host);
  }
  // 只处理图片
  const extname = path.extname(req.path);

  // 如果请求的不是图片，允许
  if (![".jpg", ".jpeg", ".png", ".gif"].indexOf(extname)) {
    next();
    return;
  }
  if (referer) {
    referer = formatURL(url.parse(referer).host);
  }

  if (referer && host != referer) {
    // 一、返回404
    // res.status(404).end();
    // return;
    // 二、返回防盗的特定图片
    req.url = '/downloads/robot.jpg';
  }
  next();
};
