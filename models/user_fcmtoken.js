'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_fcmtoken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_fcmtoken.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  User_fcmtoken.init({
    user_id: DataTypes.INTEGER,
    fcmtoken: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User_fcmtoken',
  });
  return User_fcmtoken;
};