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

