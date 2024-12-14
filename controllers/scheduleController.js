const { Barber, BarberSchedule } = require("../models");

const barberScheduleController = {
  // Menambahkan jadwal untuk barber
  addSchedule: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Akses ditolak! Hanya admin yang dapat menambahkan jadwal." });
      }

      const { barberId } = req.params;
      const { day_of_week, start_time, end_time } = req.body;

      if (!day_of_week || !start_time || !end_time) {
        return res
          .status(400)
          .json({ message: "Semua field (day_of_week, start_time, end_time) harus diisi!" });
      }

      const barber = await Barber.findByPk(barberId);
      if (!barber) {
        return res.status(404).json({ message: "Barber tidak ditemukan!" });
      }

      const schedule = await BarberSchedule.create({
        barber_id: barberId,
        day_of_week,
        start_time,
        end_time,
      });

      res.status(201).json({
        message: "Jadwal berhasil ditambahkan!",
        schedule,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  // Mengupdate jadwal barber
  updateSchedule: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Akses ditolak! Hanya admin yang dapat mengupdate jadwal." });
      }

      const { scheduleId } = req.params;
      const { day_of_week, start_time, end_time } = req.body;

      const schedule = await BarberSchedule.findByPk(scheduleId);
      if (!schedule) {
        return res.status(404).json({ message: "Jadwal tidak ditemukan!" });
      }

      schedule.day_of_week = day_of_week || schedule.day_of_week;
      schedule.start_time = start_time || schedule.start_time;
      schedule.end_time = end_time || schedule.end_time;

      await schedule.save();

      res.status(200).json({
        message: "Jadwal berhasil diperbarui!",
        schedule,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  // Menghapus jadwal barber
  deleteSchedule: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Akses ditolak! Hanya admin yang dapat menghapus jadwal." });
      }

      const { scheduleId } = req.params;

      const schedule = await BarberSchedule.findByPk(scheduleId);
      if (!schedule) {
        return res.status(404).json({ message: "Jadwal tidak ditemukan!" });
      }

      await schedule.destroy();

      res.status(200).json({ message: "Jadwal berhasil dihapus!" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  // Mendapatkan semua jadwal barber tertentu
  getBarberSchedules: async (req, res) => {
    try {
      const { barberId } = req.params;

      const barber = await Barber.findByPk(barberId);
      if (!barber) {
        return res.status(404).json({ message: "Barber tidak ditemukan!" });
      }

      const schedules = await BarberSchedule.findAll({
        where: { barber_id: barberId },
      });

      res.status(200).json({
        message: "Jadwal berhasil diambil!",
        schedules,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  // Mendapatkan semua barber dengan jadwal mereka
  getAllBarbers: async (req, res) => {
    try {
      const barbers = await Barber.findAll({
        include: [
          {
            model: BarberSchedule,
            as: "schedules", // Sesuaikan dengan alias di model
            attributes: ["day_of_week", "start_time", "end_time"],
          },
        ],
      });

      res.status(200).json({
        message: "Semua barber berhasil diambil!",
        barbers,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },
};

module.exports = barberScheduleController;