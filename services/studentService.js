const { Op } = require('sequelize');
const Student = require('../models/entity/Student');

exports.addStudent = async function (stuArr, operatorId) {
  // 操作权限
  if (operatorId) { }
  // 判断新用户的信息是否合理
  const ins = await Student.bulkCreate(stuArr);
  return ins;
}

exports.deleteStudent = async function (id, operatorId) {
  // 操作权限
  if (operatorId) { }

  const res = Student.destroy({
    where: {
      id
    }
  })
  return res;
}

exports.updateStudent = async function (id, stuObj, operatorId) {
  // 操作权限
  if (operatorId) { }

  const res = await Student.update(stuObj, {
    where: {
      id,
    }
  })
  return res;
}

// 获取所有学生
exports.getStudents = async function (page = 1, limit = 10, sex = -1, name = '') {
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
      [Op.like]: `%${name}%`
    };
  }
  const res = await Student.findAndCountAll({
    where: condition,
    offset: (page - 1) * limit,
    limit: +limit,
    attributes: ["id", "name", "birthday"] // 需要的属性
  })
  return {
    total: res.count,
    data: JSON.parse(JSON.stringify(res.rows))
  };
}