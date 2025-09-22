const express = require('express');
const router = express.Router();
const SavedContent = require('../models/savedContent');

// POST /save
router.post('/', async (req, res) => {
  try {
    const { user_id, content_id, content_type } = req.body;
    const saved = await SavedContent.add(user_id, content_id, content_type);
    res.json({ success: true, saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
