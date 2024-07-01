const Mock = require("mockjs");
require('../services/init');


const res = Mock.mock({
  "data|50-100": [
    {
      // 'id|+1': 1, // 从1开始递增
      name: "@cname",
      birthday: "@date",
      "sex|1-2": true,
      mobile: /1\d{10}/,
      location: "@city(true)",
      "ClassId|1-7": 0 // 刚刚创建了7个班，外键
    }
  ]
});

// const Student = require('../models/entity/Student');
// Student.bulkCreate(res.data);

const stuServ = require('../services/studentService');
// 关联，不然缺少ClassId的设置
require('../models/relation');

stuServ.addStudent(res.data);
