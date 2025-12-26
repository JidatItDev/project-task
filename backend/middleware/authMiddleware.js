const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization"); 

  if (!authHeader) {
    return res
      .status(401)
      .json({ status: 401, message: "Access Denied. No Token Provided." });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      status: 403,
      message: "Invalid Token",
      error: error.message, 
    });
  }
};

module.exports = { authenticateToken };
