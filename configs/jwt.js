const jwt = require('jsonwebtoken');
const KEY = 'Del1l4h_R35t0!';

const generateToken = (payload) => {
    return jwt.sign(payload, KEY);
}

const validateToken = (req, res, next) => {
    const token = req.headers['access-token'];

    if (!token) {
        return res.status(403).json({
            message: 'Missing token.'
        });
    }

    jwt.verify(token, KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: 'Invalid token.'
            });
        }

        req.decoded = decoded;
        next();
    });
}

module.exports = {
    generateToken,
    validateToken
}