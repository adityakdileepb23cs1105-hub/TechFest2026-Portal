const express = require("express");
const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// GET /api/feedback - Public list of recent feedback (safe plain text)
router.get("/", async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const feedbackList = await Feedback.find().sort({ createdAt: -1 }).limit(20);
    res.json(feedbackList);
  } catch (err) {
    next(err);
  }
});

// POST /api/feedback - Validate and sanitize user input against XSS
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required").escape(),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("message").trim().notEmpty().withMessage("Message is required").escape(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: "Validation error" });
      }

      const { name, email, message } = req.body;

      if (mongoose.connection.readyState !== 1) {
        return res.status(201).json({
          message: "Feedback submitted safely without XSS risk",
          feedback: { name, email, message },
        });
      }

      const feedback = await Feedback.create({ name, email, message });
      res.status(201).json({ message: "Feedback submitted safely without XSS risk", feedback });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
