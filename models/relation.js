// 设置模型关系
const Class = require('./entity/Class');
const Student = require('./entity/Student')
// 外键联系
Class.hasMany(Student);
// 不反向关联，导致mock时，觉得Student模型没有ClassId属性，导入不了数据
Student.belongsTo(Class);