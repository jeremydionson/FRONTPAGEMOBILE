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

// Check if article already exists in database
async function articleExists(link) {
  try {
    const db = admin.firestore();
    const snapshot = await db.collection("articles").where("link", "==", link).limit(1).get();
    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking article existence:", error);
    return false;
  }
}

async function fetchRSS(feed) {
  try {
    const { data } = await axios.get(feed.feed_url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'FrontPageApp/1.0'
      }
    });
    
    const parsed = await xml2js.parseStringPromise(data, { mergeAttrs: true });
    
    const articles = [];
    let processedCount = 0;
    let duplicateCount = 0;
    
    // Process articles one by one
    for (const item of parsed.rss.channel[0].item.slice(0, 5)) { // Reduced to 5 to save processing time
      try {
        const title = item.title[0];
        const link = item.link[0];
        const description = item.description ? item.description[0] : '';
        
        // Skip if article already exists
        if (await articleExists(link)) {
          duplicateCount++;
          continue;
        }
        
        // Skip full content extraction for now
        console.log(`📝 Processing: ${title.substring(0, 50)}...`);
        
        // Generate summary and tags
        const { summary, tags } = await summarizeAndTag(title, description);
        
        const article = {
          title, // This goes on TOP (like Instagram profile name)
          link,
          description, // This is the abstract (like Instagram caption)
          source: feed.source, // This goes BELOW image (like Instagram username)
          
          // AI and metadata
          aiSummary: summary,
          aiTags: tags,
          pubDate: item.pubDate ? new Date(item.pubDate[0]) : new Date(),
          topic: feed.topic,
          subtopic: feed.subtopic,
          level: getLevel(feed.subtopic),
          createdAt: new Date(),
          
          // For Instagram-style layout
          displayTitle: title, // Top of image
          displaySource: feed.source, // Below image  
          displayCaption: description || summary // Below image as caption
        };
        
        articles.push(article);
        processedCount++;
        
        // Small delay to be respectful
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (articleError) {
        console.error(`❌ Failed to process article: ${item.title?.[0] || 'Unknown'}`, articleError.message);
      }
    }
    
    console.log(`📊 ${feed.source}: ${processedCount} new, ${duplicateCount} duplicates`);
    return articles;
    
  } catch (error) {
    console.error(`❌ RSS feed failed: ${feed.source} - ${feed.feed_url}`, error.message);
    return [];
  }
}

async function fetchAllFeeds() {
  let totalArticles = 0;
  let totalFeeds = feeds.length;
  let successfulFeeds = 0;
  
  console.log(`🚀 Starting to process ${totalFeeds} feeds...`);
  
  for (const feed of feeds) {
    console.log(`\n🔄 [${successfulFeeds + 1}/${totalFeeds}] Processing: ${feed.source}...`);
    
    const articles = await fetchRSS(feed);
    if (articles.length > 0) {
      const db = admin.firestore();
      const batch = db.batch();
      
      articles.forEach(article => {
        const docRef = db.collection("articles").doc();
        batch.set(docRef, article);
      });
      
      await batch.commit();
      totalArticles += articles.length;
      successfulFeeds++;
      console.log(`✅ Saved ${articles.length} new articles from ${feed.source}`);
    } else {
      console.log(`⚠️ No new articles from ${feed.source}`);
    }
    
    // Delay between feeds
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n🎉 SUMMARY: ${totalArticles} total articles from ${successfulFeeds}/${totalFeeds} successful feeds`);
}

module.exports = { fetchAllFeeds };