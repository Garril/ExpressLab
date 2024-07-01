// 同步数据库
require("./models/sync");

// 验证库 配置
require("./services/init");


const stuServ = require("./services/studentService");
stuServ
  .addStudent(
    [
      {
        name: "测试人",
        // birthday: '2000-3-4 11:23:11'
        birthday: "2000-3-4",
        sex: true,
        mobile: "13311122233",
        ClassId: 2,
      },
      {
        name: "嗯啊人",
        // birthday: '2000-3-4 11:23:11'
        birthday: "2010-3-4",
        sex: true,
        mobile: "13311144455",
        ClassId: 1,
      },
    ],
    ""
  )
  .then((res) => {
    console.log("res: ", res);
  });




stuServ.getStudents().then(res => {
  console.log(res);
})