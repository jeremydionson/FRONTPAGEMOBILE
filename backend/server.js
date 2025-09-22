const express = require('express');
const cors = require('cors');

// Import all routes
const feedRoutes = require('./routes/feed');
const watchfeedRoutes = require('./routes/watchfeed');
const expandRoutes = require('./routes/expand');
const followRoutes = require('./routes/follow');
const saveRoutes = require('./routes/save');
const searchRoutes = require('./routes/search');
const userPreferencesRoutes = require('./routes/userPreferences');
const signupRoutes = require('./routes/signup');
const topicSelectionRoutes = require('./routes/topicSelection');
const subtopicSelectionRoutes = require('./routes/subtopicSelection');
const subscriptionRoutes = require('./routes/subscription');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/feed', feedRoutes);                       // Main feed (personalized)
app.use('/watchfeed', watchfeedRoutes);            // Videos only
app.use('/expand', expandRoutes);                  // AI recommendations
app.use('/follow', followRoutes);                  // Follow topics/subtopics
app.use('/save', saveRoutes);                      // Save content
app.use('/search', searchRoutes);                  // Keyword search
app.use('/user/preferences', userPreferencesRoutes); // Get/update user preferences
app.use('/signup', signupRoutes);                  // Google signup
app.use('/topic-selection', topicSelectionRoutes); // Select topics after signup
app.use('/subtopic-selection', subtopicSelectionRoutes); // Select subtopics/niches
app.use('/subscription', subscriptionRoutes);     // Save user subscriptions

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
