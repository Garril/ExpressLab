const asyncHandler = require("../asyncHandler");

const path = require("path");
const multer = require("multer");
const { markPic } = require("../../utils/jimp");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!req.uploadType || req.uploadType === 'upload') {
      cb(null, path.resolve(__dirname, "../../public", "upload"));
    } else if (req.uploadType === 'mark') {
      cb(null, path.resolve(__dirname, "../../public", "temp"));
    }
  },
  filename: function (req, file, cb) {
    const timeStamp = new Date().getTime();
    const ext = path.extname(file.originalname);
    const oname = file.originalname.slice(0, -ext.length);
    const filename = `${oname}-${timeStamp}${ext}`;
    // console.log("mimetype: ", file.mimetype);
    cb(null, filename);
  },
});
// 这里上传、水印原图上传的限制，暂时用同一个upload了
const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024, // 限制大小 500 KB
  },
  fileFilter(req, file, cb) {
    const extname = path.extname(file.originalname);
    const whiteList = [".jpg", ".gif", ".png", ".jpeg"];
    if (whiteList.includes(extname)) {
      cb(null, true);
    } else {
      // 默认为：500 -- Malformed part header 格式不正确
      cb(new Error(`${extname} type of file upload is not supported！`));
    }
  },
});

const markUpload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 限制大小 2 MB
  },
  fileFilter(req, file, cb) {
    const extname = path.extname(file.originalname);
    const whiteList = [".jpg", ".gif", ".png", ".jpeg"];
    if (whiteList.includes(extname)) {
      cb(null, true);
    } else {
      // 默认为：500 -- Malformed part header 格式不正确
      cb(new Error(`${extname} type of file upload is not supported！`));
    }
  },
});

module.exports = {
  baseURL: "/api/upload",
  config: [
    {
      method: "POST",
      needToken: true,
      path: "/",
      handler: [
        (req, res, next) => {
          req.uploadType = 'upload';
          upload.single("img")(req, res, (err) => {
            if (err) {
              return next(err);
            }
            next();
          });
        },
        asyncHandler(async (req, res, next) => {
          const url = `/upload/${req.file.filename}`;
          return url;
        }),
      ],
    },
    {
      method: "POST",
      needToken: true,
      path: "/mark",
      handler: (req, res, next) => {
        req.uploadType = 'mark';
        markUpload.fields([
          { name: "origin", maxCount: 1 },
          { name: "water", maxCount: 1 },
        ])(req, res, async (err) => {
          if (err) {
            return next(err);
          }
          // 是否有文件上传缺失
          if (!req.files || !req.files["origin"] || !req.files["water"]) {
            return res.status(400).send("Missing files");
          }
          try {
            // 获取路径
            const originPath = req.files["origin"][0].path;
            const waterPath = req.files["water"][0].path;
            const targetName = req.files["origin"][0].filename;
            // 处理水印，生成水印图片中。。。
            await markPic(waterPath, originPath, targetName);

            // 生成完毕，拼接图片路径
            const resURL = `/markPic/${targetName}`
            res.status(200).send({
              code: 200,
              msg: "",
              data: resURL,
            });
          } catch (error) {
            next(error);
          }
        });
      },
    },
  ],
};
