const jwt = require("jsonwebtoken");
require('dotenv').config()
const User = require("../models/user");

verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }
    const tokenParsed = req.headers.authorization.split(' ')[1];
    jwt.verify(tokenParsed, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findById(req.userId).then((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        User.find(isAdmin = true,
        (err) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            res.status(403).send({ message: "Require Admin Role!" });
            return;
        });
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
};
module.exports = authJwt;