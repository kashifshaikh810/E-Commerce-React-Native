const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err?.message || "Internal Server Error";

  // wrong mongodb userId error
  if (err.name === "CastError") {
    const msg = `Resourse not found. Invalid: ${err.path}`;
    err = new ErrorHandler(msg, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate Email Entered`;
    err = new ErrorHandler(message, 400);
  }

  // wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const msg = `Json Web Token is invalid, try again`;
    err = new ErrorHandler(msg, 400);
  }

  // jwt expire error
  if (err.name === "TokenExpiredError") {
    const msg = `Json Web Token is Expired, try again`;
    err = new ErrorHandler(msg, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err?.message,
    statusCode: err.statusCode,
  });
};
