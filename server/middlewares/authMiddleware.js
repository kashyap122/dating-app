const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Unauthorized Access!" });
    // Remove "Bearer " if it exists
    if (token.startsWith("")) token = token.slice(7).trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Decoded token:", decoded);
    next();
  } catch (error) {
    console.error("Token error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
