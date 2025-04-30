const redis = require('redis');

let client = new Object();

try {
    // Create Redis client
    client = redis.createClient({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    });

    // Connect to Redis
    client.connect();

} catch (error) {
    throw new Error(error);
}

module.exports = client;