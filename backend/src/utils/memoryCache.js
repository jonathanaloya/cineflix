// In-memory cache fallback when Redis is not available
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const memoryCache = {
  get: async (key) => {
    const item = cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > CACHE_DURATION) {
      cache.delete(key);
      return null;
    }
    
    return item.data;
  },
  
  set: async (key, data, ttl = 300) => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
  },
  
  del: async (key) => {
    cache.delete(key);
  }
};

module.exports = memoryCache;