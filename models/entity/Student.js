const sequelize = require("../datebase");

const { DataTypes } = require("sequelize");
const moment = require("moment");

module.exports = sequelize.define("Student", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      // 访问器：获取时间戳, 不能 this.birthday 循环引用
      const birth = this.getDataValue("birthday"); // 可能为undefined
      if (birth) {
        return birth.getTime();
      }
      return undefined;
    }
  },
  age: {
    type: DataTypes.VIRTUAL,
    get() {
      const now = moment.utc();
      const birth = moment.utc(this.birthday);
      return now.diff(birth, 'y');
    }
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