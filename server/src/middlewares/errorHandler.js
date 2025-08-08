const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || undefined;

  res.status(status).json({
    success: false,
    error: {
      message,
      details
    }
  });
};

module.exports = errorHandler;
