'use strict';
const {
  Model
} = require('sequelize');
// const { v4: uuidv4 } = require('uuid');

const ROLE = {
  ADMIN: 0,
  DRIVER: 1,
  CUSTOMER: 2,
};

const STATUS = {
  OFF: 0,
  ON: 1,
};

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order, { foreignKey: 'user_id' }, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      });

      User.hasMany(models.User_fcmtoken, { foreignKey: 'user_id', as: 'token' }, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      });

      User.hasMany(models.Card, { foreignKey: "user_id" }, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      });

      User.hasMany(models.Feedback, { foreignKey: "user_id",as:"customer" }, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      });

      User.hasMany(models.Feedback, { foreignKey: "driver_id",as:"driver" }, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      });
      
    }
  }
  User.init({
    calling_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    account_type: {
      type: DataTypes.ENUM(['0', '1', '2']),
      // defaultValue: ROLE.CUSTOMER,
      allowNull: true,
      comment: "0->Admin\n1->Driver\n2->Customer",
    },
    block: {
      type: DataTypes.ENUM(['0', '1']),
      comment: "0->active\n1->block"
    },
    latitude: {
      type: DataTypes.STRING
    },
    longitude: {
      type: DataTypes.STRING
    },
    tokens: {
      type: DataTypes.STRING
    },
    stripe_id: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: STATUS.OFF,
      allowNull: true,
      commnet: "0->Off\n1->On",
    },
    photo_uri: DataTypes.STRING,
    password: DataTypes.STRING,
    last_logged_in: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Timestamp of last login"
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};