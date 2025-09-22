const express = require('express');
const router = express.Router();
const getAIFallback = require('../services/aiFallback');

// GET /expand?subtopics[]=AI
router.get('/', async (req, res) => {
  try {
    const { subtopics = [] } = req.query;
    const recommendations = await getAIFallback(subtopics);
    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
