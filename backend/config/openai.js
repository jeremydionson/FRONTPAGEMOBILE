// config/openai.js
require('dotenv').config();
const OpenAI = require('openai');

// Create OpenAI client using your API key from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Export so other files can use it
module.exports = openai;
