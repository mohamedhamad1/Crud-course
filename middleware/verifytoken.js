const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if (!authHeader) {
        const error = appError.create('token is required', 500, httpStatusText.ERROR);
        next(error);
    }
    const token = authHeader;
    const currentUser = jwt.verify(token, process.env.JWT_SECRET)
    req.currentUser = currentUser;
    next();
}
module.exports = verifyToken;