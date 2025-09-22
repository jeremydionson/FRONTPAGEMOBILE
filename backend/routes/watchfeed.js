const express = require('express');
const router = express.Router();
const Video = require('../models/video');
const getAIFallback = require('../services/aiFallback');

// GET /watchfeed?topics[]=Tech&subtopics[]=AI
router.get('/', async (req, res) => {
  try {
    const { topics = [], subtopics = [] } = req.query;

    let videos = await Video.getByTopicsSubtopics(topics, subtopics);

    if (videos.length === 0) {
      videos = await getAIFallback(subtopics);
    }

    res.json({ videos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
