'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.STRING
      },
      order_id: {
        type: Sequelize.INTEGER
      },
      driver_id: {
        type: Sequelize.INTEGER,
        comment: "0->NoDriver\n1->DriverAssigned"
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
      order_created_time: {
        type: Sequelize.STRING
      },
      order_completed_time: {
        type: Sequelize.STRING
      },
      order_status: {
        type: Sequelize.ENUM(['0', '1', '2', '3']),
        comment: "0->Pending\n1->Accepted\n2->Completed\nCancelled"
      },
      order_assign: {
        type: Sequelize.ENUM(['0', '1']),
        comment: "0->No-Assign\n1->Assign"
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
      driver_feedback: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      pickup_status: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      order_pin: {
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};