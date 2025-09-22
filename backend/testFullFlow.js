require('dotenv').config();
const admin = require('firebase-admin');
const { fetchRSS } = require('./utils/rssFetcher');
const summarizeAndTag = require('./utils/aiSummarizer');

// Firebase setup
const serviceAccount = require('./config/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-project-id>.firebaseio.com"
});
const db = admin.firestore();

async function testFlow() {
  try {
    const feedUrl = "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml";
    console.log(`Fetching feed: ${feedUrl}`);
    const items = await fetchRSS(feedUrl);

    if (!items.length) {
      console.log("⚠️ No items found in feed");
      return;
    }

    const firstItem = items[0];
    console.log("✅ First item fetched:", firstItem.title);

    const aiData = await summarizeAndTag(firstItem.title, firstItem.description || "");
    console.log("🔮 AI summary:", aiData.summary);
    console.log("🏷️ Tags:", aiData.tags);

    // Safe Firestore write
    const docRef = db.collection('articles').doc();
    await docRef.set({
      title: firstItem.title,
      url: firstItem.url,
      source: firstItem.source,
      published_at: firstItem.published_at,
      AI_summary: aiData.summary,
      tags: aiData.tags
    });

    console.log("✅ Article saved to Firebase Firestore!");
  } catch (err) {
    console.error("❌ Test failed:", err.message);
  }
}

testFlow();
