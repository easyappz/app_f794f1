const express = require('express');

const authRouter = require('@src/routes/auth');
const usersRouter = require('@src/routes/users');
const postsRouter = require('@src/routes/posts');
const authController = require('@src/controllers/authController');
const validate = require('@src/middlewares/validate');

const router = express.Router();

// Basic status endpoint for API root
router.get('/status', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth endpoints
router.post('/auth/register', validate.register, async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body || {};
    const result = await authController.register(email, password, displayName);
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
});

router.post('/auth/login', validate.login, async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const result = await authController.login(email, password);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
});

// Attach sub-routers
router.use('/auth', authRouter);
router.use('/users', usersRouter); // /api/users -> users routes (me, update, get by id)
router.use('/posts', postsRouter);

module.exports = router;
