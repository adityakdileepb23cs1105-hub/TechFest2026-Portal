const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "techfest_jwt_secret_dev_key";

// POST /api/auth/register
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required").escape(),
    body("email").isEmail().withMessage("Please enter a valid email address").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: errors.array()[0].msg });
      }

      const { name, email, password } = req.body;

      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "student",
      });

      res.status(201).json({
        message: "Registered successfully",
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: "Invalid email or password format" });
      }

      const { email, password } = req.body;

      // Find user by email string
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Safe Cookie Configuration (Step 5 of Manual):
      // httpOnly: inaccessible via client JavaScript (prevents XSS cookie theft)
      // secure: only transmitted over HTTPS in production
      // sameSite: 'strict' helps prevent Cross-Site Request Forgery (CSRF)
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({
        message: "Login successful",
        token,
        name: user.name,
        role: user.role,
        email: user.email,
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/auth/me - Verify session
router.get("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout - Clear HttpOnly auth cookie
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
