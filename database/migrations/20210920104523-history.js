'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE } = Sequelize;
    await queryInterface.createTable('history', {
      id: {
        type: INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      live_id: {
        type: INTEGER(20),
        allowNull: false,
      },
      user_id: {
        type: INTEGER(20),
        allowNull: false,
      },
      created_time: DATE,
      updated_time: DATE,
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('history');
  },
};
