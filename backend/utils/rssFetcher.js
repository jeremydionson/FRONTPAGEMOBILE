// backend/utils/rssFetcher.js
const axios = require("axios");
const xml2js = require("xml2js");
const admin = require("firebase-admin");

const healthFeeds = require("../data/healthFeeds");
const techFeeds = require("../data/techFeeds");
const financeFeeds = require("../data/financeFeeds");
const travelFeeds = require("../data/travelFeeds");
const foodFeeds = require("../data/foodFeeds");
const sportsFeeds = require("../data/sportsFeeds");
const newsFeeds = require("../data/newsFeeds");

const { mainTopics, subTopics } = require("../data/topicsChecklist");

const feeds = [
  ...healthFeeds,
  ...techFeeds,
  ...financeFeeds,
  ...travelFeeds,
  ...foodFeeds,
  ...sportsFeeds,
  ...newsFeeds
];

function getLevel(subtopic) {
  if (mainTopics.includes(subtopic)) return 0; // main feed
  if (subTopics.includes(subtopic)) return 1; // expand/niche feed
  return 1; // default to subtopic if unknown
}

async function fetchRSS(feed) {
  try {
    const { data } = await axios.get(feed.feed_url);
    const parsed = await xml2js.parseStringPromise(data, { mergeAttrs: true });
    const articles = parsed.rss.channel[0].item.map(item => ({
      title: item.title[0],
      link: item.link[0],
      pubDate: item.pubDate ? new Date(item.pubDate[0]) : new Date(),
      source: feed.source,
      topic: feed.topic,
      subtopic: feed.subtopic,
      level: getLevel(feed.subtopic)
    }));
    return articles;
  } catch (error) {
    console.error("RSS feed failed:", feed.feed_url, error.message);
    return [];
  }
}

async function fetchAllFeeds() {
  for (const feed of feeds) {
    const articles = await fetchRSS(feed);
    if (articles.length > 0) {
      const db = admin.firestore();
      const batch = db.batch();
      articles.forEach(article => {
        const docRef = db.collection("articles").doc();
        batch.set(docRef, article);
      });
      await batch.commit();
      console.log(`✅ Fetched and saved ${articles.length} articles from ${feed.source}`);
    }
  }
}

module.exports = { fetchAllFeeds };
