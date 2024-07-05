// node内置库
const crypto = require('crypto');

// 使用对称加密： aes 128
// 128位密钥
const secretCode = require('./secret');
const secretBuff = Buffer.from(secretCode, 'hex'); // buff数组 16长度、16字节

function getRandomIV() {
  // return (Math.random().toString(36).slice(-8)) + (Math.random().toString(36).slice(-8));
  return crypto.randomBytes(16); // AES-128-CBC uses a 16-byte IV
}

// 准备随机向量iv，一个密钥配向量，密钥固定，向量不固定（防止密钥泄露）
// 解密时用同样的向量和同样的密钥解密
module.exports = {
  // 加密
  encrypt(str) {
    const iv = getRandomIV();
    // crypto.getCiphers();
    // 其他加密算法，记得查查iv的长度，
    const cipher = crypto.createCipheriv("aes-128-cbc", secretBuff, iv);
    let encrypted = cipher.update((str + ''), "utf-8", "hex");
    encrypted += cipher.final("hex");
    return {
      iv: iv.toString('hex'),
      content: encrypted
    };
  },
  // 解密
  decrypt(encrypted) {
    const { iv, content } = encrypted;
    // iv向量记得转化为16进制长度16的buffer
    const decipher = crypto.createDecipheriv("aes-128-cbc", secretBuff, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(content, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
  }
}