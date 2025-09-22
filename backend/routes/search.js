const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const Video = require('../models/video');

// GET /search?q=AI
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;

    const articles = await Article.getByTopicsSubtopics();
    const videos = await Video.getByTopicsSubtopics();

    // Simple keyword search (later can add AI summary)
    const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(q.toLowerCase()));
    const filteredVideos = videos.filter(v => v.title.toLowerCase().includes(q.toLowerCase()));

    res.json({ articles: filteredArticles, videos: filteredVideos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
