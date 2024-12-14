const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authController = {
  login: async (req, res) => {
    try {
      const { email, username, password } = req.body;

      // Validasi input
      if (!password || (!email && !username)) {
        return res
          .status(400)
          .json({ message: "Email/Username dan password harus diisi!" });
      }

      // Cari user berdasarkan email atau username
      let user;
      if (email) {
        user = await User.findOne({ where: { email } });
      } else if (username) {
        user = await User.findOne({ where: { username } });
      }

      // Jika user tidak ditemukan
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan!" });
      }

      // Cek password
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Password salah!" });
      }

      // Generate token JWT
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login berhasil!",
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  // Endpoint untuk mendapatkan profil user berdasarkan token JWT
  getProfile: async (req, res) => {
    try {
      const user = await User.findOne({ where: { id: req.user.id } });

      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan!" });
      }

      res.status(200).json({
        message: "Profil berhasil diambil!",
        user: {
          id: user.id,
          full_name: user.full_name,
          username: user.username,
          email: user.email,
          role: user.role,
          phone_number: user.phone_number,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  // Endpoint untuk mendaftarkan user baru
  register: async (req, res) => {
    try {
      const {
        name,
        username,
        email,
        phone_number,
        password,
        confirm_password,
      } = req.body;

      // Validasi input
      if (
        !name ||
        !username ||
        !email ||
        !phone_number ||
        !password ||
        !confirm_password
      ) {
        return res.status(400).json({ message: "Semua field harus diisi!" });
      }

      // Cek apakah email sudah digunakan
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: "Email sudah terdaftar!" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Simpan user ke database
      const newUser = await User.create({
        full_name: name,
        username,
        email,
        phone_number,
        password_hash: hashedPassword,
        role: "user", // Default ke "user" jika role tidak diisi
      });

      res.status(201).json({
        message: "Registrasi berhasil!",
        user: {
          name: newUser.full_name,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  // Endpoint untuk mengedit profil user
  editProfile: async (req, res) => {
    try {
      const {
        fullName,
        username,
        email,
        phoneNumber,
        password,
        newPassword,
      } = req.body;
      const userId = req.user.id;

      // Cari user berdasarkan ID
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan!" });
      }

      // Validasi dan update password jika diperlukan
      if (password && newPassword) {
        const isPasswordValid = await bcrypt.compare(
          password,
          user.password_hash
        );
        if (!isPasswordValid) {
          return res.status(400).json({ message: "Password lama salah!" });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password_hash = hashedNewPassword;
        await user.save();
      }

      // Validasi email unik jika diedit
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(409).json({ message: "Email sudah digunakan!" });
        }
        user.email = email;
      }

      // Update data profil lainnya
      user.full_name = fullName || user.full_name;
      user.username = username || user.username;
      user.phone_number = phoneNumber || user.phone_number;

      // Simpan perubahan ke database
      await user.save();

      res.status(200).json({
        message: "Profil berhasil diperbarui!",
        user: {
          id: user.id,
          full_name: user.full_name,
          username: user.username,
          email: user.email,
          phone_number: user.phone_number,
          role: user.role,
          password: user.password_hash
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};

module.exports = authController;
