fetch("http://localhost:8888/api/student").then(res => {
  return res.json();
}).then(resp => {
  console.log("get: ", resp);
})

// 预检请求
fetch("http://localhost:8888/api/student", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    a: 1
  },
  // 之后验证肯定会带cookie，设置credentials，表示一直自动带上cookie传递
  credentials: "include"
}).then(res => {
  return res.json();
}).then(resp => {
  console.log("post: ", resp);
})