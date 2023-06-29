'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TaskDetails.init({
    user_id: DataTypes.INTEGER,
    pickup_from: DataTypes.STRING,
    deliver_to: DataTypes.STRING,
    billing_details: DataTypes.INTEGER,
    instruction: DataTypes.STRING,
    category_item_type: DataTypes.JSON,
    pickup_latitude: DataTypes.STRING,
    pickup_longitude: DataTypes.STRING,
    delivery_latitude: DataTypes.STRING,
    delivery_longitude: DataTypes.STRING,
    distance_km: DataTypes.STRING,
    additional_charge: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TaskDetails',
  });
  return TaskDetails;
};