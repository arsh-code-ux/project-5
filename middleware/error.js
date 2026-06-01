// Global Centralized Express Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Print stack traces in local development terminal for debugging
  console.error(`\x1b[31m[Global API Exception Caught]\x1b[0m`, {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Mongoose bad ObjectId format (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with database key: ${err.value}`;
    error = new Error(message);
    error.statusCode = 404;
  }

  // Mongoose duplicate unique key violation (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate value '${value}' entered for field '${field}'. Please use another entry.`;
    error = new Error(message);
    error.statusCode = 400;
  }

  // Mongoose schema schema validations
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new Error(message);
    error.statusCode = 400;
  }

  // Expired JSON Web Tokens
  if (err.name === 'TokenExpiredError') {
    const message = 'Your session token has expired. Please authenticate again.';
    error = new Error(message);
    error.statusCode = 401;
  }

  // Malformed JSON Web Tokens
  if (err.name === 'JsonWebTokenError') {
    const message = 'Malformed session token signature. Access denied.';
    error = new Error(message);
    error.statusCode = 401;
  }

  // Response output
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
