// app.js - Express application configuration and security middleware
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const logger = require("./middleware/logger");
const errors = require("./middleware/errorHandler");

const app = express();

// ==========================================
// Module 5 Security Configurations (OWASP)
// ==========================================

// 1. Helmet: Sets secure HTTP headers (CSP, HSTS, X-Content-Type-Options, etc.)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "http://localhost:5000", "http://localhost:5173", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// 2. express-mongo-sanitize: Sanitizes input to prevent NoSQL injection by stripping $ and .
app.use(mongoSanitize());

// 3. Cookie parser: reads HttpOnly JWT cookies securely
app.use(cookieParser());

// 4. CORS configuration: allows cross-origin requests from React dev and production URLs
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error("Blocked by CORS policy"));
    },
    credentials: true,
  })
);

// 5. Body parser with strict payload size limits (prevents payload inflation / memory DoS)
app.use(express.json({ limit: "15kb" }));
app.use(express.urlencoded({ extended: true, limit: "15kb" }));

// 6. Request logging middleware
app.use(logger);

// Health check endpoint for Cloud monitoring & CI tests
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "TechFest 2026 API",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    security: {
      helmet: true,
      mongoSanitize: true,
      httpOnlyCookies: true,
      cors: true,
    },
  });
});

// Mount Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));
app.use("/api/registrations", require("./routes/registrations"));
app.use("/api/feedback", require("./routes/feedback"));

// Error handling middleware
app.use(errors.notFound);
app.use(errors.errorHandler);

module.exports = app;
