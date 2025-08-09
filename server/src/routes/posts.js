const express = require('express');
const postsController = require('@src/controllers/postsController');
const auth = require('@src/middlewares/auth');
const validate = require('@src/middlewares/validate');

const router = express.Router();

// POST /api/posts - create a post (auth required)
router.post('/', auth, validate.createPost, async (req, res, next) => {
  try {
    const { text, imageBase64 } = req.body || {};
    const post = await postsController.createPost(req.user.id, { text, imageBase64 });
    return res.status(201).json({ success: true, post });
  } catch (err) {
    return next(err);
  }
});

// GET /api/posts - public feed with cursor pagination
router.get('/', validate.listQuery, async (req, res, next) => {
  try {
    const { cursor, limit } = req.query || {};
    const { posts, nextCursor } = await postsController.listFeed({ cursor, limit });
    return res.status(200).json({ success: true, posts, nextCursor });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
