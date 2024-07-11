const Jimp = require("jimp");
const path = require("path");
// 水印图片 保存文件夹路径
const markPicPath = path.resolve(__dirname, '../public/markPic');
/**
 * 给图片加水印 (传入路径都需要是：绝对路径)
 * @param {*} waterPath 水印图片路径
 * @param {*} originPath 原图图片路径
 * @param {*} targetName 生产图名称
 * @param {*} targetRate 目标比例 = 原图/水印 
 * @param {*} marginRate 水印位置，距离图片右下角的距离，根据宽高计算
 */
exports.markPic = async function (
  waterPath,
  originPath,
  targetName,
  targetRate = 5,
  marginRate = 0.05
) {
  if (!waterPath || !originPath || !targetName || !targetRate) {
    return null;
  }
  // 生成的图片的绝对路径
  const targetPath = path.join(markPicPath, targetName);
  // 读取到图片信息
  const [water, origin] = await Promise.all([
    Jimp.read(waterPath),
    Jimp.read(originPath),
  ]);
  /* 对水印图片进行缩放
    当前比例 = 原图宽度 / 水印图宽度
    目标比例 = 原图宽度 / (水印图宽度 * 修正比例)
    当前比例 / 目标比例 = 修正比例 

    在 Jimp 中，scale 方法只能接受一个参数来按比例缩放图像。
    要分别缩放图像的宽度和高度，可以使用 resize 方法, 指定图像的宽度和高度
    */
  const curRate = origin.bitmap.width / water.bitmap.width;
  water.scale(curRate / targetRate);

  // 计算位置
  const right = origin.bitmap.width * marginRate;
  const bottom = origin.bitmap.height * marginRate;
  const x = origin.bitmap.width - right - water.bitmap.width;
  const y = origin.bitmap.height - bottom - water.bitmap.height;

  // 写入水印
  origin.composite(water, x, y, {
    mode: Jimp.BLEND_SOURCE_OVER,
    opacitySource: 0.3,
  });
  // 保存图片
  await origin.write(targetPath);
}