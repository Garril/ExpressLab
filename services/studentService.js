const { Op } = require("sequelize");
const validate = require("validate.js");
const moment = require("moment");

const Student = require("../models/entity/Student");
const Class = require("../models/entity/Class");

const { pick } = require('../utils/propertyHelp');

exports.addStudent = async function (stuInfo, operatorId) {
  // 需要显示的属性
  const filterAttrs = ['name', 'birthday', 'sex', 'mobile', 'ClassId'];
  let stuArr = stuInfo;
  // 判断是否为 数组
  if (stuInfo && !Array.isArray(stuInfo)) {
    stuArr = [pick(stuInfo, ...filterAttrs)];
  } else {
    stuArr = stuInfo.map(item => {
      return pick(item, ...filterAttrs)
    })
  }
  // 操作权限
  if (operatorId) {
  }
  // 验证是否存在 classId对应班级
  validate.validators.classExits = async function (value) {
    const res = await Class.findByPk(value);
    if (res) {
      return;
    }
    return `${value} is not exist`;
  };
  // 判断新用户的信息是否合理
  const rule = {
    name: {
      // presence: true // 必填，排除null和undefined，但是空字符串，没排除
      presence: {
        allowEmpty: false, // 排除空白字符串，空对象、空数组等
      },
      type: "string",
      length: {
        minimum: 1,
        maximum: 10,
      },
    },
    birthday: {
      presence: {
        allowEmpty: false,
      },
      datetime: {
        dateOnly: true,
        // 时间的格式太多，需要配置统一时间格式，时间戳 --> init.js
        earliest: +moment.utc().subtract(100, "y"),
        latest: +moment.utc().subtract(5, "y"), // 5年前
      },
    },
    sex: {
      presence: true,
      type: "boolean",
    },
    mobile: {
      presence: {
        allowEmpty: false,
      },
      format: /1\d{10}/,
    },
    ClassId: {
      presence: true,
      // type: "integer", // 字符串是数字，也不支持，严格
      numericality: {
        // 宽松，数字字符串也可以
        onlyInteger: true,
        strict: false,
      },
      classExits: true, // 自定义验证规则
    },
    location: {
      presence: false,
      type: "string",
    },
  };
  // stuObj：单个学生个体信息

  // 自定义验证规则classExits为异步(有数据库查询)，这里同步不适用
  // const res = validate.validate(stuObj, rule);

  try {
    const valiList = stuArr.map((stuObj, index) => {
      return validate.async(stuObj, rule);
    });
    const results = await Promise.allSettled(valiList);

    const succResArr = [];
    const failResArr = [];

    results.forEach((res) => {
      if (res.status === "fulfilled") {
        succResArr.push(res.value);
      } else {
        failResArr.push(res.reason);
        console.log("Validation error:", res.reason);
      }
    });

    // 处理成功的结果
    if (succResArr.length > 0) {
      console.log("All successful validations:", succResArr);
      // 数据库操作
      const ins = await Student.bulkCreate(succResArr);
      return ins;
    }

    // 处理错误日志
    if (failResArr.length > 0) {
      console.log("All validations failed:", failResArr);
      // 记录错误日志...
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};

exports.deleteStudent = async function (id, operatorId) {
  // 操作权限
  if (operatorId) {
  }

  const res = Student.destroy({
    where: {
      id,
    },
  });
  return res;
};

exports.updateStudent = async function (id, stuObj, operatorId) {
  // 操作权限
  if (operatorId) {
  }

  const res = await Student.update(stuObj, {
    where: {
      id,
    },
  });
  return res;
};

// 获取所有学生
exports.getStudents = async function (
  page = 1,
  limit = 10,
  sex = -1,
  name = ""
) {
  // const res = await Student.findAll({
  //   offset: (page - 1) * limit,
  //   limit: +limit
  // });
  // const total = await Student.count()
  // const data = JSON.stringify(res);

  // return {
  //   total, data
  // };
  const condition = {};
  if (sex !== -1) {
    condition.sex = !!sex;
  }
  if (name) {
    condition.name = {
      [Op.like]: `%${name}%`,
    };
  }
  const res = await Student.findAndCountAll({
    where: condition,
    offset: (page - 1) * limit,
    limit: +limit,
    attributes: ["id", "name", "birthday", "sex", "age"], // 需要的属性
  });
  return {
    total: res.count,
    data: JSON.parse(JSON.stringify(res.rows)),
  };
};
