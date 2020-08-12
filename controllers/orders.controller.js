const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const { db } = require('../configs/config.js');

const dbConnection = new Sequelize(`mysql://${db.user}:${db.pass}@${db.host}:${db.port}/${db.name}`);

const ORDERS_GET_SQL = `
    SELECT 
        orders.*,
        order_details.qty,
        products.name,
        products.price
    FROM
        orders
    JOIN
        order_details ON orders.id = order_details.id_order
    JOIN
        products ON order_details.id_product = products.id`;

const getAll = async(req, res) => {

    try {
        const data = await dbConnection.query(ORDERS_GET_SQL, { raw: true, type: QueryTypes.SELECT });

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

const getById = async(req, res) => {

    try {
        const { id } = req.params;

        if (!id) throw 'Order ID is required.';

        const SQL = `${ORDERS_GET_SQL} WHERE orders.id=${id}`;
        const data = await dbConnection.query(SQL, { raw: true, type: QueryTypes.SELECT });

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

const getAllByUser = async(req, res) => {

    try {
        const { userId } = req.params;

        if (!userId) throw 'User ID is required.';

        const SQL = `${ORDERS_GET_SQL} WHERE orders.id_user=${userId}`;
        const data = await dbConnection.query(SQL, { raw: true, type: QueryTypes.SELECT });

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

const getByIdAndUser = async(req, res) => {

    try {
        const { id, userId } = req.params;

        if (!id || !userId) throw 'User ID and Order ID are required.';

        const SQL = `${ORDERS_GET_SQL} WHERE orders.id=${id} AND orders.id_user=${userId}`;
        const data = await dbConnection.query(SQL, { raw: true, type: QueryTypes.SELECT });

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

const create = async(req, res) => {

    try {
        const { userId, payMethod, total, products } = req.body;

        if (!userId || !payMethod || !total || !products) throw 'All params are required.';

        const [orderId] = await dbConnection.query(
            `INSERT INTO orders (
                id_user,
                pay_method,
                total
            ) VALUES (
                ${userId},
                '${payMethod}',
                ${total}
            )`, { raw: true, type: QueryTypes.INSERT }
        );

        if (!orderId) throw 'There was an error creating your order.';

        const parsedProducts = products.map(product => {
            return `(${orderId}, ${product.id}, ${product.qty})`;
        });

        const [orderDetailInitIndex, orderDetailAmount] = await dbConnection.query(
            `INSERT INTO order_details (
                id_order,
                id_product,
                qty
            ) VALUES ${parsedProducts.join(', ')}`, { raw: true, type: QueryTypes.INSERT }
        );

        if (orderDetailAmount !== products.length) throw 'There was an error creating the order detail.'

        return res.status(200).json(order_details);

    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

const update = async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id) throw 'Missing order id.';
        if (!status) throw 'Missing order status.';

        await dbConnection.query(
            `UPDATE
                orders
            SET
                status='${status}'
            WHERE
                id=${id}`, { raw: true, type: QueryTypes.UPDATE }
        );

        return res.status(200).json({ message: `Order #${id} updated succesfully` });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

module.exports = {
    getAll,
    getById,
    getAllByUser,
    getByIdAndUser,
    create,
    update
}