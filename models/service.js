'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      // Asosiasi dengan Booking
      this.hasMany(models.Booking, {
        foreignKey: 'service_id',
        as: 'bookings',
      });
    }
  }

  Service.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Service',
  });

  return Service;
};
