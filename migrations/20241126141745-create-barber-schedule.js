'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BarberSchedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      barber_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Barbers', // Nama tabel yang dihubungkan
          key: 'id', // Kolom yang menjadi foreign key pada Barbers
        },
        onDelete: 'CASCADE', // Jika Barber dihapus, maka jadwalnya akan dihapus
      },
      day_of_week: {
        type: Sequelize.STRING, // Menyimpan nama hari (misalnya "Senin", "Selasa")
      },
      start_time: {
        type: Sequelize.STRING,
      },
      end_time: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BarberSchedules');
  }
};