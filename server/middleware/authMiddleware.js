const jwt = require('jsonwebtoken')
const apiError = require("../error/apierror");

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization || ""
        if (!token) {
            return next(apiError.Unauthorized("Unauthorized"));
        }
        const decoded = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY)
        req.user = decoded
        next()
    } catch (e) {
        return next(apiError.Unauthorized("Unauthorized"));
    }
};
