const sequelize = require("../datebase");

const { DataTypes } = require("sequelize");

module.exports = sequelize.define("Student", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  sex: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING(11),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  createdAt: false,
  updatedAt: false,
  paranoid: true
});