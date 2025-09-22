const summarizeAndTag = require('./aiSummarizer');

async function fetchAllFeeds() {
  const feeds = await SubtopicFeed.getActiveFeeds();

  for (const feed of feeds) {
    const items = await fetchRSS(feed.feed_url);

    for (const item of items) {
      try {
        const aiData = await summarizeAndTag(item.title, item.description || '');

        if (feed.feed_url.includes('youtube.com')) {
          await Video.create({
            title: item.title,
            url: item.url,
            topic_id: feed.topic_id || null,
            subtopic_id: feed.subtopic_id,
            source: item.source,
            published_at: item.published_at,
            AI_summary: aiData.summary,
            tags: aiData.tags
          });
        } else {
          await Article.create({
            title: item.title,
            url: item.url,
            topic_id: feed.topic_id || null,
            subtopic_id: feed.subtopic_id,
            source: item.source,
            published_at: item.published_at,
            AI_summary: aiData.summary,
            tags: aiData.tags
          });
        }
      } catch (err) {
        console.error('⚠️ Failed to process item:', item.title, err.message);
      }
    }
  }
}
