const mongoose = require('mongoose');
const User = require('@src/models/User');
const { createHttpError } = require('@src/utils/errors');
const v = require('@src/utils/validation');

function toMe(user) {
  return {
    id: String(user._id),
    email: user.email,
    displayName: user.displayName,
    bio: user.bio || '',
    avatarBase64: user.avatarBase64 || '',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function toPublic(user) {
  return {
    id: String(user._id),
    displayName: user.displayName,
    bio: user.bio || '',
    avatarBase64: user.avatarBase64 || '',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function getMe(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) throw createHttpError(404, 'User not found');
    return toMe(user);
  } catch (err) {
    if (err && err.status) throw err;
    throw createHttpError(500, 'Failed to get current user', { error: err && err.message ? err.message : err });
  }
}

async function updateMe(userId, { displayName, bio, avatarBase64 }) {
  try {
    const update = {};
    if (displayName !== undefined) {
      if (!v.isString(displayName)) throw createHttpError(400, 'displayName must be a string');
      const d = v.normalize(displayName);
      if (d.length < 2 || d.length > 50) throw createHttpError(400, 'displayName length must be between 2 and 50 chars');
      update.displayName = d;
    }
    if (bio !== undefined) {
      if (!v.isString(bio)) throw createHttpError(400, 'bio must be a string');
      const b = v.normalize(bio);
      if (b.length > 300) throw createHttpError(400, 'bio max length is 300 chars');
      update.bio = b;
    }
    if (avatarBase64 !== undefined) {
      if (!v.isString(avatarBase64)) throw createHttpError(400, 'avatarBase64 must be a string');
      const bytes = v.base64Bytes(avatarBase64);
      if (bytes > v.ONE_MB) throw createHttpError(400, 'avatarBase64 exceeds 1MB limit', { sizeBytes: bytes, maxBytes: v.ONE_MB });
      update.avatarBase64 = avatarBase64;
    }

    const user = await User.findByIdAndUpdate(userId, update, { new: true });
    if (!user) throw createHttpError(404, 'User not found');
    return toMe(user);
  } catch (err) {
    if (err && err.status) throw err;
    throw createHttpError(500, 'Failed to update current user', { error: err && err.message ? err.message : err });
  }
}

async function getById(id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) throw createHttpError(404, 'User not found');
    const user = await User.findById(id);
    if (!user) throw createHttpError(404, 'User not found');
    return toPublic(user);
  } catch (err) {
    if (err && err.status) throw err;
    throw createHttpError(500, 'Failed to get user by id', { error: err && err.message ? err.message : err });
  }
}

module.exports = { getMe, updateMe, getById };
