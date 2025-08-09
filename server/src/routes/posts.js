const express = require('express');
const postsController = require('@src/controllers/postsController');
const auth = require('@src/middlewares/auth');

const router = express.Router();

// POST /api/posts - create a post (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { text, imageBase64 } = req.body || {};
    const post = await postsController.createPost(req.user.id, { text, imageBase64 });
    return res.status(201).json({ success: true, post });
  } catch (err) {
    const status = err.statusCode || err.status || 400;
    return res.status(status).json({ success: false, error: { message: err.message } });
  }
});

// GET /api/posts - public feed with cursor pagination
router.get('/', async (req, res) => {
  try {
    const { cursor, limit } = req.query || {};
    const { posts, nextCursor } = await postsController.listFeed({ cursor, limit });
    return res.status(200).json({ success: true, posts, nextCursor });
  } catch (err) {
    const status = err.statusCode || err.status || 400;
    return res.status(status).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;
