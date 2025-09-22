require('dotenv').config(); // Load .env file
const { fetchAllFeeds } = require('./utils/rssFetcher');

// Run the fetch function
async function testRSS() {
  console.log('Starting RSS feed test...');
  try {
    await fetchAllFeeds();
    console.log('✅ All feeds fetched and saved to Firebase Firestore!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testRSS();
