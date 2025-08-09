const { verifyToken } = require('@src/utils/jwt');

async function verifyBearerToken(req, res, next) {
  try {
    const header = req.headers['authorization'] || req.headers['Authorization'] || '';

    if (!header || typeof header !== 'string' || !header.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: { message: 'Authorization header missing or malformed' } });
    }

    const token = header.split(' ')[1];
    const decoded = verifyToken(token);

    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, error: { message: err.message } });
  }
}

module.exports = { verifyBearerToken };
