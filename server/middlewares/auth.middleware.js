const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized Access!" });
    }

    // If token has "Bearer " prefix (optional), remove it
    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Only attach the user ID, not the whole token payload
    req.user = { _id: decoded.id,id: decoded.id };

    console.log("✅ Decoded token:", decoded);
    next();
  } catch (error) {
    console.error("❌ Token error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
