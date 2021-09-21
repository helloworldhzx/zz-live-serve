'use strict';
module.exports = app => {
  const { INTEGER, DATE } = app.Sequelize;

  const History = app.model.define('history', {
    id: {
      type: INTEGER(20),
      primaryKey: true,
      autoIncrement: true,
    },
    live_id: {
      type: INTEGER(20),
      allowNull: false,
      references: {
        model: 'live',
        key: 'id',
      },
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
  History.associate = function() {
    // 关联用户
    History.belongsTo(app.model.User);
    // 关联直播间
    History.belongsTo(app.model.Live);
  };
  return History;
};
