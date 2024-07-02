const log4js = require('log4js');
const path = require('path');

log4js.configure({
  appenders: {
    // sql日志出口
    sql: {
      type: 'dateFile', // file的话，备份文件没有标注日期
      filename: path.resolve(__dirname, "logs", "sql", "logging.log"),
      maxLogSize: 1024 * 1024, // 最大字节数,配置：1MB
      keepFileExt: true, // 保留文件后缀
      daysToKeep: 3, // 保留3天的备份日志
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [level: %p] [sort: %c] -- content: %n%m%n'
      }
    },
    // 必须要有默认分类
    default: {
      type: 'stdout', // 放到控制台
      // filename: path.resolve(__dirname, "logs", "default", "logging.log")
    },
  },
  categories: {
    sql: {
      // 有一个分类：sql，级别记录所有
      // 使用出口为：appenders中sql的配置
      appenders: ["sql"],
      level: "all"
    },
    default: {
      appenders: ["default"],
      level: 'all'
    }
  }
})

process.on('exit', () => {
  // 程序退出的时候，关闭日志记录
  log4js.shutdown();
})

const sqlLogger = log4js.getLogger("sql");
const defaultLogger = log4js.getLogger();

exports.sqlLogger = sqlLogger;
exports.logger = defaultLogger;

// sqlLogger.debug('tttt');
// sqlLogger.log('eeee');
// logger.debug('123123');
// logger.log('3456489');