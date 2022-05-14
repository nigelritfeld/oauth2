const express = require('express')
const router = express.Router()
const logger = require('../http/middleware/logger')
const UserController = require("../http/controller/userController");

// middleware that is specific to this router
router.use(logger)
// define the home page route
router.get('/', (req, res) => {
    res.render('login')
})
router.post('/user/create/', (req, res) => UserController.createUser(req, res))



module.exports = router
