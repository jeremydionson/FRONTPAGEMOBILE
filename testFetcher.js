require('dotenv').config();
const { fetchRSS } = require('./utils/rssFetcher');
const summarizeAndTag = require('./utils/aiSummarizer');

async function test() {
  try {
    // Pick one RSS feed to test (replace with your real subtopic feed URL)
    const feedUrl = "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml";

    console.log(`Fetching feed: ${feedUrl}`);
    const items = await fetchRSS(feedUrl);

    if (items.length === 0) {
      console.log("⚠️ No items found in feed");
      return;
    }

    const firstItem = items[0];
    console.log("✅ First item fetched:", firstItem);

    console.log("\n🔮 Sending to AI summarizer...");
    const aiData = await summarizeAndTag(firstItem.title, firstItem.description || "");

    console.log("\n=== AI Output ===");
    console.log("Summary:", aiData.summary);
    console.log("Tags:", aiData.tags);

  } catch (err) {
    console.error("❌ Test failed:", err.message);
  }
}

test();
