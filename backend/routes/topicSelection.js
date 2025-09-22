const express = require('express');
const router = express.Router();
const User = require('../models/user');

// POST /topic-selection
router.post('/', async (req, res) => {
  try {
    const { user_id, selected_topics } = req.body;

    // Update user with selected topics
    const updated = await User.update(user_id, { selected_topics });
    res.json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /topic-selection
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    const user = await User.getById(user_id);
    res.json({ selected_topics: user.selected_topics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
