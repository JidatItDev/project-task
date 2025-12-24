const  jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        res.status(401).json({ status: 401, message: "Access Denied. No Token Provided." });
        return;
    }

    try {
        const decoded = jwt.verify(token, "your_secret_key");
        req.user = decoded;
        next(); 
    } catch (error) {
        res.status(403).json({ status: 403, message: "Invalid Token" });
    }
};



module.exports = {
    authenticateToken
};