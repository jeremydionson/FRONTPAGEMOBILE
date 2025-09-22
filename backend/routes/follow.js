const express = require('express');
const router = express.Router();
const Follow = require('../models/follow');

// POST /follow
router.post('/', async (req, res) => {
  try {
    const { user_id, subtopic_id, follow_type } = req.body;
    const follow = await Follow.add(user_id, subtopic_id, follow_type);
    res.json({ success: true, follow });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
