const redis = require('redis');
const { REDIS } = require('./constants');

let client = new Object();

try {
    // Create Redis client
    client = redis.createClient();

    // Connect to Redis
    client.connect(REDIS.CONNECTION_URL);

} catch (error) {
    throw new Error(error);
}

module.exports = client;