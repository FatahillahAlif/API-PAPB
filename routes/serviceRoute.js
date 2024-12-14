const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware');
const { addService, getAllServices, getServiceById, updateService, deleteService } = require('../controllers/serviceController');
const router = express.Router()

// Route untuk Service
router.post('/', authMiddleware, addService);
router.get('/services', authMiddleware, getAllServices);
router.get('/:serviceId', authMiddleware, getServiceById);
router.put('/:serviceId', authMiddleware, updateService);
router.delete('/:serviceId', authMiddleware, deleteService);

module.exports = router