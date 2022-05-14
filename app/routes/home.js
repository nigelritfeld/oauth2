const express = require('express')
const router = express.Router()
const logger = require('../http/middleware/logger')
const response = require('../http/middleware/response')
const request = require('../http/middleware/request')
const UserController = require('../http/controller/userController')

// middleware that is specific to this router
router.use(logger)
// router.use(request)
// router.use(response)
// define the home page route
router.get('/authenticate', (req, res) => UserController.getUser(req, res))
// define the about route
router.get('/about', (req, res) => {
    res.send('About birds')
})

module.exports = router
