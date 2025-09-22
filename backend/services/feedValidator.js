const cron = require('node-cron');
const SubtopicFeed = require('../models/subtopicFeed');
const { fetchRSS } = require('../../utils/rssFetcher');

// Cron job: runs every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('Running Feed Validation Cron...');

  const feeds = await SubtopicFeed.getActiveFeeds();

  for (const feed of feeds) {
    const items = await fetchRSS(feed.feed_url);

    if (items.length >= 3) {
      await SubtopicFeed.updateStatus(feed.id, 'active');
      console.log(`Feed ${feed.feed_url} is active`);
    } else {
      await SubtopicFeed.updateStatus(feed.id, 'inactive');
      console.log(`Feed ${feed.feed_url} marked inactive`);
    }
  }

  console.log('Feed Validation Cron Complete');
});

console.log('Feed Validator Cron Initialized');
