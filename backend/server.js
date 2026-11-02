// server.js - Entry point for the TechFest 2026 Backend
require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/techfest";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully to:", MONGO_URI.replace(/:\/\/[^:]+:[^@]+@/, "://***:***@")))
  .catch((err) => console.error("Database connection error:", err.message));

app.listen(PORT, () => {
  console.log(`TechFest 2026 Secured Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
