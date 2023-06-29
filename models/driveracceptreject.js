'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DriverAcceptReject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // DriverAcceptReject.belongsTo(models.User, { foreignKey: 'driver_id' }, {
      //   onDelete: "CASCADE",
      //   onUpdate: "CASCADE"
      // });

      DriverAcceptReject.belongsTo(models.Order)

    }
  }
  DriverAcceptReject.init({
    driver_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    driver_order_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      commnet: "1->Accepted\n2->Completed\n3->Cancelled\n4-Rejected"
    },
  },
    {
      sequelize,
      modelName: 'DriverAcceptReject',
    });
  return DriverAcceptReject;
};
