'use strict';
const {
  Model
} = require('sequelize');
const { Pay } = require('../services/stripe');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.User, { foreignKey: "user_id", as: 'customer' });
      // Payment.hasOne(models.Order, { foreignKey: 'order_id' },{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' });
      Payment.belongsTo(models.Order, { foreignKey: 'order_id',targetKey:'order_id' });
    }
  }
  Payment.init({
    user_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    last4:DataTypes.INTEGER,
    paid: {
      type: DataTypes.INTEGER,
      comment: "0->pending\n1->paid"
    },
    stripe_payment_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};