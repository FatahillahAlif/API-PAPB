'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Barber extends Model {
    static associate(models) {
      // Asosiasi dengan BarberSchedule
      this.hasMany(models.BarberSchedule, {
        foreignKey: 'barber_id',
        as: 'schedules',
      });

      // Asosiasi dengan Booking
      this.hasMany(models.Booking, {
        foreignKey: 'barber_id',
        as: 'bookings',
      });
    }
  }

  Barber.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    image_url: DataTypes.STRING,
    position: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Barber',
  });

  return Barber;
};
