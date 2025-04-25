/**
 * @name client
 * @file redis.js
 * @throwsF
 * @description This file will configure and connect to redis client.
 * @author Jaydev Dwivedi (Zignuts)
*/
const redis = require('redis');

// Create Redis client
const client = redis.createClient();

// Connect to Redis
client.connect().catch(console.error);
module.exports = client;