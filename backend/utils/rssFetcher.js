const axios = require("axios");
const xml2js = require("xml2js");
const admin = require("firebase-admin");
const summarizeAndTag = require('./aiSummary');

const healthFeeds = require("../data/healthFeeds");
const techFeeds = require("../data/techFeeds");
const financeFeeds = require("../data/financeFeeds");
const travelFeeds = require("../data/travelFeeds");
const foodFeeds = require("../data/foodFeeds");
const sportsFeeds = require("../data/sportsFeeds");
const newsFeeds = require("../data/newsFeeds");
const carFeeds = require("../data/carFeeds");
const watchesFeeds = require("../data/watchesFeeds");
const videoFeeds = require("../data/videoFeeds");

const { mainTopics, subTopics } = require("../data/topicsChecklist");

const feeds = [
  ...healthFeeds,
  ...techFeeds,
  ...financeFeeds,
  ...travelFeeds,
  ...foodFeeds,
  ...sportsFeeds,
  ...newsFeeds,
  ...carFeeds,
  ...watchesFeeds,
  ...videoFeeds
];

function getLevel(subtopic) {
  if (mainTopics.includes(subtopic)) return 0; // main feed
  if (subTopics.includes(subtopic)) return 1; // expand/niche feed
  return 1; // default to subtopic if unknown
}

// Helper function to format duration from seconds to MM:SS or HH:MM:SS
function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

// Check if content already exists in database
async function contentExists(link, contentType = "article") {
  try {
    const db = admin.firestore();
    const collection = contentType === "video" ? "videos" : "articles";
    const snapshot = await db.collection(collection).where("link", "==", link).limit(1).get();
    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking content existence:", error);
    return false;
  }
}

async function fetchRSS(feed, retryCount = 0) {
  const maxRetries = 3;
  const isVideo = feed.content_type === "video";

  try {
    // Add extra timeout and specific headers for YouTube feeds
    const timeout = isVideo ? 20000 : 15000; // Extra time for YouTube
    const { data } = await axios.get(feed.feed_url, {
      timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FrontPageApp/1.0; +https://frontpage.com/bot)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
        ...(isVideo && { 'Accept-Encoding': 'gzip, deflate' })
      }
    });

    const parsed = await xml2js.parseStringPromise(data, {
      mergeAttrs: true,
      explicitArray: false,
      ignoreAttrs: false
    });

    const content = [];
    let processedCount = 0;
    let duplicateCount = 0;

    // Handle different RSS structures for YouTube vs regular RSS
    let items = [];
    if (isVideo && parsed.feed && parsed.feed.entry) {
      // YouTube RSS format (Atom feed)
      items = Array.isArray(parsed.feed.entry) ? parsed.feed.entry : [parsed.feed.entry];
    } else if (parsed.rss && parsed.rss.channel && parsed.rss.channel.item) {
      // Standard RSS format
      items = Array.isArray(parsed.rss.channel.item) ? parsed.rss.channel.item : [parsed.rss.channel.item];
    } else {
      console.error(`❌ Unrecognized RSS structure for ${feed.source}`);
      return { content: [], contentType: feed.content_type || "article" };
    }

    // Process items one by one
    for (const item of items.slice(0, 5)) { // Reduced to 5 to save processing time
      try {
        let title, link, description, pubDate, videoId;

        if (isVideo && parsed.feed) {
          // YouTube RSS structure
          title = item.title || '';
          link = item.link ? (item.link.$ ? item.link.$.href : item.link) : '';
          description = item['media:group'] && item['media:group']['media:description']
            ? item['media:group']['media:description']
            : (item.summary || '');
          pubDate = item.published || item.updated || '';
          videoId = item['yt:videoId'] || '';
        } else {
          // Standard RSS structure
          title = Array.isArray(item.title) ? item.title[0] : item.title || '';
          link = Array.isArray(item.link) ? item.link[0] : item.link || '';
          description = item.description
            ? (Array.isArray(item.description) ? item.description[0] : item.description)
            : '';
          pubDate = item.pubDate
            ? (Array.isArray(item.pubDate) ? item.pubDate[0] : item.pubDate)
            : '';
        }

        // Skip if content already exists
        if (await contentExists(link, feed.content_type)) {
          duplicateCount++;
          continue;
        }

        // Skip full content extraction for now
        console.log(`${isVideo ? '🎥' : '📝'} Processing: ${title.substring(0, 50)}...`);

        // Generate summary and tags
        const { summary, tags } = await summarizeAndTag(title, description);

        let contentItem;

        if (isVideo) {
          // Use videoId from YouTube RSS or extract from URL as fallback
          const extractedVideoId = videoId || link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];

          // Get thumbnail URL - try media:thumbnail first, fallback to standard YouTube URL
          let thumbnailUrl = null;
          if (item['media:group'] && item['media:group']['media:thumbnail']) {
            const thumbnail = item['media:group']['media:thumbnail'];
            thumbnailUrl = thumbnail.$ ? thumbnail.$.url : thumbnail.url || thumbnail;
          } else if (extractedVideoId) {
            thumbnailUrl = `https://img.youtube.com/vi/${extractedVideoId}/maxresdefault.jpg`;
          }

          // Parse YouTube statistics if available
          let duration = "0:00";
          let views = "0";
          if (item['media:group'] && item['media:group']['media:content']) {
            const mediaContent = item['media:group']['media:content'];
            duration = mediaContent.$ && mediaContent.$.duration ?
              formatDuration(mediaContent.$.duration) : "0:00";
          }

          contentItem = {
            title,
            link,
            description,
            source: feed.source,
            videoId: extractedVideoId,
            thumbnailUrl,
            videoUrl: link,
            duration,
            views,
            category: feed.subtopic,

            // AI and metadata
            aiSummary: summary,
            aiTags: tags,
            pubDate: pubDate ? new Date(pubDate) : new Date(),
            publishedAt: pubDate || new Date().toISOString(),
            topic: feed.topic,
            subtopic: feed.subtopic,
            level: getLevel(feed.subtopic),
            createdAt: new Date(),
            contentType: "video"
          };
        } else {
          contentItem = {
            title, // This goes on TOP (like Instagram profile name)
            link,
            description, // This is the abstract (like Instagram caption)
            source: feed.source, // This goes BELOW image (like Instagram username)

            // AI and metadata
            aiSummary: summary,
            aiTags: tags,
            pubDate: pubDate ? new Date(pubDate) : new Date(),
            topic: feed.topic,
            subtopic: feed.subtopic,
            level: getLevel(feed.subtopic),
            createdAt: new Date(),
            contentType: "article",

            // For Instagram-style layout
            displayTitle: title, // Top of image
            displaySource: feed.source, // Below image
            displayCaption: description || summary // Below image as caption
          };
        }

        content.push(contentItem);
        processedCount++;

        // Small delay to be respectful
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (itemError) {
        console.error(`❌ Failed to process ${isVideo ? 'video' : 'article'}: ${item.title?.[0] || 'Unknown'}`, itemError.message);
      }
    }

    console.log(`📊 ${feed.source}: ${processedCount} new, ${duplicateCount} duplicates`);
    return { content, contentType: feed.content_type || "article" };

  } catch (error) {
    const errorMessage = error.message || 'Unknown error';

    // Check for YouTube-specific errors that should trigger retries
    const shouldRetry = retryCount < maxRetries && (
      error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT' ||
      error.response?.status === 429 || // Rate limited
      error.response?.status === 503 || // Service unavailable
      errorMessage.includes('timeout') ||
      (isVideo && error.response?.status === 404) // YouTube channel might be temporarily unavailable
    );

    if (shouldRetry) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff, max 10s
      console.log(`⏳ Retrying ${feed.source} in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);

      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchRSS(feed, retryCount + 1);
    }

    // Log different error types
    if (isVideo) {
      if (error.response?.status === 404) {
        console.error(`❌ YouTube feed not found (404): ${feed.source} - Check channel ID`);
      } else if (error.response?.status === 429) {
        console.error(`❌ YouTube rate limited: ${feed.source} - Will retry later`);
      } else {
        console.error(`❌ YouTube feed failed: ${feed.source}`, errorMessage);
      }
    } else {
      console.error(`❌ RSS feed failed: ${feed.source}`, errorMessage);
    }

    return { content: [], contentType: feed.content_type || "article" };
  }
}

async function fetchAllFeeds() {
  let totalArticles = 0;
  let totalVideos = 0;
  let totalFeeds = feeds.length;
  let successfulFeeds = 0;

  console.log(`🚀 Starting to process ${totalFeeds} feeds...`);

  for (const feed of feeds) {
    console.log(`\n🔄 [${successfulFeeds + 1}/${totalFeeds}] Processing: ${feed.source}...`);

    const result = await fetchRSS(feed);
    if (result.content.length > 0) {
      const db = admin.firestore();
      const batch = db.batch();
      const isVideo = result.contentType === "video";
      const collection = isVideo ? "videos" : "articles";

      result.content.forEach(item => {
        const docRef = db.collection(collection).doc();
        batch.set(docRef, item);
      });

      await batch.commit();

      if (isVideo) {
        totalVideos += result.content.length;
        console.log(`✅ Saved ${result.content.length} new videos from ${feed.source}`);
      } else {
        totalArticles += result.content.length;
        console.log(`✅ Saved ${result.content.length} new articles from ${feed.source}`);
      }
      successfulFeeds++;
    } else {
      const contentType = result.contentType === "video" ? "videos" : "articles";
      console.log(`⚠️ No new ${contentType} from ${feed.source}`);
    }

    // Delay between feeds
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n🎉 SUMMARY: ${totalArticles} articles and ${totalVideos} videos from ${successfulFeeds}/${totalFeeds} successful feeds`);
}

module.exports = { fetchAllFeeds, fetchRSS };