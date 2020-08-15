const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');

const { db } = require('../configs/config.js');
const { ErrorHandler, ErrorParser } = require('../lib/errors.js');
const { generateToken } = require('../lib/jwt.js');

const dbConnection = new Sequelize(`mysql://${db.user}:${db.pass}@${db.host}:${db.port}/${db.name}`);

const login = async(req, res) => {

    try {
        const { user, pass } = req.body;

        console.log(req.body);

        if (!user || !pass) throw ErrorHandler('MISSING_PARAMETER', 'User and Pass are required');

        const [data] = await dbConnection.query(
            `SELECT 
                * 
            FROM 
                users 
            WHERE 
                (user='${user}' OR email='${user}') AND pass='${pass}'`, { raw: true, type: QueryTypes.SELECT }
        );

        if (!data) throw ErrorHandler('OK', 'User not found.');

        // The token only gets assigned to the admin user to validate secure endpoints
        if (data.admin === 1) {
            data.token = generateToken(data);
        }

        return res.status(200).json(data);

    } catch (err) {
        return ErrorParser(err, res);
    }
}

const register = async(req, res) => {

    try {

        const { name, user, pass, email, address, phone } = req.body;

        if (!name || !user || !pass || !email || !address || !phone) throw ErrorHandler('MISSING_PARAMETER', 'All fields are required.');

        const [createdId] = await dbConnection.query(
            `INSERT INTO users (
                name,
                user,
                email,
                pass,
                address,
                phone
            ) VALUES (
                '${name}',
                '${user}',
                '${email}',
                '${pass}',
                '${address}',
                '${phone}'
            )`, { raw: true, type: QueryTypes.INSERT }
        );

        if (!createdId) throw ErrorHandler('SERVER_ERROR', 'There was an error during your registration process.');

        const [data] = await dbConnection.query(
            `SELECT
                *
            FROM
                users
            WHERE
                id='${createdId}'`, { raw: true, type: QueryTypes.SELECT }
        );

        if (!data || data.length === 0) throw ErrorHandler('OK', 'User not found.');

        return res.status(200).json(data);

    } catch (err) {
        return ErrorParser(err, res);
    }
}

module.exports = {
    login,
    register
}