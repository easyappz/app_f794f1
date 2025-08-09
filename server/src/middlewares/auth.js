const { verifyToken } = require('@src/utils/jwt');
const { createHttpError } = require('@src/utils/errors');

const auth = (req, res, next) => {
  try {
    const header = req.headers && req.headers.authorization ? String(req.headers.authorization) : '';
    if (!header) {
      return next(createHttpError(401, 'Unauthorized', { reason: 'Missing Authorization header' }));
    }

    const parts = header.split(' ');
    if (parts.length !== 2 || String(parts[0]).toLowerCase() !== 'bearer' || !parts[1]) {
      return next(createHttpError(401, 'Unauthorized', { reason: 'Expected Bearer token in Authorization header' }));
    }

    const token = parts[1];
    try {
      const payload = verifyToken(token);
      if (!payload || !payload.id) {
        return next(createHttpError(401, 'Unauthorized', { reason: 'Invalid token payload' }));
      }
      req.user = { id: payload.id };
      return next();
    } catch (e) {
      return next(createHttpError(401, 'Unauthorized', { reason: e && e.message ? e.message : 'Token verification failed' }));
    }
  } catch (err) {
    return next(createHttpError(401, 'Unauthorized', { reason: 'Auth middleware error', error: err && err.message ? err.message : err }));
  }
};

module.exports = auth;
