'use strict';
module.exports = app => {
  const { INTEGER, DATE } = app.Sequelize;

  const Follow = app.model.define('follow', {
    id: {
      type: INTEGER(20),
      primaryKey: true,
      autoIncrement: true,
    },
    follow_id: {
      type: INTEGER(20),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
      as: 'Instruments',
      onDelete: 'cascade',
      onUpdate: 'restrict', // 更新时操作
    },
    user_id: {
      type: INTEGER(20),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'restrict', // 更新时操作
    },
    created_time: {
      type: DATE,
      get() {
        return app.formatTime(this.getDataValue('created_time'));
      },
    },
    updated_time: DATE,
  });

  // 关联关系
  Follow.associate = function() {
    // 关联用户
    Follow.belongsTo(app.model.User, { foreignKey: 'follow_id', as: 'follow_user' });
  };
  return Follow;
};
