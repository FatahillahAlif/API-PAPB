const { Booking, Barber, BarberSchedule, Service, User } = require("../models");
const { Op } = require("sequelize");

const bookingController = {
  // Menambahkan booking baru
  addBooking: async (req, res) => {
    try {
      const { barberId, serviceId, bookingDate, bookingTime } = req.body;
      const userId = req.user.id;
  
      // Validasi input
      if (!barberId || !serviceId || !bookingDate || !bookingTime) {
        return res.status(400).json({ message: "Semua field harus diisi!" });
      }
  
      // Validasi barber
      const barber = await Barber.findByPk(barberId);
      if (!barber) {
        return res.status(404).json({ message: "Barber tidak ditemukan!" });
      }
  
      // Validasi layanan
      const service = await Service.findByPk(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Layanan tidak ditemukan!" });
      }
  
      // Mendapatkan nama hari dari bookingDate
      const bookingDay = new Date(bookingDate).toLocaleDateString("id-ID", { weekday: "long" });
  
      // Validasi jadwal barber
      const schedule = await BarberSchedule.findOne({
        where: {
          barber_id: barberId,
          day_of_week: bookingDay,
          start_time: { [Op.lte]: bookingTime },
          end_time: { [Op.gte]: bookingTime },
        },
      });
  
      if (!schedule) {
        return res.status(400).json({
          message: "Barber tidak tersedia pada tanggal dan waktu yang dipilih.",
        });
      }
  
      // Perbaikan pengecekan booking yang sudah ada
      const existingBooking = await Booking.findOne({
        where: {
          barber_id: barberId,
          booking_date: {
            [Op.eq]: new Date(bookingDate).toISOString().split('T')[0]
          },
          booking_time: bookingTime,
          service_id: serviceId,
        },
      });
  
      // Jika booking yang sama sudah ada
      if (existingBooking) {
        return res.status(400).json({
          message: "Booking dengan barber yang sama di waktu dan layanan yang sama sudah ada.",
        });
      }
  
      // Membuat booking baru
      const booking = await Booking.create({
        user_id: userId,
        barber_id: barberId,
        service_id: serviceId,
        booking_date: bookingDate,
        booking_time: bookingTime,
        status: "pending",
      });
  
      res.status(201).json({
        message: "Booking berhasil dibuat!",
        booking,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },   

  // Mendapatkan semua booking untuk user tertentu
  getUserBookings: async (req, res) => {
    try {
      const userId = req.user.id;

      const bookings = await Booking.findAll({
        where: { user_id: userId },
        include: [
          { model: Barber, as: 'barber', attributes: ['name'] }, // Menambahkan alias 'barber'
          { model: Service, as: 'service', attributes: ['name', 'price'] }, // Menambahkan alias 'service'
        ],
        attributes: ['booking_date', 'booking_time', 'status'],
      });

      res.status(200).json({
        message: "Booking berhasil diambil!",
        bookings,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  // Mendapatkan riwayat booking untuk user tertentu (termasuk barber, layanan, dan status)
  getBookingHistory: async (req, res) => {
    try {
      const userId = req.user.id;

      const bookings = await Booking.findAll({
        where: { user_id: userId },
        include: [
          { model: Barber, as: 'barber', attributes: ['name'] }, // Menambahkan alias 'barber'
          { model: Service, as: 'service', attributes: ['name', 'price'] }, // Menambahkan alias 'service'
        ],
        order: [['booking_date', 'DESC']], // Urutkan berdasarkan tanggal booking terbaru
      });

      res.status(200).json({
        message: "Riwayat booking berhasil diambil!",
        bookings,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  // Mendapatkan semua booking untuk admin
  getAllBookings: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Akses ditolak! Hanya admin yang dapat melihat semua booking." });
      }

      const bookings = await Booking.findAll({
        include: [
          { model: User, as: 'user', attributes: ['full_name', 'email'] }, // Menambahkan alias 'user'
          { model: Barber, as: 'barber', attributes: ['name'] }, // Menambahkan alias 'barber'
          { model: Service, as: 'service', attributes: ['name', 'price'] }, // Menambahkan alias 'service'
        ],
      });

      res.status(200).json({
        message: "Semua booking berhasil diambil!",
        bookings,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  // Mengupdate status booking (hanya untuk admin)
  updateBookingStatus: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { status } = req.body;

      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Akses ditolak! Hanya admin yang dapat mengubah status booking." });
      }

      const booking = await Booking.findByPk(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking tidak ditemukan!" });
      }

      booking.status = status || booking.status;
      await booking.save();

      res.status(200).json({
        message: "Status booking berhasil diperbarui!",
        booking,
      });
    } catch (error)         {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  // Menghapus booking
  deleteBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;

      const booking = await Booking.findByPk(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking tidak ditemukan!" });
      }

      await booking.destroy();

      res.status(200).json({ message: "Booking berhasil dihapus!" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },
};

module.exports = bookingController;