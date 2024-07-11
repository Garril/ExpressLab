const asyncHandler = require("../asyncHandler");

const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../public", "upload"));
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
const upload = multer({
  storage,
  limits: {
    fileSize: 300 * 1024, // 限制大小 300 KB
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
  ],
};
