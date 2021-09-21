'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE } = Sequelize;
    await queryInterface.createTable('follow', {
      id: {
        type: INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      follow_id: {
        type: INTEGER(20),
        allowNull: false,
        comment: '关注人id',
      },
      user_id: {
        type: INTEGER(20),
        allowNull: false,
        comment: '用户id',
      },
      created_time: DATE,
      updated_time: DATE,
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('follow');
  },
};
