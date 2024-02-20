const errorHandler = require('./error')
const jwt = require('jsonwebtoken');

function verifyUser(req, res, next) {
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(401,'Unauthorised'))
    }

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) {
            return next(errorHandler(403,'Forbidden'))
        }
        req.user = user;
        next();
    });
};

module.exports = verifyUser;