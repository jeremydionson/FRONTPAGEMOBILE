const express = require('express');
const router = express.Router();
const User = require('../models/user');

// POST /subtopic-selection
router.post('/', async (req, res) => {
  try {
    const { user_id, selected_subtopics, selected_niches } = req.body;

    // Update user with selected subtopics and niches
    const updated = await User.update(user_id, {
      selected_subtopics,
      selected_niches
    });
    res.json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /subtopic-selection
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    const user = await User.getById(user_id);
    res.json({
      selected_subtopics: user.selected_subtopics,
      selected_niches: user.selected_niches
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
