const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const { db } = require('../configs/config.js');

const dbConnection = new Sequelize(`mysql://${db.user}:${db.pass}@${db.host}:${db.port}/${db.name}`);

const getAll = async(req, res) => {

    try {
        const data = await dbConnection.query(
            `SELECT * FROM products`, { raw: true, type: QueryTypes.SELECT }
        );

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

const create = async(req, res) => {

    try {
        const { name, price, image, fav } = req.body;

        if (!name || !price) throw 'Missing name or price fields.';

        const [createdId] = await dbConnection.query(
            `INSERT INTO products (
                name,
                price,
                image,
                fav
            ) VALUES (
                '${name}',
                '${price}',
                '${image}',
                ${fav}
            )`, { raw: true, type: QueryTypes.INSERT }
        );

        const [data] = await dbConnection.query(
            `SELECT
                * 
            FROM 
                products 
            WHERE 
                id=${createdId}`, { raw: true, type: QueryTypes.SELECT }
        );

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

const update = async(req, res) => {

    try {
        const { id } = req.params;
        const { name, price, image, fav } = req.body;

        if (!id) throw 'Product not found.';

        await dbConnection.query(
            `UPDATE 
                products 
            SET
                name='${name}',
                price='${price}',
                image='${image}',
                fav=${fav}
            WHERE 
                id=${id}`, { raw: true, type: QueryTypes.UPDATE }
        );

        const [data] = await dbConnection.query(
            `SELECT 
                * 
            FROM 
                products 
            WHERE 
                id=${id}`, { raw: true, type: QueryTypes.SELECT }
        );
        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

const remove = async(req, res) => {

    try {
        const { id } = req.params;

        if (!id) throw 'Product not found.';

        await dbConnection.query(
            `DELETE FROM 
                products
            WHERE 
                id=${id}`, { raw: true, type: QueryTypes.DELETE }
        );

        return res.status(200);

    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

module.exports = {
    getAll,
    create,
    update,
    remove
}