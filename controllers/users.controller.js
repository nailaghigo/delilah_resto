const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');

const { db } = require('../configs/config.js');
const { generateToken } = require('../configs/jwt.js');

const dbConnection = new Sequelize(`mysql://${db.user}:${db.pass}@${db.host}:${db.port}/${db.name}`);

const login = async(req, res) => {

    try {
        const { user, pass } = req.body;

        const [data] = await dbConnection.query(
            `SELECT 
                * 
            FROM 
                users 
            WHERE 
                (user='${user}' OR email='${user}') AND pass='${pass}'`, { raw: true, type: QueryTypes.SELECT }
        );

        if (!data) throw 'User not found.';

        // The token only gets assigned to the admin user to validate secure endpoints
        if (data.admin === 1) {
            data.token = generateToken(data);
        }

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

const register = async(req, res) => {

    try {

        const { name, user, pass, email, address, phone } = req.body;

        if (!name || !user || !pass || !email || !address || !phone) throw 'All fields are required.';

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

        const [data] = await dbConnection.query(
            `SELECT
                *
            FROM
                users
            WHERE
                id='${createdId}'`, { raw: true, type: QueryTypes.SELECT }
        );

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

module.exports = {
    login,
    register
}