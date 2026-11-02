const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "techfest_jwt_secret_dev_key";

// Checks that the request carries a valid JWT via Cookie or Authorization header
function auth(req, res, next) {
  let token = null;

  // 1. Check HttpOnly cookie first (secure storage)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Check Authorization Bearer header as fallback
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Authentication required. Please login first." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Runs after auth: only admins may continue
function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access forbidden: Admins only" });
  }
  next();
}

module.exports = { auth, adminOnly };
