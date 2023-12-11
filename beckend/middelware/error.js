const Errorhandler = require("../utils/errrorhandeler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";

  if (err.name === "castError") {
    const message = `Resources not found. invalid: ${err.path}`;
    err = new Errorhandler(message, 400);
  }

  if (err.code === 11000) {
    const message = `duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new Errorhandler(message, 400);
  }

  if (err.name === "jsonWebTokenError") {
    const message = `Json web token is invalid, try again`;
    err = new Errorhandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is Expired, try again`;
    err = new Errorhandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
