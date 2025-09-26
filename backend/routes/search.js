const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const Video = require('../models/video');

// GET /search?q=AI
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Search endpoint called with query:', req.query);
    const { q } = req.query;

    console.log('📄 Fetching articles...');
    const articles = await Article.getAll();
    console.log(`📄 Found ${articles.length} articles`);

    console.log('🎥 Fetching videos...');
    const videos = await Video.getAll();
    console.log(`🎥 Found ${videos.length} videos`);

    // Simple keyword search (later can add AI summary)
    const filteredArticles = q ? articles.filter(a => a.title.toLowerCase().includes(q.toLowerCase())) : articles;
    const filteredVideos = q ? videos.filter(v => v.title.toLowerCase().includes(q.toLowerCase())) : videos;

    console.log(`✅ Returning ${filteredArticles.length} articles, ${filteredVideos.length} videos`);
    res.json({ articles: filteredArticles, videos: filteredVideos });
  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
