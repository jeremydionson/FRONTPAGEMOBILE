require('dotenv').config();
const cron = require('node-cron');
const { fetchAllFeeds } = require('../utils/rssFetcher');

// Cron job schedule: every 30 minutes
const schedule = '*/30 * * * *'; // run every 30 minutes

console.log('🕒 Cron job initialized. Will fetch feeds every 30 minutes.');

// Start cron job
cron.schedule(schedule, async () => {
  console.log('🚀 Cron job running: fetching all feeds...');
  try {
    await fetchAllFeeds();
    console.log('✅ All feeds fetched successfully!');
  } catch (err) {
    console.error('❌ Cron job error:', err.message);
  }
}, {
  scheduled: true,
  timezone: "America/New_York" // adjust to your timezone
});
