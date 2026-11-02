// Prints the time, method and address of every request
function logger(req, res, next) {
  const time = new Date().toLocaleTimeString();
  console.log(time + "  " + req.method + "  " + req.originalUrl);
  next();
}

module.exports = logger;
