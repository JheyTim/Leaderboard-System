const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.connect();

module.exports = redisClient;
