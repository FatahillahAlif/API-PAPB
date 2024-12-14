const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware');
const { addBarber, deleteBarber, editBarber, getAllBarbers } = require('../controllers/barberController');
const router = express.Router()
const upload = require('../middlewares/multerMiddleware');

// Route untuk Admin
router.post('/', authMiddleware, upload.single('image'), addBarber);
router.get('/', authMiddleware, getAllBarbers);
router.delete('/:barberId', authMiddleware, deleteBarber);
router.put('/:barberId', authMiddleware, upload.single('image'), editBarber);

module.exports = router