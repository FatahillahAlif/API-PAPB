const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware');
const { addSchedule, updateSchedule, deleteSchedule, getBarberSchedules, getAllBarbers } = require('../controllers/scheduleController');
const router = express.Router()

// Route untuk Jadwal Barber
router.post('/barber/:barberId', authMiddleware, addSchedule);
router.put('/:scheduleId', authMiddleware, updateSchedule);
router.delete('/:scheduleId', authMiddleware, deleteSchedule);
router.get('/barber/:barberId', authMiddleware, getBarberSchedules);
router.get('/barbers', authMiddleware, getAllBarbers);

module.exports = router