const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller.js');

router.post('/login', usersController.login);

router.post('/', usersController.register);

module.exports = router;