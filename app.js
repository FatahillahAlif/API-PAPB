const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const allRoutes = require('./routes');

const PORT = process.env.PORT || 3000;

// Pastikan folder untuk upload sudah ada
const uploadDir = path.join(__dirname, 'uploads/images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Folder uploads/images berhasil dibuat.');
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware untuk parsing JSON
app.use(express.json());

// Gunakan semua route
app.use(allRoutes);

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});