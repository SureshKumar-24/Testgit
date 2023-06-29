'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Order.belongsTo(models.User, { foreignKey: 'user_id' });
      Order.belongsTo(models.Card, { foreignKey: "card_id" });

      Order.hasMany(models.DriverAcceptReject, { foreignKey: 'order_id' }, { onDelete: 'SET NULL', onUpdate: 'CASCADE' });
      // Order.belongsTo(models.Payment, { foreignKey: 'order_id' })
      Order.hasOne(models.Payment, {
        sourceKey:'order_id',
        foreignKey: 'order_id' }, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      });
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    driver_id: {
      type: DataTypes.INTEGER,
      comment: "0->NoDriver\n1->DriverAssigned"
    },
    pickup_from: DataTypes.STRING,
    deliver_to: DataTypes.STRING,
    billing_details: DataTypes.INTEGER,
    instruction: DataTypes.STRING,
    order_created_time: DataTypes.STRING,
    order_completed_time: DataTypes.STRING,
    category_item_type: DataTypes.JSON,
    order_status: {
      type: DataTypes.STRING,
      comment: "0->Pending\n1->Accepted\n2->Completed\n3->Cancelled",
    },
    order_assign: {
      type: DataTypes.STRING,
      comment: "0->No-Assign\n1->Assign",
    },
    pickup_latitude: DataTypes.STRING,
    pickup_longitude: DataTypes.STRING,
    delivery_latitude: DataTypes.STRING,
    delivery_longitude: DataTypes.STRING,
    distance_km: DataTypes.STRING,
    additional_charge: DataTypes.STRING,
    driver_feedback: DataTypes.INTEGER,
    order_pin: DataTypes.INTEGER,
    pickup_status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};