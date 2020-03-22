'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('covid_data', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date_in: {
        type: Sequelize.DATE
      },
      total_case: {
        type: Sequelize.INTEGER
      },
      hospital: {
        type: Sequelize.INTEGER
      },
      recover: {
        type: Sequelize.INTEGER
      },
      death: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('covid_data');
  }
};