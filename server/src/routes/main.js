const express = require('express');

const authRouter = require('@src/routes/auth');
const usersRouter = require('@src/routes/users');
const postsRouter = require('@src/routes/posts');

const router = express.Router();

// Basic status endpoint for API root
router.get('/status', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Future sections
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/posts', postsRouter);

module.exports = router;
