const express = require('express');
const router = express.Router();

// Placeholder: GET /api/posts
router.get('/', (req, res) => {
  res.json({ success: true, section: 'posts', message: 'Posts placeholder' });
});

module.exports = router;
