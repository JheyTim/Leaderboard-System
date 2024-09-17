const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const authRoutes = require('./src/routes/auth');
const scoreRoutes = require('./src/routes/score');
const leaderboardRoutes = require('./src/routes/leaderboard');

// Load env variables
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const redisClient = redis.createClient({ url: process.env.REDIS_URL });

// Middleware to parse JSON request bodies
app.use(express.json());

// Use the authentication routes
app.use('/auth', authRoutes);
app.use('/score', scoreRoutes);
app.use('/leaderboard', leaderboardRoutes);

app.get('/', (req, res) => {
  res.send('Leaderboard Service is Running!');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Function to connect to all services
async function connectToServices() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Connect to Redis
    await redisClient.connect();
    console.log('Connected to Redis');

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to services:', error);
  }
}

// Initialize connections and start the server
connectToServices();
