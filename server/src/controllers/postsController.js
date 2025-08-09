const mongoose = require('mongoose');
const Post = require('@src/models/Post');
const User = require('@src/models/User');
const { createHttpError } = require('@src/utils/errors');
const v = require('@src/utils/validation');

function toAuthorPublic(user) {
  return {
    id: String(user._id),
    email: user.email,
    displayName: user.displayName,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function toPostPublic(post, author) {
  return {
    id: String(post._id),
    author: toAuthorPublic(author || post.author),
    text: post.text,
    imageBase64: post.imageBase64 || null,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

async function createPost(userId, { text, imageBase64 }) {
  try {
    if (!v.isString(text)) throw createHttpError(400, 'text must be a string');
    const t = v.normalize(text);
    if (t.length < 1 || t.length > 500) throw createHttpError(400, 'text length must be between 1 and 500 chars');

    if (imageBase64 !== undefined && imageBase64 !== null) {
      if (!v.isString(imageBase64)) throw createHttpError(400, 'imageBase64 must be a string');
      const bytes = v.base64Bytes(imageBase64);
      if (bytes > v.ONE_MB) throw createHttpError(400, 'imageBase64 exceeds 1MB limit', { sizeBytes: bytes, maxBytes: v.ONE_MB });
    }

    const doc = await Post.create({ author: userId, text: t, imageBase64: imageBase64 || null });
    const author = await User.findById(userId);
    if (!author) throw createHttpError(404, 'User not found');

    return toPostPublic(doc, author);
  } catch (err) {
    if (err && err.status) throw err;
    throw createHttpError(500, 'Failed to create post', { error: err && err.message ? err.message : err });
  }
}

async function listFeed({ cursor, limit }) {
  try {
    const limRes = v.parseLimit(limit !== undefined ? limit : 10);
    const lim = limRes.ok ? limRes.value : 10;

    const query = {};
    if (cursor !== undefined) {
      const parsed = v.parseCursor(cursor);
      if (!parsed.ok) throw createHttpError(400, 'Invalid cursor', { hint: 'Use ISO date-time string' });
      query.createdAt = { $lt: new Date(String(cursor)) };
    }

    const items = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(lim + 1)
      .populate('author');

    const hasMore = items.length > lim;
    const sliced = hasMore ? items.slice(0, lim) : items;
    const posts = sliced.map(p => toPostPublic(p));
    const nextCursor = hasMore ? sliced[sliced.length - 1].createdAt.toISOString() : null;

    return { posts, nextCursor };
  } catch (err) {
    if (err && err.status) throw err;
    throw createHttpError(500, 'Failed to list posts', { error: err && err.message ? err.message : err });
  }
}

async function listByUser(userId, { cursor, limit }) {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) throw createHttpError(404, 'User not found');

    const limRes = v.parseLimit(limit !== undefined ? limit : 10);
    const lim = limRes.ok ? limRes.value : 10;

    const query = { author: userId };
    if (cursor !== undefined) {
      const parsed = v.parseCursor(cursor);
      if (!parsed.ok) throw createHttpError(400, 'Invalid cursor', { hint: 'Use ISO date-time string' });
      query.createdAt = { $lt: new Date(String(cursor)) };
    }

    const items = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(lim + 1)
      .populate('author');

    const hasMore = items.length > lim;
    const sliced = hasMore ? items.slice(0, lim) : items;
    const posts = sliced.map(p => toPostPublic(p));
    const nextCursor = hasMore ? sliced[sliced.length - 1].createdAt.toISOString() : null;

    return { posts, nextCursor };
  } catch (err) {
    if (err && err.status) throw err;
    throw createHttpError(500, 'Failed to list posts by user', { error: err && err.message ? err.message : err });
  }
}

module.exports = { createPost, listFeed, listByUser };
