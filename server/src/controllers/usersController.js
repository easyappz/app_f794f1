const mongoose = require('mongoose');
const User = require('@src/models/User');

function createError(statusCode, message, details) {
  const err = new Error(message);
  err.statusCode = statusCode;
  if (details) err.details = details;
  return err;
}

function normalizeSpaces(str) {
  return String(str || '').replace(/\s+/g, ' ').trim();
}

function base64SizeInBytes(input) {
  if (!input) return 0;
  const str = String(input);
  const commaIdx = str.indexOf(',');
  const pure = commaIdx >= 0 ? str.slice(commaIdx + 1) : str;
  try {
    return Buffer.byteLength(pure, 'base64');
  } catch (e) {
    // If invalid base64, return a large number to trigger validation error upstream
    return Number.MAX_SAFE_INTEGER;
  }
}

const LIMITS = {
  displayNameMin: 2,
  displayNameMax: 50,
  bioMax: 300,
  avatarMaxBytes: 1_000_000, // 1MB
};

async function getMe(userId) {
  if (!userId) {
    throw createError(401, 'Unauthorized');
  }
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    throw createError(400, `Invalid user id: ${err.message}`);
  }
  if (!user) {
    throw createError(404, 'User not found');
  }
  return user.toClient(true);
}

async function updateMe(userId, payload = {}) {
  if (!userId) {
    throw createError(401, 'Unauthorized');
  }

  const updates = {};
  const { displayName, bio, avatarBase64 } = payload;

  if (displayName !== undefined) {
    const dn = normalizeSpaces(displayName);
    if (dn.length < LIMITS.displayNameMin || dn.length > LIMITS.displayNameMax) {
      throw createError(
        400,
        `displayName must be between ${LIMITS.displayNameMin} and ${LIMITS.displayNameMax} characters`
      );
    }
    updates.displayName = dn;
  }

  if (bio !== undefined) {
    const b = normalizeSpaces(bio);
    if (b.length > LIMITS.bioMax) {
      throw createError(400, `bio must be at most ${LIMITS.bioMax} characters`);
    }
    updates.bio = b;
  }

  if (avatarBase64 !== undefined) {
    if (avatarBase64 === '' || avatarBase64 === null) {
      updates.avatarBase64 = '';
    } else if (typeof avatarBase64 === 'string') {
      const size = base64SizeInBytes(avatarBase64);
      if (size > LIMITS.avatarMaxBytes) {
        throw createError(400, 'Avatar exceeds 1MB limit');
      }
      updates.avatarBase64 = avatarBase64.trim();
    } else {
      throw createError(400, 'avatarBase64 must be a string with base64 data or empty string to clear');
    }
  }

  let updated;
  try {
    updated = await User.findByIdAndUpdate(userId, updates, { new: true });
  } catch (err) {
    throw createError(400, `Update failed: ${err.message}`);
  }
  if (!updated) {
    throw createError(404, 'User not found');
  }
  return updated.toClient(true);
}

async function getById(id) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw createError(404, 'User not found');
  }
  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    throw createError(400, `Invalid id: ${err.message}`);
  }
  if (!user) {
    throw createError(404, 'User not found');
  }
  // Public profile: hide email
  return user.toClient(false);
}

module.exports = {
  getMe,
  updateMe,
  getById,
};
