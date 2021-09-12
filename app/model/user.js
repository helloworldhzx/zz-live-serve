'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true, // 自增
    },
    name: {
      type: STRING(50),
      allowNull: false, // 不能为空
      unique: true, // 不允许有相同值
    },
    age: INTEGER,
    created_time: DATE,
    updated_time: DATE,
  });

  return User;
};
