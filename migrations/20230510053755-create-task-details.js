'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TaskDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      pickup_from: {
        type: Sequelize.STRING
      },
      deliver_to: {
        type: Sequelize.STRING
      },
      category_item_type: {
        type: Sequelize.JSON
      },
      billing_details: {
        type: Sequelize.INTEGER
      },
      instruction: {
        type: Sequelize.STRING
      },
      pickup_latitude: {
        type: Sequelize.STRING
      },
      pickup_longitude: {
        type: Sequelize.STRING
      },
      delivery_latitude: {
        type: Sequelize.STRING
      },
      delivery_longitude: {
        type: Sequelize.STRING
      },
      distance_km: {
        type: Sequelize.STRING
      },
      additional_charge: {
        type: Sequelize.STRING
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TaskDetails');
  }
};