// const crypto = require('crypto');
// console.log(crypto.randomBytes(16).toString('hex'))


// const secretCode = require('../utils/secret');
// const secretBuff = Buffer.from(secretCode, 'hex');


const mod = require('../utils/crypto');

const text = 'hello world测试啊@）+';
const str = mod.encrypt(text);
console.log(str);

const str2 = mod.decrypt(str);
console.log(str2);
