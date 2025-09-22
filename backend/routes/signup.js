const express = require('express');
const router = express.Router();
const User = require('../models/user');

// POST /signup
router.post('/', async (req, res) => {
  try {
    const { uid, displayName, email } = req.body;

    // Create user if not exists
    const existingUser = await User.getById(uid);
    if (existingUser) {
      return res.json({ success: true, user: existingUser });
    }

    const newUser = await User.createFromGoogle({
      uid,
      displayName,
      email
    });

    res.json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
