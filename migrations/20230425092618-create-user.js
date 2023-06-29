'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      calling_code: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      account_type: {
        type: Sequelize.ENUM(['0', '1', '2']),
        comment: "0->Admin\n1->Driver\n2->Customer"
      },
      block: {
        type: Sequelize.ENUM(['0', '1']),
        comment: "0->active\n1->block"
      },
      latitude: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.STRING
      },
      tokens: {
        type: Sequelize.STRING
      },
      photo_uri: {
        type: Sequelize.STRING
      },
      password:{
        type: Sequelize.STRING
      },
      stripe_id: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER,
        comment: "0->Off\n1->On"
      },
      last_logged_in: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Users');
  }
};