const Mock = require("mockjs");
const res = Mock.mock({
  "data|3-10": [
    {
      "id|+1": 1,
      name: "第 @id 班", // 空格不能省
      openDate: "@date",
    },
  ],
});

const Class = require('../models/entity/Class');
Class.bulkCreate(res.data);