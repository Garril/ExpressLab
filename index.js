// 同步数据库
require("./models/sync");

// 验证库 配置
require("./services/init");

// 日志
// const { sqlLogger, logger } = require('./logger')

require('./routes/init')