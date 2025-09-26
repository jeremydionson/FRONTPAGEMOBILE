require('dotenv').config();
const cron = require('node-cron');
const { fetchAllFeeds } = require('../utils/rssFetcher');
const { cleanupOldArticles } = require('../utils/articleCleanup');

// Cron job schedule: every 30 minutes for feeds
const feedSchedule = '*/30 * * * *';

// Cron job schedule: daily cleanup at 2 AM
const cleanupSchedule = '0 2 * * *';

console.log('🕒 Cron jobs initialized:');
console.log('  📡 Feed fetching: every 30 minutes');
console.log('  🧹 Article cleanup: daily at 2 AM');

// Feed fetching cron job
cron.schedule(feedSchedule, async () => {
  const timestamp = new Date().toISOString();
  console.log(`\n🚀 [${timestamp}] Feed cron job running...`);
  
  try {
    await fetchAllFeeds();
    console.log(`✅ [${timestamp}] Feed fetch completed!\n`);
  } catch (err) {
    console.error(`❌ [${timestamp}] Feed cron job error:`, err.message, '\n');
  }
}, {
  scheduled: true,
  timezone: "America/New_York"
});

// Article cleanup cron job
cron.schedule(cleanupSchedule, async () => {
  const timestamp = new Date().toISOString();
  console.log(`\n🧹 [${timestamp}] Cleanup cron job running...`);
  
  try {
    await cleanupOldArticles(30); // Keep articles for 30 days
    console.log(`✅ [${timestamp}] Cleanup completed!\n`);
  } catch (err) {
    console.error(`❌ [${timestamp}] Cleanup cron job error:`, err.message, '\n');
  }
}, {
  scheduled: true,
  timezone: "America/New_York"
});

// Optional: Run initial feed fetch when server starts (non-blocking)
console.log('🔄 Running initial feed fetch...');
setImmediate(() => {
  fetchAllFeeds()
    .then(() => console.log('✅ Initial feed fetch completed!'))
    .catch(err => console.error('❌ Initial feed fetch failed:', err.message));
}); 