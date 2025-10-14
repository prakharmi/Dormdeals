// Custom error handling middleware for the Express application.
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes, including the request path and method
  console.error(`[ERROR] ${new Date().toISOString()}`);
  console.error(`Request: ${req.method} ${req.originalUrl}`);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

module.exports = errorHandler;
