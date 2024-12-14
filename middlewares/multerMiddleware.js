const multer = require('multer');
const path = require('path');

// Tentukan penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Fungsi untuk memeriksa apakah file adalah gambar
// const fileFilter = (req, file, cb) => {
//   const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('File bukan gambar!'), false);
//   }
// };

const upload = multer({ storage });

module.exports = upload;