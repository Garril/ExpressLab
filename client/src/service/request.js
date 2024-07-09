import axios from 'axios';

export default function () {
  // 1、请求的时候，如果有token，需要附带到响应头中
  const token = localStorage.getItem('token');
  let instance = axios.create({
    baseURL: '/',
    timeout: 3000, // 可选配置：设置请求超时时间
  });
  if (token) {
    instance = instance.create({
      headers: {
        authorization: 'bearer ' + token,
      }
    })
  }
  // 2、响应的时候，如果有token，保存到本地
  instance.interceptors.response.use(res => {
    if (res.headers.authorization) {
      localStorage.setItem('token', res.headers.authorization);
    }
    return res;
  }, err => {
    console.log("err: ", err);
    if (err.response.status === 403) {
      // 3、响应的消息码 403，表示token失效（需要本地删除token）或者没有token
      localStorage.removeItem('token');
    }
    return Promise.reject(err);
  })
  return instance;
}