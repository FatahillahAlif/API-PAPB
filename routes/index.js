const express = require('express')
const route = express.Router()
const authRoute = require('../routes/authRoute')
const barberRoute = require('../routes/barberRoute')
const serviceRoute = require('../routes/serviceRoute')
const scheduleRoute = require('../routes/scheduleRoute')
const bookingRoute = require('../routes/bookingRoute')

route.use('/auth', authRoute)
route.use('/barber', barberRoute)
route.use('/service', serviceRoute)
route.use('/schedule', scheduleRoute)
route.use('/booking', bookingRoute)

module.exports = route