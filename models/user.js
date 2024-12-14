'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Asosiasi dengan model Booking
      this.hasMany(models.Booking, {
        foreignKey: 'user_id',
        as: 'bookings',
      });
    }
  }

  User.init({
    username: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    email: DataTypes.STRING,
    full_name: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'user')
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};