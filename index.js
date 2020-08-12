const express = require('express');
const bodyParser = require('body-parser');

const productRoutes = require('./routes/products.routes.js');
const userRoutes = require('./routes/users.routes.js');
const orderRoutes = require('./routes/orders.routes.js');

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());

app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);

app.listen(3000, () => {
    console.log('Listening on port 3000!');
});