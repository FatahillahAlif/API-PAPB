const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Mendapatkan token dari header Authorization

  if (!token) {
    return res.status(401).json({ message: "Akses ditolak! Token tidak ditemukan." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key"); // Verifikasi token
    req.user = decoded; // Simpan data user dari token (dalam hal ini "id" dan "role")
    next(); // Melanjutkan ke middleware berikutnya atau handler
  } catch (error) {
    return res.status(403).json({ message: "Token tidak valid.", error: error.message });
  }
};

module.exports = authMiddleware;
