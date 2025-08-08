const express = require('express');
const router = express.Router();

// Placeholder: GET /api/users
router.get('/', (req, res) => {
  res.json({ success: true, section: 'users', message: 'Users placeholder' });
});

module.exports = router;
