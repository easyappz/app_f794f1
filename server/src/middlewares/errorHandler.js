const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details !== undefined ? err.details : undefined;

  // Basic logging
  if (status >= 500) {
    console.error('[ERROR]', message, details || '', err.stack || '');
  } else {
    console.warn('[WARN]', message, details || '');
  }

  res.status(status).json({
    message,
    details
  });
};

module.exports = errorHandler;
