const Post = require('@src/models/Post');

function createHttpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function normalizeBase64(input) {
  if (typeof input !== 'string') return null;
  const str = input.trim();
  return str.length ? str : null;
}

function estimateBase64Bytes(base64) {
  if (!base64) return 0;
  const commaIndex = base64.indexOf(',');
  const raw = commaIndex >= 0 ? base64.slice(commaIndex + 1) : base64;
  const clean = raw.replace(/[^A-Za-z0-9+/=]/g, '');
  const padding = clean.endsWith('==') ? 2 : clean.endsWith('=') ? 1 : 0;
  const bytes = Math.floor((clean.length * 3) / 4) - padding;
  return bytes < 0 ? 0 : bytes;
}

function userToPublic(u) {
  if (!u) return null;
  return {
    id: u._id.toString(),
    email: u.email,
    displayName: u.displayName,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

function toPostDTO(post) {
  const author = post.author && post.author._id ? post.author : null;
  return {
    id: post._id.toString(),
    text: post.text,
    imageBase64: post.imageBase64 || null,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: author ? userToPublic(author) : undefined,
  };
}

async function createPost(userId, { text, imageBase64 }) {
  try {
    if (!userId) throw createHttpError(401, 'Unauthorized');

    const textValue = typeof text === 'string' ? text.trim() : '';
    if (!textValue) throw createHttpError(400, 'Text is required');
    if (textValue.length < 1 || textValue.length > 500) {
      throw createHttpError(400, 'Text must be between 1 and 500 characters');
    }

    const img = normalizeBase64(imageBase64);
    if (img) {
      const bytes = estimateBase64Bytes(img);
      if (bytes > 1_000_000) {
        throw createHttpError(400, 'Image exceeds 1MB limit');
      }
    }

    const post = await Post.create({ author: userId, text: textValue, imageBase64: img });
    await post.populate('author', 'email displayName createdAt updatedAt');

    return toPostDTO(post);
  } catch (err) {
    throw err;
  }
}

async function listFeed({ cursor, limit }) {
  try {
    let lim = parseInt(limit, 10);
    if (Number.isNaN(lim) || lim < 1) lim = 10;
    if (lim > 50) lim = 50;

    const query = {};
    if (cursor) {
      const d = new Date(cursor);
      if (Number.isNaN(d.getTime())) {
        throw createHttpError(400, 'Invalid cursor. Must be a valid ISO date string');
      }
      query.createdAt = { $lt: d };
    }

    const items = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(lim + 1)
      .populate('author', 'email displayName createdAt updatedAt')
      .exec();

    const hasMore = items.length > lim;
    const sliced = hasMore ? items.slice(0, lim) : items;
    const posts = sliced.map(toPostDTO);
    const lastItem = sliced[sliced.length - 1];
    const nextCursor = hasMore && lastItem ? lastItem.createdAt.toISOString() : null;

    return { posts, nextCursor };
  } catch (err) {
    throw err;
  }
}

async function listByUser(userId, { cursor, limit }) {
  try {
    if (!userId) throw createHttpError(400, 'User id is required');

    let lim = parseInt(limit, 10);
    if (Number.isNaN(lim) || lim < 1) lim = 10;
    if (lim > 50) lim = 50;

    const query = { author: userId };
    if (cursor) {
      const d = new Date(cursor);
      if (Number.isNaN(d.getTime())) {
        throw createHttpError(400, 'Invalid cursor. Must be a valid ISO date string');
      }
      query.createdAt = { $lt: d };
    }

    const items = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(lim + 1)
      .populate('author', 'email displayName createdAt updatedAt')
      .exec();

    const hasMore = items.length > lim;
    const sliced = hasMore ? items.slice(0, lim) : items;
    const posts = sliced.map(toPostDTO);
    const lastItem = sliced[sliced.length - 1];
    const nextCursor = hasMore && lastItem ? lastItem.createdAt.toISOString() : null;

    return { posts, nextCursor };
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createPost,
  listFeed,
  listByUser,
};
