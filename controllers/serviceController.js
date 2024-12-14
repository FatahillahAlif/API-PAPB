const { Service } = require("../models");

const serviceController = {
  // Menambahkan service baru
  addService: async (req, res) => {
    try {
      // Verifikasi apakah pengguna adalah admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Akses ditolak! Hanya admin yang dapat menambahkan service." });
      }

      const { name, description, price } = req.body;

      // Validasi input
      if (!name || !description || !price) {
        return res.status(400).json({ message: "Semua field (name, description, price) harus diisi!" });
      }

      // Tambahkan service baru ke database
      const service = await Service.create({
        name,
        description,
        price,
      });

      res.status(201).json({
        message: "Service berhasil ditambahkan!",
        service,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  // Mendapatkan semua services
  getAllServices: async (req, res) => {
    try {
      const services = await Service.findAll();

      res.status(200).json({
        message: "Semua service berhasil diambil!",
        services,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  // Mendapatkan detail service berdasarkan ID
  getServiceById: async (req, res) => {
    try {
      const { serviceId } = req.params;

      const service = await Service.findByPk(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service tidak ditemukan!" });
      }

      res.status(200).json({
        message: "Service berhasil diambil!",
        service,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  // Mengupdate service
  updateService: async (req, res) => {
    try {
      // Verifikasi apakah pengguna adalah admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Akses ditolak! Hanya admin yang dapat mengupdate service." });
      }

      const { serviceId } = req.params;
      const { name, description, price } = req.body;

      // Cari service berdasarkan ID
      const service = await Service.findByPk(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service tidak ditemukan!" });
      }

      // Update service
      service.name = name || service.name;
      service.description = description || service.description;
      service.price = price || service.price;

      // Simpan perubahan
      await service.save();

      res.status(200).json({
        message: "Service berhasil diperbarui!",
        service,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  // Menghapus service
  deleteService: async (req, res) => {
    try {
      // Verifikasi apakah pengguna adalah admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Akses ditolak! Hanya admin yang dapat menghapus service." });
      }

      const { serviceId } = req.params;

      // Cari service berdasarkan ID
      const service = await Service.findByPk(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service tidak ditemukan!" });
      }

      // Hapus service
      await service.destroy();

      res.status(200).json({ message: "Service berhasil dihapus!" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },
};

module.exports = serviceController;
