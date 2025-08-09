function createHttpError(status, message, details) {
  const err = new Error(message || 'Error');
  err.status = status || 500;
  if (details !== undefined) err.details = details;
  return err;
}

module.exports = { createHttpError };
