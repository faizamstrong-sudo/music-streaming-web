// Cache utility for FASHIN Play Backend
// Provides caching functionality for API responses and stream URLs

const NodeCache = require('node-cache');

// Create cache instances with different TTLs
const streamCache = new NodeCache({ 
    stdTTL: 3600,      // 1 hour for stream URLs
    checkperiod: 600    // Check for expired keys every 10 minutes
});

const apiCache = new NodeCache({ 
    stdTTL: 1800,      // 30 minutes for API responses
    checkperiod: 300    // Check for expired keys every 5 minutes
});

/**
 * Get value from stream cache
 */
function getStreamCache(key) {
    return streamCache.get(key);
}

/**
 * Set value in stream cache
 */
function setStreamCache(key, value, ttl) {
    if (ttl) {
        return streamCache.set(key, value, ttl);
    }
    return streamCache.set(key, value);
}

/**
 * Get value from API cache
 */
function getApiCache(key) {
    return apiCache.get(key);
}

/**
 * Set value in API cache
 */
function setApiCache(key, value, ttl) {
    if (ttl) {
        return apiCache.set(key, value, ttl);
    }
    return apiCache.set(key, value);
}

/**
 * Clear all caches
 */
function clearAllCaches() {
    streamCache.flushAll();
    apiCache.flushAll();
    return { message: 'All caches cleared' };
}

/**
 * Get cache statistics
 */
function getCacheStats() {
    return {
        stream: streamCache.getStats(),
        api: apiCache.getStats()
    };
}

module.exports = {
    getStreamCache,
    setStreamCache,
    getApiCache,
    setApiCache,
    clearAllCaches,
    getCacheStats
};
