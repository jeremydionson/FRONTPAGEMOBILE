const db = require('../config/firebase');

async function seedHealth() {
  // 1. Add the topic
  const topicRef = db.collection('topics').doc('health_wellness');
  await topicRef.set({
    name: 'Health & Wellness',
    description: 'All health, fitness, nutrition, wellness trends, and more.',
    main_feed: true,
    subtopics: ['nutrition', 'fitness', 'mental_health']
  });

  // 2. Add subtopics
  await db.collection('subtopics').doc('nutrition').set({
    name: 'Nutrition',
    parent_topic: 'health_wellness',
    niches: ['supplements', 'diet_trends', 'superfoods']
  });

  await db.collection('subtopics').doc('fitness').set({
    name: 'Fitness',
    parent_topic: 'health_wellness',
    niches: ['home_workouts', 'gym_training', 'yoga_pilates']
  });

  await db.collection('subtopics').doc('mental_health').set({
    name: 'Mental Health',
    parent_topic: 'health_wellness',
    niches: ['meditation', 'stress_management', 'mindfulness']
  });

  // 3. Add niches with RSS feeds
  await db.collection('niches').doc('supplements').set({
    name: 'Supplements',
    parent_subtopic: 'nutrition',
    rss_feed: 'https://www.nutrition.org/rss/supplements', // placeholder, pick free feed
    extra_work_needed: false
  });

  await db.collection('niches').doc('diet_trends').set({
    name: 'Diet Trends',
    parent_subtopic: 'nutrition',
    rss_feed: 'https://www.healthline.com/rss/diet',
    extra_work_needed: false
  });

  await db.collection('niches').doc('superfoods').set({
    name: 'Superfoods',
    parent_subtopic: 'nutrition',
    rss_feed: 'https://www.sciencedaily.com/rss/food_beverages/superfoods.xml',
    extra_work_needed: false
  });

  console.log('Health & Wellness seed complete!');
}

seed();
