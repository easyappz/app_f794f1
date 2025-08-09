const jwt = require('jsonwebtoken');

// NOTE: No .env files. Use a constant as required.
const JWT_SECRET = 'JWT_SECRET_123456_CHANGE_ME';

module.exports = function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: { message: 'Unauthorized: Missing Bearer token' } });
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      return res.status(401).json({ success: false, error: { message: 'Unauthorized: Empty token' } });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ success: false, error: { message: 'Unauthorized: Invalid token' } });
    }

    const userId = payload.userId || payload.id || payload.sub;
    if (!userId) {
      return res.status(401).json({ success: false, error: { message: 'Unauthorized: Invalid token payload' } });
    }

    req.user = { id: userId };
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, error: { message: err.message || 'Unauthorized' } });
  }
};
