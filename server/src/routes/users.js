const express = require('express');
const usersController = require('@src/controllers/usersController');
const postsController = require('@src/controllers/postsController');
const auth = require('@src/middlewares/auth');
const validate = require('@src/middlewares/validate');

const router = express.Router();

// GET /api/users/me - requires auth
router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await usersController.getMe(req.user.id);
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return next(err);
  }
});

// PATCH /api/users/me - requires auth
router.patch('/me', auth, validate.updateMe, async (req, res, next) => {
  try {
    const { displayName, bio, avatarBase64 } = req.body || {};
    const user = await usersController.updateMe(req.user.id, { displayName, bio, avatarBase64 });
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return next(err);
  }
});

// GET /api/users/:id/posts - public user posts with cursor pagination
router.get('/:id/posts', validate.listQuery, async (req, res, next) => {
  try {
    const { cursor, limit } = req.query || {};
    const { posts, nextCursor } = await postsController.listByUser(req.params.id, { cursor, limit });
    return res.status(200).json({ success: true, posts, nextCursor });
  } catch (err) {
    return next(err);
  }
});

// GET /api/users/:id - public profile
router.get('/:id', async (req, res, next) => {
  try {
    const user = await usersController.getById(req.params.id);
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
