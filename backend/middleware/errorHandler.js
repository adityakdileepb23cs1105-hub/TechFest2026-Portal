// Unknown URL
function notFound(req, res) {
  res.status(404).json({ message: "Route not found" });
}

// Central error handler (four parameters: Express recognises it by the extra err)
function errorHandler(err, req, res, next) {
  console.log("ERROR:", err.message);
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid id" });
  }
  res.status(500).json({ message: "Server error" });
}

module.exports = { notFound, errorHandler };
