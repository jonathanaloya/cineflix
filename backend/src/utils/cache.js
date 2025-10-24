const redis = require('redis');
const memoryCache = require('./memoryCache');

let client;
let useRedis = false;

const initRedis = async () => {
  // Skip Redis initialization if URL not provided
  if (!process.env.REDIS_URL) {
    console.log('Redis not configured, using memory cache');
    useRedis = false;
    return;
  }
  
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL
    });
    
    client.on('error', () => {
      useRedis = false;
    });
    
    await client.connect();
    useRedis = true;
    console.log('Connected to Redis');
  } catch (error) {
    useRedis = false;
  }
};

const cache = {
  get: async (key) => {
    if (useRedis && client) {
      try {
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        return await memoryCache.get(key);
      }
    }
    return await memoryCache.get(key);
  },
  
  set: async (key, data, ttl = 3600) => {
    if (useRedis && client) {
      try {
        await client.setEx(key, ttl, JSON.stringify(data));
        return;
      } catch (error) {
        // Fall through to memory cache
      }
    }
    await memoryCache.set(key, data, ttl);
  },
  
  del: async (key) => {
    if (useRedis && client) {
      try {
        await client.del(key);
        return;
      } catch (error) {
        // Fall through to memory cache
      }
    }
    await memoryCache.del(key);
  }
};

module.exports = { initRedis, cache };