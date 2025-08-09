const jwt = require('jsonwebtoken');

// Not using httpOnly cookies; Bearer tokens only
const JWT_SECRET = 'dev_super_secret_change_me_please_123';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  signToken,
  verifyToken,
};
