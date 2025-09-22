const axios = require('axios');
const xml2js = require('xml2js');

const url = 'https://www.sciencedaily.com/rss/food_beverages/superfoods.xml';

async function test() {
  try {
    const response = await axios.get(url);
    const data = await xml2js.parseStringPromise(response.data, { mergeAttrs: true });
    console.log('RSS feed works! First title:', data.rss.channel[0].item[0].title[0]);
  } catch (err) {
    console.log('RSS feed failed:', err.message);
  }
}

test();
