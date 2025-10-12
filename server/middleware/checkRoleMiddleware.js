const jwt = require('jsonwebtoken')
const apiError = require("../error/apierror");

module.exports = function(role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return next(apiError.Unauthorized("Unauthorized"));
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)

            const userRoles = decoded.role.split(',');
            const requiredRoles = role.split(',');

            const hasRole = userRoles.some(r => requiredRoles.includes(r));

            if (!hasRole) {
                return next(apiError.Unauthorized("Unauthorized"));
            }
            req.user = decoded;
            next()
        } catch (e) {
            return next(apiError.Unauthorized("Unauthorized"));
        }
    };
}
