'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Card.belongsTo(models.User, { foreignKey: "user_id" });
      Card.hasMany(models.Order, { foreignKey: 'card_id' }, { onDelete: 'SET NULL', onUpdate: 'CASCADE' });
    }
  }
  Card.init({
    user_id: DataTypes.INTEGER,
    stripe_card_id: DataTypes.STRING,
    card_no: DataTypes.BIGINT,
    name: DataTypes.STRING,
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    is_default: DataTypes.BOOLEAN

  }, {
    sequelize,
    modelName: 'Card',
  });
  return Card;
};