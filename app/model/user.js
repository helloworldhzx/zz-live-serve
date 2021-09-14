'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    id: {
      type: INTEGER(20),
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: STRING(30),
      allowNull: false,
      defaultValue: '',
      comment: '用户名',
      unique: true,
    },
    password: {
      type: STRING,
      allowNull: false,
      defaultValue: '',
      comment: '密码',
    },
    avatar: {
      type: STRING,
      allowNull: true,
      defaultValue: '',
      comment: '头像',
    },
    coin: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '金币',
    },
    created_time: DATE,
    updated_time: DATE,
  });

  return User;
};
