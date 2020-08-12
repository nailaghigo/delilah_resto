const express = require('express');
const router = express.Router();

const { validateToken } = require('../configs/jwt.js');

const productsController = require('../controllers/products.controller.js');

router.get('/', productsController.getAll);

router.post('/', validateToken, productsController.create);

router.put('/:id', validateToken, productsController.update);

router.delete('/:id', validateToken, productsController.remove);

module.exports = router;