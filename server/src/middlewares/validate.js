const { createHttpError } = require('@src/utils/errors');
const v = require('@src/utils/validation');

const register = (req, res, next) => {
  try {
    const { email, password, displayName } = req.body || {};
    if (!v.isString(email) || !v.isString(password) || !v.isString(displayName)) {
      return next(createHttpError(400, 'Invalid types', { expected: { email: 'string', password: 'string', displayName: 'string' } }));
    }
    const e = v.normalize(email);
    const d = v.normalize(displayName);
    if (!v.isValidEmailBasic(e)) {
      return next(createHttpError(400, 'Invalid email format'));
    }
    if (password.length < 6) {
      return next(createHttpError(400, 'Password must be at least 6 characters'));
    }
    if (d.length < 2 || d.length > 50) {
      return next(createHttpError(400, 'displayName length must be between 2 and 50 chars'));
    }
    req.body.email = e;
    req.body.displayName = d;
    return next();
  } catch (err) {
    return next(createHttpError(400, 'Validation error', { error: err && err.message ? err.message : err }));
  }
};

const login = (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!v.isString(email) || !v.isString(password)) {
      return next(createHttpError(400, 'Invalid types', { expected: { email: 'string', password: 'string' } }));
    }
    const e = v.normalize(email);
    if (!v.isValidEmailBasic(e)) {
      return next(createHttpError(400, 'Invalid email format'));
    }
    if (password.length < 6) {
      return next(createHttpError(400, 'Password must be at least 6 characters'));
    }
    req.body.email = e;
    return next();
  } catch (err) {
    return next(createHttpError(400, 'Validation error', { error: err && err.message ? err.message : err }));
  }
};

const updateMe = (req, res, next) => {
  try {
    const { displayName, bio, avatarBase64 } = req.body || {};

    if (displayName !== undefined) {
      if (!v.isString(displayName)) return next(createHttpError(400, 'displayName must be a string'));
      const d = v.normalize(displayName);
      if (d.length < 2 || d.length > 50) return next(createHttpError(400, 'displayName length must be between 2 and 50 chars'));
      req.body.displayName = d;
    }

    if (bio !== undefined) {
      if (!v.isString(bio)) return next(createHttpError(400, 'bio must be a string'));
      const b = v.normalize(bio);
      if (b.length > 300) return next(createHttpError(400, 'bio max length is 300 chars'));
      req.body.bio = b;
    }

    if (avatarBase64 !== undefined) {
      if (!v.isString(avatarBase64)) return next(createHttpError(400, 'avatarBase64 must be a string'));
      const bytes = v.base64Bytes(avatarBase64);
      if (bytes > v.ONE_MB) return next(createHttpError(400, 'avatarBase64 exceeds 1MB limit', { sizeBytes: bytes, maxBytes: v.ONE_MB }));
    }

    return next();
  } catch (err) {
    return next(createHttpError(400, 'Validation error', { error: err && err.message ? err.message : err }));
  }
};

const createPost = (req, res, next) => {
  try {
    const { text, imageBase64 } = req.body || {};
    if (!v.isString(text)) return next(createHttpError(400, 'text must be a string'));
    const t = v.normalize(text);
    if (t.length < 1 || t.length > 500) return next(createHttpError(400, 'text length must be between 1 and 500 chars'));
    req.body.text = t;

    if (imageBase64 !== undefined && imageBase64 !== null) {
      if (!v.isString(imageBase64)) return next(createHttpError(400, 'imageBase64 must be a string'));
      const bytes = v.base64Bytes(imageBase64);
      if (bytes > v.ONE_MB) return next(createHttpError(400, 'imageBase64 exceeds 1MB limit', { sizeBytes: bytes, maxBytes: v.ONE_MB }));
    }

    return next();
  } catch (err) {
    return next(createHttpError(400, 'Validation error', { error: err && err.message ? err.message : err }));
  }
};

const listQuery = (req, res, next) => {
  try {
    const { cursor, limit } = req.query || {};

    if (cursor !== undefined) {
      const parsed = v.parseCursor(cursor);
      if (!parsed.ok) return next(createHttpError(400, 'Invalid cursor', { hint: 'Use ISO date-time string' }));
    }

    if (limit !== undefined) {
      const parsedLim = v.parseLimit(limit);
      if (!parsedLim.ok) return next(createHttpError(400, 'Invalid limit', { min: 1, max: 50 }));
      req.query.limit = parsedLim.value;
    }

    return next();
  } catch (err) {
    return next(createHttpError(400, 'Validation error', { error: err && err.message ? err.message : err }));
  }
};

module.exports = {
  register,
  login,
  updateMe,
  createPost,
  listQuery,
};
