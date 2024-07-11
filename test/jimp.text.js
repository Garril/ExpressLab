const { markPic } = require("../utils/jimp");
const path = require('path');
async function test() {
  const waterPath = path.resolve(__dirname, "../public/temp/water.png");
  const originPath = path.resolve(__dirname, "../public/temp/bg.jpg");
  // const targetPath = path.resolve(__dirname, "../public/temp/result.jpg");
  await markPic(waterPath, originPath, 'result.jpg', 5, 0.01)
}
test();
