module.exports = [
  // New Supplements Level 1 subtopic (parent for supplement feeds)
  {
    topic: "Health",
    subtopic: "Supplements",
    level: 1,
    source: "PubMed", // Placeholder, no actual feed - just for organization
    feed_url: "" // Empty - this is just a parent category
  },
  {
    topic: "Health",
    subtopic: "General Health",
    level: 0, // main feed
    source: "PubMed",
    feed_url: "https://pubmed.ncbi.nlm.nih.gov/rss/search/1LmeR7JfcIZjekkUgHCoVQCEMN6lxTPrC0RPs1nuPJsUe8051i/?limit=15&utm_campaign=pubmed-2&fc=20250922172635"
  },
  {
    topic: "Health",
    subtopic: "Gut Health",
    level: 1, // subtopic
    source: "PubMed",
    feed_url: "https://pubmed.ncbi.nlm.nih.gov/rss/search/103QIAO1GYXcikVdOQE9ozAGKcp4O65mVtupBt3WZGZo07xg/?limit=15&utm_campaign=pubmed-2&fc=20250922134654"
  },
  {
    topic: "Health",
    subtopic: "Mental Health",
    level: 1,
    source: "PubMed",
    feed_url: "https://pubmed.ncbi.nlm.nih.gov/rss/search/1TEH1tG6NHxr9l3bQkTV_pUTt4Z1mtseZTT_K82NuW1f9CpguU/?limit=15&utm_campaign=pubmed-2&fc=20250922134920"
  },
  {
    topic: "Health",
    subtopic: "Dietary Supplements",
    parent_subtopic: "Supplements",
    level: 2, // Changed to Level 2 under Supplements
    source: "PubMed",
    feed_url: "https://pubmed.ncbi.nlm.nih.gov/rss/search/16Aw208Aj5vbB7vqv6hwx7yueKQW4U54j6hgbsW35dhSPFvIOR/?limit=15&utm_campaign=pubmed-2&fc=20250922134955"
  },
  {
    topic: "Health",
    subtopic: "Nutritional Supplements",
    parent_subtopic: "Supplements",
    level: 2, // Changed to Level 2 under Supplements
    source: "PubMed",
    feed_url: "https://pubmed.ncbi.nlm.nih.gov/rss/search/1hSsbZPB1F1yLEmfsOyemj0ktVGloTeL1geH3sa5gr6PS3SMcd/?limit=15&utm_campaign=pubmed-2&fc=20250922135036"
  },
  {
    topic: "Health",
    subtopic: "Sleep Optimization",
    level: 1,
    source: "PubMed",
    feed_url: "https://pubmed.ncbi.nlm.nih.gov/rss/search/165yO28ehHLdXKb1MVE3GcC_Rj3o6IHxP9zM1OQy2rDkrNycoJ/?limit=15&utm_campaign=pubmed-2&fc=20250922135142"
  },
  {
    topic: "Health",
    subtopic: "Biohacking",
    level: 1,
    source: "PubMed",
    feed_url: "https://pubmed.ncbi.nlm.nih.gov/rss/search/1Z9x4_PuU6zP6JYhff7dySWuLaOysEHoROI3Pbcv6suOo3bQr3/?limit=15&utm_campaign=pubmed-2&fc=20250922135227"
  },
  {
    topic: "Health",
    subtopic: "Longevity Science",
    level: 1,
    source: "PubMed",
    feed_url: "https://pubmed.ncbi.nlm.nih.gov/rss/search/16uwQpOeqFYN8Q1dMCpDDkMhe6KJZ4eC-CyRf4RBZbpPBpHo_m/?limit=15&utm_campaign=pubmed-2&fc=20250922135250"
  },
  {
    topic: "Health",
    subtopic: "Psoriasis",
    parent_subtopic: "Gut Health",
    level: 2, // niche of subtopic
    source: "PubMed",
    feed_url: "https://pubmed.ncbi.nlm.nih.gov/rss/search/14wpWf7MA3ABQTSTWFJg90DHjcNiCT8K6zrXw4NUKitpu-Ese4/?limit=15&utm_campaign=pubmed-2&fc=20250922135755"
  },
  {
    topic: "Health",
    subtopic: "General Health",
    level: 0,
    source: "Peter Attia",
    feed_url: "https://peterattiamd.com/feed/"
  },
  {
    topic: "Health",
    subtopic: "General Health",
    level: 0,
    source: "The Healthcare Blog",
    feed_url: "https://thehealthcareblog.com/feed/"
  },
  {
    topic: "Health",
    subtopic: "Biology",
    level: 1,
    source: "bioRXiv",
    feed_url: "https://connect.biorxiv.org/biorxiv_xml.php?subject=all"
  },
  {
    topic: "Health",
    subtopic: "General Health",
    level: 0,
    source: "NY Times",
    feed_url: "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml"
  },

  // New Level 2 niches under Mental Health
  {
    topic: "Health",
    subtopic: "Anxiety & Stress",
    parent_subtopic: "Mental Health",
    level: 2,
    source: "ADAA",
    feed_url: "https://adaa.org/blog/rss.xml"
  },
  {
    topic: "Health",
    subtopic: "Depression Research",
    parent_subtopic: "Mental Health",
    level: 2,
    source: "Wiley Online Library",
    feed_url: "https://onlinelibrary.wiley.com/feed/10990801/most-recent"
  },

  // New Level 2 niches under Sleep Optimization
  {
    topic: "Health",
    subtopic: "Sleep Disorders",
    parent_subtopic: "Sleep Optimization",
    level: 2,
    source: "Sleep Education",
    feed_url: "https://sleepeducation.org/feed"
  },
  {
    topic: "Health",
    subtopic: "Sleep Research",
    parent_subtopic: "Sleep Optimization",
    level: 2,
    source: "Sleep Review Magazine",
    feed_url: "https://sleepreviewmag.com/feed"
  },

  // New Level 2 niches under Gut Health (in addition to existing Psoriasis)
  {
    topic: "Health",
    subtopic: "Microbiome Research",
    parent_subtopic: "Gut Health",
    level: 2,
    source: "Nature",
    feed_url: "https://www.nature.com/subjects/microbiome.rss"
  },
  {
    topic: "Health",
    subtopic: "Probiotics & Prebiotics",
    parent_subtopic: "Gut Health",
    level: 2,
    source: "ISAPP Science",
    feed_url: "https://isappscience.org/feed"
  }
];
