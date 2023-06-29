"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Feedback.belongsTo(models.User, { foreignKey: 'user_id', as: "customer" });

      Feedback.belongsTo(models.User, { foreignKey: 'driver_id', as: "driver" });

      // Feedback.belongsTo(models.Order, { foreignKey: 'order_id' }, {
      //   onDelete: "CASCADE",
      //   onUpdate: "CASCADE"
      // });
    }
  }
  Feedback.init(
    {
      user_id: DataTypes.INTEGER,
      driver_id: DataTypes.INTEGER,
      order_id: DataTypes.INTEGER,
      stars: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Feedback",
    }
  );
  return Feedback;
};