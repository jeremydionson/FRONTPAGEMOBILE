const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function summarizeAndTag(title, description) {
  // Temporarily disable AI to avoid quota errors
  console.log("💡 Using placeholder summary to avoid quota limits");
  return { 
    summary: title.length > 150 ? title.substring(0, 147) + "..." : title,
    tags: ["news", "article"] 
  };
}

module.exports = summarizeAndTag;