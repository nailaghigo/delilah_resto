const express = require('express');
const router = express.Router();

const { validateToken } = require('../configs/jwt.js');

const ordersController = require('../controllers/orders.controller.js');

router.get('/', validateToken, ordersController.getAll);

router.get('/:id', ordersController.getById);

router.get('/user/:userId', ordersController.getAllByUser);

router.get('/:id/user/:userId', ordersController.getByIdAndUser);

router.post('/', ordersController.create);

router.put('/:id', ordersController.update);

module.exports = router;