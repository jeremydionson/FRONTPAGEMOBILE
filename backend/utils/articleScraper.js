const axios = require('axios');
const { JSDOM } = require('jsdom');

async function extractFullContent(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const dom = new JSDOM(response.data, { url });
    
    // Simple content extraction without Readability for now
    const document = dom.window.document;
    
    // Remove script and style elements
    const scripts = document.querySelectorAll('script, style');
    scripts.forEach(el => el.remove());
    
    // Try to find main content areas
    const contentSelectors = [
      'article',
      '[role="main"]',
      '.content',
      '.post-content',
      '.entry-content',
      '.article-body',
      'main'
    ];
    
    let content = '';
    for (const selector of contentSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        content = element.textContent || '';
        break;
      }
    }
    
    // Fallback to body if no content found
    if (!content) {
      content = document.body?.textContent || '';
    }
    
    // Clean up the content
    content = content.replace(/\s+/g, ' ').trim();
    
    return {
      fullContent: content,
      readableHtml: `<p>${content}</p>`,
      excerpt: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
      length: content.length
    };

  } catch (error) {
    console.error(`Failed to extract content from ${url}:`, error.message);
    return null;
  }
}

module.exports = { extractFullContent };