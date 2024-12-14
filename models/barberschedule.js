'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BarberSchedule extends Model {
    /**
     * Helper method untuk mendefinisikan asosiasi.
     * Metode ini akan dipanggil otomatis oleh `models/index`.
     */
    static associate(models) {
      // Asosiasi banyak ke satu: BarberSchedule dimiliki oleh satu Barber
      this.belongsTo(models.Barber, {
        foreignKey: 'barber_id', // Menunjukkan bahwa barber_id di BarberSchedules merujuk ke Barber
        as: 'barber', // Alias untuk asosiasi ini
      });
    }
  }

  BarberSchedule.init({
    barber_id: DataTypes.INTEGER,
    day_of_week: DataTypes.STRING, // Menggunakan day_of_week sebagai nama hari
    start_time: DataTypes.STRING,
    end_time: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'BarberSchedule',
  });

  return BarberSchedule;
};