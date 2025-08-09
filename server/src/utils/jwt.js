const jwt = require('jsonwebtoken');

// IMPORTANT: Secret is hardcoded as required by the task (no .env)
const JWT_SECRET = 'EASYAPPZ_JWT_SECRET_4b0f3d0a0fd34e7c92f9a7f2d2f4b6c1';

function signToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '7d' });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
}

module.exports = { JWT_SECRET, signToken, verifyToken };
