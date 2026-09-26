const logger = require('../utils/logger');

function errorMiddleware(err, req, res, next) {
  logger.error(err.message || 'Internal Server Error', err.stack);
  res.status(err.status || 400).json({
    success: false,
    message: err.message || 'An unexpected error occurred'
  });
}

module.exports = errorMiddleware;
