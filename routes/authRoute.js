const express = require('express')
const { login, register, getProfile, editProfile} = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router()


// Route untuk User
router.post('/login', login)
router.post('/register', register)
router.get('/profile', authMiddleware,  getProfile)
router.put('/profile', authMiddleware, editProfile);



module.exports = router
