const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();

// GET /videos - Get all videos for Watch feed
router.get('/', async (req, res) => {
  try {
    console.log('📹 Fetching videos from database...');

    const snapshot = await db.collection('videos')
      .orderBy('createdAt', 'desc')
      .limit(50) // Limit to 50 most recent videos
      .get();

    if (snapshot.empty) {
      console.log('⚠️ No videos found in database');
      return res.json([]);
    }

    const videos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Ensure publishedAt is properly formatted
      publishedAt: doc.data().publishedAt || doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));

    console.log(`✅ Found ${videos.length} videos`);
    res.json(videos);

  } catch (error) {
    console.error('❌ Error fetching videos:', error);
    res.status(500).json({
      error: 'Failed to fetch videos',
      details: error.message
    });
  }
});

// GET /videos/topic/:topic - Get videos by topic
router.get('/topic/:topic', async (req, res) => {
  try {
    const { topic } = req.params;
    console.log(`📹 Fetching videos for topic: ${topic}`);

    const snapshot = await db.collection('videos')
      .where('topic', '==', topic)
      .orderBy('createdAt', 'desc')
      .limit(30)
      .get();

    const videos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt || doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));

    console.log(`✅ Found ${videos.length} videos for topic: ${topic}`);
    res.json(videos);

  } catch (error) {
    console.error(`❌ Error fetching videos for topic ${req.params.topic}:`, error);
    res.status(500).json({
      error: 'Failed to fetch videos by topic',
      details: error.message
    });
  }
});

// GET /videos/subtopic/:subtopic - Get videos by subtopic
router.get('/subtopic/:subtopic', async (req, res) => {
  try {
    const { subtopic } = req.params;
    console.log(`📹 Fetching videos for subtopic: ${subtopic}`);

    const snapshot = await db.collection('videos')
      .where('subtopic', '==', subtopic)
      .orderBy('createdAt', 'desc')
      .limit(30)
      .get();

    const videos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt || doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));

    console.log(`✅ Found ${videos.length} videos for subtopic: ${subtopic}`);
    res.json(videos);

  } catch (error) {
    console.error(`❌ Error fetching videos for subtopic ${req.params.subtopic}:`, error);
    res.status(500).json({
      error: 'Failed to fetch videos by subtopic',
      details: error.message
    });
  }
});

// GET /videos/search?q=query - Search videos
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchTerm = q.toLowerCase().trim();
    console.log(`🔍 Searching videos for: "${searchTerm}"`);

    // Get all videos and filter client-side for now
    // In production, you'd want to use a proper search service like Algolia
    const snapshot = await db.collection('videos')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const allVideos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt || doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));

    // Filter videos that match the search term
    const filteredVideos = allVideos.filter(video => {
      const searchableText = [
        video.title,
        video.description,
        video.source,
        video.subtopic,
        video.aiSummary
      ].join(' ').toLowerCase();

      return searchableText.includes(searchTerm);
    });

    console.log(`✅ Found ${filteredVideos.length} videos matching "${searchTerm}"`);
    res.json(filteredVideos);

  } catch (error) {
    console.error(`❌ Error searching videos:`, error);
    res.status(500).json({
      error: 'Failed to search videos',
      details: error.message
    });
  }
});

module.exports = router;