const express = require('express');
const router = express.Router();
const User = require('../models/user');

// POST /subscription
router.post('/', async (req, res) => {
  try {
    const { user_id, subscriptions } = req.body;
    // subscriptions = ['NY Times', 'WSJ', etc.]
    const updated = await User.update(user_id, { selected_subscriptions: subscriptions });
    res.json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /subscription
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    const user = await User.getById(user_id);
    res.json({ subscriptions: user.selected_subscriptions || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
