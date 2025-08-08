const express = require('express');
const router = express.Router();

// Placeholder: GET /api/auth
router.get('/', (req, res) => {
  res.json({ success: true, section: 'auth', message: 'Auth placeholder' });
});

module.exports = router;
