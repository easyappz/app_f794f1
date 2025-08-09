const bcrypt = require('bcryptjs');
const User = require('@src/models/User');
const { signToken } = require('@src/utils/jwt');

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function sanitizeUser(userDoc) {
  return {
    id: userDoc._id.toString(),
    email: userDoc.email,
    displayName: userDoc.displayName,
    createdAt: userDoc.createdAt,
    updatedAt: userDoc.updatedAt,
  };
}

async function register(email, password, displayName) {
  try {
    if (!email || !password || !displayName) {
      const err = new Error('Email, password and displayName are required');
      err.statusCode = 400;
      throw err;
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    if (!isValidEmail(normalizedEmail)) {
      const err = new Error('Invalid email format');
      err.statusCode = 400;
      throw err;
    }

    if (String(password).length < 6) {
      const err = new Error('Password must be at least 6 characters');
      err.statusCode = 400;
      throw err;
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      const err = new Error('Email already in use');
      err.statusCode = 409;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(String(password), salt);

    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      displayName: String(displayName).trim(),
    });

    const token = signToken(user._id.toString());

    return { token, user: sanitizeUser(user) };
  } catch (err) {
    throw err;
  }
}

async function login(email, password) {
  try {
    if (!email || !password) {
      const err = new Error('Email and password are required');
      err.statusCode = 400;
      throw err;
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(String(password), user.passwordHash);
    if (!isMatch) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const token = signToken(user._id.toString());

    return { token, user: sanitizeUser(user) };
  } catch (err) {
    throw err;
  }
}

module.exports = { register, login };
