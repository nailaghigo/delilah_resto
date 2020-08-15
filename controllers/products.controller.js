const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const { db } = require('../configs/config.js');
const { ErrorHandler, ErrorParser } = require('../lib/errors.js');

const dbConnection = new Sequelize(`mysql://${db.user}:${db.pass}@${db.host}:${db.port}/${db.name}`);

const getAll = async(req, res) => {

    try {
        const data = await dbConnection.query(
            `SELECT * FROM products`, { raw: true, type: QueryTypes.SELECT }
        );

        if (!data || data.length === 0) throw ErrorHandler('OK', 'No products available');

        return res.status(200).json(data);

    } catch (err) {
        return ErrorParser(err, res);
    }
}

const create = async(req, res) => {

    try {
        let { name, price, image, fav } = req.body;

        if (!name || !price) throw ErrorHandler('MISSING_PARAMETER', 'Missing name or price fields.');

        if (!image) image = '';
        if (!fav) fav = 0;

        const [productId] = await dbConnection.query(
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

        if (!productId) throw ErrorHandler('SERVER_ERROR', 'There was an error creating the product.');

        const [data] = await dbConnection.query(
            `SELECT
                * 
            FROM 
                products 
            WHERE 
                id=${productId}`, { raw: true, type: QueryTypes.SELECT }
        );

        if (!data || data.length === 0) throw ErrorHandler('OK', 'No products available');

        return res.status(200).json(data);

    } catch (err) {
        return ErrorParser(err, res);
    }
}

const update = async(req, res) => {

    try {
        const { id } = req.params;
        let { name, price, image, fav } = req.body;

        if (!id) throw ErrorHandler('MISSING_PARAMETER', 'Product not found.');

        const [data] = await dbConnection.query(
            `SELECT 
                * 
            FROM 
                products 
            WHERE 
                id=${id}`, { raw: true, type: QueryTypes.SELECT }
        );

        if (!data || data.length === 0) throw ErrorHandler('OK', 'Product not found.');

        const newName = name || data.name,
            newPrice = price || data.price,
            newImage = image || data.image,
            newFav = fav || data.fav;

        await dbConnection.query(
            `UPDATE 
                products 
            SET
                name='${newName}',
                price='${newPrice}',
                image='${newImage}',
                fav=${newFav}
            WHERE 
                id=${id}`, { raw: true, type: QueryTypes.UPDATE }
        );

        return res.status(200).json({ id, newName, newPrice, newImage, newFav });

    } catch (err) {
        return ErrorParser(err, res);
    }
}

const remove = async(req, res) => {

    try {
        const { id } = req.params;

        if (!id) throw ErrorHandler('MISSING_PARAMETER', 'Product not found.');

        await dbConnection.query(
            `DELETE FROM 
                products
            WHERE 
                id=${id}`, { raw: true, type: QueryTypes.DELETE }
        );

        return res.status(200).json({ message: `Product #${id} removed succesfully.` });

    } catch (err) {
        return ErrorParser(err, res);
    }
}

module.exports = {
    getAll,
    create,
    update,
    remove
}