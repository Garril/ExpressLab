const sequelize = require("../datebase");

const { DataTypes } = require("sequelize");

const Student = require('./Student');

const Class = sequelize.define("Class", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  openDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  createdAt: false,
  updatedAt: false,
  paranoid: true
});

// 外键联系
Class.hasMany(Student);

module.exports = Class;