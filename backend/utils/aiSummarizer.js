require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function summarizeAndTag(title, description) {
  if (!process.env.OPENAI_API_KEY) {
    console.log("⚠️ OPENAI_API_KEY missing, using placeholder summary");
    return { summary: "AI summary placeholder", tags: ["test", "placeholder"] };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `
        Summarize this content in 2-3 sentences and give 3-5 tags:
        Title: ${title}
        Description: ${description}
      ` }],
      temperature: 0.7
    });

    const text = completion.choices[0].message.content;
    const parts = text.split("Tags:");
    const summary = parts[0].trim();
    const tags = parts[1] ? parts[1].split(",").map(t => t.trim()) : [];

    return { summary, tags };
  } catch (err) {
    console.error("⚠️ AI summarization failed:", err.message);
    return { summary: "AI summary placeholder", tags: ["test", "placeholder"] };
  }
}

module.exports = summarizeAndTag;
