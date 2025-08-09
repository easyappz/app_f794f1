const bcrypt = require('bcryptjs');
const User = require('@src/models/User');
const { createHttpError } = require('@src/utils/errors');
const { signToken } = require('@src/utils/jwt');
const v = require('@src/utils/validation');

function toPublicUser(user) {
  return {
    id: String(user._id),
    email: user.email,
    displayName: user.displayName,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function register(email, password, displayName) {
  try {
    const e = v.normalize(email).toLowerCase();
    const d = v.normalize(displayName);
    if (!v.isValidEmailBasic(e)) throw createHttpError(400, 'Invalid email format');
    if (!v.isString(password) || password.length < 6) throw createHttpError(400, 'Password must be at least 6 characters');
    if (d.length < 2 || d.length > 50) throw createHttpError(400, 'displayName length must be between 2 and 50 chars');

    const exists = await User.findOne({ email: e }).lean();
    if (exists) throw createHttpError(409, 'Email already in use');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email: e, passwordHash, displayName: d });

    const token = signToken({ id: String(user._id) });

    return { token, user: toPublicUser(user) };
  } catch (err) {
    if (err && err.status) throw err;
    throw createHttpError(500, 'Registration error', { error: err && err.message ? err.message : err });
  }
}

async function login(email, password) {
  try {
    const e = v.normalize(email).toLowerCase();
    if (!v.isValidEmailBasic(e)) throw createHttpError(400, 'Invalid email format');
    if (!v.isString(password) || password.length < 6) throw createHttpError(400, 'Password must be at least 6 characters');

    const user = await User.findOne({ email: e });
    if (!user) throw createHttpError(401, 'Invalid email or password');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw createHttpError(401, 'Invalid email or password');

    const token = signToken({ id: String(user._id) });
    return { token, user: toPublicUser(user) };
  } catch (err) {
    if (err && err.status) throw err;
    throw createHttpError(500, 'Login error', { error: err && err.message ? err.message : err });
  }
}

module.exports = { register, login };
