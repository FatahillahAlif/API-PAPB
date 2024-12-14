const { Barber, BarberSchedule } = require("../models");

const barberController = {
  // Fungsi untuk admin menambahkan barber beserta jadwal
  addBarber: async (req, res) => {
    try {
      // Verifikasi apakah pengguna adalah admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Akses ditolak! Hanya admin yang dapat menambahkan barber." });
      }

      // Mendapatkan data barber dari body request
      const { name, description, position, schedules } = req.body;

      // Validasi jika file gambar tidak ada
      if (!req.file) {
        return res.status(400).json({ message: "File gambar wajib diunggah!" });
      }

      // Mendapatkan URL gambar dari req.file
      const image_url = `/uploads/images/${req.file.filename}`;

      // Validasi input barber
      if (!name || !description || !position) {
        return res.status(400).json({ message: "Semua field barber harus diisi!" });
      }

      // Mengonversi dan memvalidasi jadwal
      let parsedSchedules = [];
      try {
        if (typeof schedules === 'string') {
          parsedSchedules = JSON.parse(schedules); // Mengubah string JSON menjadi array
        } else {
          parsedSchedules = schedules; // Jika sudah berupa array, tidak perlu diubah
        }
      } catch (error) {
        return res.status(400).json({ message: "Format schedules tidak valid!" });
      }

      // Menambahkan barber baru ke database
      const newBarber = await Barber.create({
        name,
        description,
        image_url,
        position,
      });

      // Jika ada jadwal, tambahkan jadwalnya
      if (parsedSchedules && parsedSchedules.length > 0) {
        const schedulePromises = parsedSchedules.map(schedule =>
          BarberSchedule.create({
            barber_id: newBarber.id,
            day_of_week: schedule.day_of_week,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
          })
        );
        await Promise.all(schedulePromises);
      }

      res.status(201).json({
        message: "Barber beserta jadwal berhasil ditambahkan!",
        barber: {
          id: newBarber.id,
          name: newBarber.name,
          description: newBarber.description,
          image_url: newBarber.image_url,
          position: newBarber.position,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  // Fungsi untuk admin menghapus barber beserta jadwalnya
  deleteBarber: async (req, res) => {
    try {
      const { barberId } = req.params;  // Mendapatkan barberId dari parameter URL
  
      // Verifikasi apakah pengguna adalah admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Akses ditolak! Hanya admin yang dapat menghapus barber." });
      }
  
      // Cari barber berdasarkan ID dan sertakan jadwal dengan alias yang benar
      const barber = await Barber.findByPk(barberId, {
        include: {
          model: BarberSchedule,
          as: 'schedules',  // Menambahkan alias sesuai dengan yang didefinisikan
        },
      });
  
      if (!barber) {
        return res.status(404).json({ message: "Barber tidak ditemukan!" });
      }
  
      // Hapus jadwal terkait barber
      await BarberSchedule.destroy({ where: { barber_id: barberId } });
  
      // Hapus barber dari database
      await barber.destroy();
  
      res.status(200).json({
        message: "Barber beserta jadwal berhasil dihapus!",
        barber: {
          id: barber.id,
          name: barber.name,
          description: barber.description,
          image_url: barber.image_url,
          position: barber.position,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  // Fungsi untuk admin mengedit barber beserta jadwalnya
  editBarber: async (req, res) => {
    try {
      const { barberId } = req.params;
      const { name, description, position, schedules } = req.body;

      // Verifikasi apakah pengguna adalah admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Akses ditolak! Hanya admin yang dapat mengedit barber." });
      }

      // Cari barber berdasarkan ID
      const barber = await Barber.findByPk(barberId, {
        include: {
          model: BarberSchedule,
          as: 'schedules',
          attributes: ['day_of_week', 'start_time', 'end_time'],
        }
      });
      if (!barber) {
        return res.status(404).json({ message: "Barber tidak ditemukan!" });
      }

      // Update data barber jika ada perubahan
      barber.name = name || barber.name;
      barber.description = description || barber.description;
      barber.position = position || barber.position;

      // Cek apakah ada file gambar yang diupload
      if (req.file) {
        // Gambar baru ditemukan, update image_url
        barber.image_url = `/uploads/images/${req.file.filename}`;
      }

      // Simpan perubahan ke database
      await barber.save();

      // Update jadwal barber jika ada perubahan jadwal
      if (schedules && schedules.length > 0) {
        let parsedSchedules = [];
        try {
          if (typeof schedules === 'string') {
            parsedSchedules = JSON.parse(schedules);
          } else {
            parsedSchedules = schedules;
          }
        } catch (error) {
          return res.status(400).json({ message: "Format schedules tidak valid!" });
        }

        // Hapus jadwal lama dan tambahkan jadwal baru
        await BarberSchedule.destroy({ where: { barber_id: barberId } });

        const schedulePromises = parsedSchedules.map(schedule =>
          BarberSchedule.create({
            barber_id: barberId,
            day_of_week: schedule.day_of_week,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
          })
        );
        await Promise.all(schedulePromises);
      }

      res.status(200).json({
        message: "Barber dan jadwal berhasil diperbarui!",
        barber: {
          id: barber.id,
          name: barber.name,
          description: barber.description,
          image_url: barber.image_url,
          position: barber.position,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  // Fungsi untuk mengambil semua data barber beserta jadwalnya
  getAllBarbers: async (req, res) => {
    try {
      const barbers = await Barber.findAll({
        include: {
          model: BarberSchedule,
          as: "schedules", // Sesuaikan dengan alias di model
          attributes: ["day_of_week", "start_time", "end_time"],
        }
      });

      res.status(200).json({
        message: "Semua barber beserta jadwal berhasil diambil!",
        barbers,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },
};

module.exports = barberController;