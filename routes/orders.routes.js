const express = require('express');
const router = express.Router();

const { validateToken } = require('../lib/jwt.js');

const ordersController = require('../controllers/orders.controller.js');

router.get('/', validateToken, ordersController.getAll);

router.get('/:id', validateToken, ordersController.getById);

router.get('/user/:userId', validateToken, ordersController.getAllByUser);

router.post('/', validateToken, ordersController.create);

router.put('/:id', validateToken, ordersController.update);

module.exports = router;