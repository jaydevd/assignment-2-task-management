const redis = require('redis');

// Create Redis client
const client = redis.createClient();

// Connect to Redis
client.connect().catch(console.error);
module.exports = client;