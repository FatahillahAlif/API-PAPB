'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // Asosiasi dengan model User
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      // Asosiasi dengan model Barber
      this.belongsTo(models.Barber, {
        foreignKey: 'barber_id',
        as: 'barber'
      });

      // Asosiasi dengan model Service
      this.belongsTo(models.Service, {
        foreignKey: 'service_id',
        as: 'service'
      });
    }
  }

  Booking.init({
    user_id: DataTypes.INTEGER,
    barber_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER,
    booking_date: DataTypes.DATE,
    booking_time: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Booking',
  });

  return Booking;
};
