// 32进制，包含数字和26英文字母，取8位 两边拼接，就是16长度随机字符串
// Math.random().toString(32).slice(-8) + Math.random().toString(32).slice(-8)
// module.exports = 'l5ta0skgdtirhlhc';
// 长度 16 的 32进制字符串，16 * log2(32) = 80 bit、80 / 8 = 10 bytes
// 在使用 AES 加密时，密钥的长度需要符合算法的要求。具体来说，对于 AES-128，密钥长度应该是 16 字节（128 位）

// crypto.randomBytes(16).toString('hex')
// 获得的字符串.length == 32，长度32的16进制数，32 * log2(16) / 8 = 16 bytes
module.exports = '4de904eba146cbcb162ecf8359a20c81';