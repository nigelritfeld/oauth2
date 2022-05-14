const express = require('express')
const router = express.Router()
const logger = require('../http/middleware/logger')
const response = require('../http/middleware/response')
const request = require('../http/middleware/request')
const UserController = require('../http/controller/userController')
const DeviceController = require("../http/controller/deviceController");

// Used middlewares for this routes
router.use(logger)
// router.use(request)
router.use(response)

// Routes
router.post('/authorize/', (req, res) => UserController.loginUser(req, res))
router.get('/token/', (req, res) => {
    res.send('Return token')
})
router.post('/register/device/',(req,res)=>DeviceController.registerDevice(req,res))
module.exports = router
