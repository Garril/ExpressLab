
// 批量读取api文件夹下的配置文件，获取配置数组
// routesMap: key-baseURL,value-Array[路由信息对象]
// needTokenApi: 需要登录验证的路由
module.exports = function getApiCfgs(fs, path) {
  const apiFilePath = path.resolve(__dirname, './api');
  const files = fs.readdirSync(apiFilePath);
  const needTokenApi = [], routesMap = new Map();
  files.forEach(file => {
    if (path.extname(file) === '.js') {
      const routeInfo = require(path.join(apiFilePath, file));
      const baseURL = routeInfo.baseURL;
      const routes = [];
      routeInfo.config.forEach(cfg => {
        if (cfg.needToken) {
          needTokenApi.push({
            method: cfg.method,
            path: baseURL + (cfg.path === '/' ? '' : cfg.path)
          })
        }
        routes.push(cfg);
      })
      routesMap.set(baseURL, routes);
    }
  })
  return {
    routesMap,
    needTokenApi
  }
}