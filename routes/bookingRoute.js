const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

router.post('/', authMiddleware, bookingController.addBooking);
router.get('/user', authMiddleware, bookingController.getUserBookings);
router.get('/history', authMiddleware, bookingController.getBookingHistory);
router.get('/', authMiddleware, bookingController.getAllBookings);
router.put('/status/:bookingId', authMiddleware, bookingController.updateBookingStatus);
router.delete('/:bookingId', authMiddleware, bookingController.deleteBooking);

module.exports = router;