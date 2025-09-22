const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const Video = require('../models/video');
const User = require('../models/user');
const getAIFallback = require('../services/aiFallback');

// GET /feed?user_id=123
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;

    const user = await User.getById(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const topics = user.selected_topics;
    const subtopics = user.selected_subtopics;
    const subscriptions = user.selected_subscriptions || [];

    let articles = await Article.getByTopicsSubtopics(topics, subtopics);
    let videos = await Video.getByTopicsSubtopics(topics, subtopics);

    // Filter articles by user subscriptions if any
    if (subscriptions.length > 0) {
      articles = articles.filter(article => subscriptions.includes(article.source));
    }

    // AI fallback if no content
    if (articles.length === 0 && subtopics.length > 0) {
      await getAIFallback(subtopics);
      articles = await Article.getByTopicsSubtopics(topics, subtopics);
    }

    res.json({ articles, videos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
