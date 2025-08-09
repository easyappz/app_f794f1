const express = require('express');
const usersController = require('@src/controllers/usersController');
const postsController = require('@src/controllers/postsController');
const auth = require('@src/middlewares/auth');

const router = express.Router();

// GET /api/users/me - requires auth
router.get('/me', auth, async (req, res) => {
  try {
    const user = await usersController.getMe(req.user.id);
    return res.status(200).json({ success: true, user });
  } catch (err) {
    const status = err.statusCode || err.status || 400;
    return res.status(status).json({ success: false, error: { message: err.message } });
  }
});

// PATCH /api/users/me - requires auth
router.patch('/me', auth, async (req, res) => {
  try {
    const { displayName, bio, avatarBase64 } = req.body || {};
    const user = await usersController.updateMe(req.user.id, { displayName, bio, avatarBase64 });
    return res.status(200).json({ success: true, user });
  } catch (err) {
    const status = err.statusCode || err.status || 400;
    return res.status(status).json({ success: false, error: { message: err.message } });
  }
});

// GET /api/users/:id/posts - public user posts with cursor pagination
router.get('/:id/posts', async (req, res) => {
  try {
    const { cursor, limit } = req.query || {};
    const { posts, nextCursor } = await postsController.listByUser(req.params.id, { cursor, limit });
    return res.status(200).json({ success: true, posts, nextCursor });
  } catch (err) {
    const status = err.statusCode || err.status || 400;
    return res.status(status).json({ success: false, error: { message: err.message } });
  }
});

// GET /api/users/:id - public profile
router.get('/:id', async (req, res) => {
  try {
    const user = await usersController.getById(req.params.id);
    return res.status(200).json({ success: true, user });
  } catch (err) {
    const status = err.statusCode || err.status || 400;
    return res.status(status).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;
