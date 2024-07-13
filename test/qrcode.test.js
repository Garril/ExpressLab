const QRCode = require('qrcode');

// 服务器生成图片
QRCode.toFile('./code.png', "i am the msg in the code", err => {
  if (err) {
    console.log('to file err: ', err);
  }
})

// 生成URL
QRCode.toDataURL('https://www.baidu.com/', (err, url) => {
  if (err) {
    console.log("to data url err: ", err);
  } else {
    console.log("url: ", url);
  }
})