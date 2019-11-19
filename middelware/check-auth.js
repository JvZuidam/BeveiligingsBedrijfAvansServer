const jwt = require('jsonwebtoken');
const responseMessages = require("../responseMessages");


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        next();
    } catch (e) {
        return responseMessages.ErrorCode401Auth(res)
    }


};