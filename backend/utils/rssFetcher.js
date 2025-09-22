const axios = require('axios');
const xml2js = require('xml2js');
const Article = require('../models/article');
const Video = require('../models/video');

// Fetch a single RSS feed
async function fetchRSS(feed) {
  try {
    const response = await axios.get(feed.feed_url);
    const data = await xml2js.parseStringPromise(response.data, { mergeAttrs: true });
    if (!data.rss || !data.rss.channel) return [];

    return data.rss.channel[0].item.map(item => ({
      title: item.title[0],
      description: item.description ? item.description[0] : '',
      url: item.link[0],
      source: feed.source,
      topic: feed.topic,
      subtopic: feed.subtopic,
      published_at: item.pubDate ? new Date(item.pubDate[0]) : new Date(),
    }));
  } catch (err) {
    console.error(`RSS feed failed: ${feed.feed_url}`, err.message);
    return [];
  }
}

// Fetch multiple feeds from a feed list
async function fetchAllFeeds(feedList) {
  for (const feed of feedList) {
    console.log(`Fetching feed: ${feed.feed_url}`);
    const items = await fetchRSS(feed);

    for (const item of items) {
      // Example: if URL contains youtube, save as Video
      if (feed.feed_url.includes('youtube.com')) {
        await Video.create(item);
      } else {
        await Article.create(item);
      }
    }
  }
}

module.exports = { fetchRSS, fetchAllFeeds };
