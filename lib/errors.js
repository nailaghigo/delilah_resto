const errorTypes = {
    OK: 200,
    NO_RESULTS: 204,
    MISSING_PARAMETER: 400,
    NO_PERMISSIONS: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
}

const ErrorHandler = (type, message) => {
    return {
        code: errorTypes[type],
        message
    };
}

const ErrorParser = (err, res) => {
    const code = err.code || 500;
    const message = err.message || err;

    return res.status(code).json({ message });
}

module.exports = {
    ErrorHandler,
    ErrorParser
}