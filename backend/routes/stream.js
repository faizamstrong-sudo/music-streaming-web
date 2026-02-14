const express = require('express');
const router = express.Router();
const youtube = require('../controllers/youtube');
const ytdlp = require('../controllers/ytdlp');
const deezer = require('../controllers/deezer');
const NodeCache = require('node-cache');

// Cache for stream URLs (TTL: 24 hours = 86400 seconds)
const streamCache = new NodeCache({ stdTTL: 86400 });

// Rate limiting for YouTube requests
let youtubeRequestCount = 0;
let youtubeResetTime = Date.now() + 60000; // 1 minute

function checkYouTubeRateLimit() {
    const now = Date.now();
    if (now > youtubeResetTime) {
        youtubeRequestCount = 0;
        youtubeResetTime = now + 60000;
    }
    
    if (youtubeRequestCount >= 5) {
        return false; // Rate limit exceeded
    }
    
    youtubeRequestCount++;
    return true;
}

// Get stream URL for YouTube video
router.get('/youtube/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;
        
        // Check cache first
        const cachedUrl = streamCache.get(videoId);
        if (cachedUrl) {
            console.log('Stream URL found in cache for:', videoId);
            return res.json({
                success: true,
                data: cachedUrl,
                cached: true
            });
        }
        
        // Get fresh stream URL
        const result = await youtube.getStreamUrl(videoId);
        
        if (result.success && result.data) {
            // Cache the result
            streamCache.set(videoId, result.data);
            res.json({
                ...result,
                cached: false
            });
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get video info
router.get('/info/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;
        const result = await youtube.getVideoInfo(videoId);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Search YouTube
router.get('/search', async (req, res) => {
    try {
        const { q, maxResults } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter "q" is required'
            });
        }
        
        const result = await youtube.searchYouTube(q, parseInt(maxResults) || 10);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get stream URL using yt-dlp (POST method for flexibility)
// Input: { title, artist } or { videoId }
// Returns: { success, data: { streamUrl, title, artist, duration, thumbnail, source }, cached }
router.post('/get-url', async (req, res) => {
    try {
        const { title, artist, videoId } = req.body;
        
        if (!title && !artist && !videoId) {
            return res.status(400).json({
                success: false,
                error: 'Either (title and artist) or videoId is required'
            });
        }
        
        // Create cache key
        const cacheKey = videoId || `${title}_${artist}`.toLowerCase().replace(/\s+/g, '_');
        
        // Check cache first
        const cachedUrl = streamCache.get(cacheKey);
        if (cachedUrl) {
            console.log('[Stream] Cache hit for:', cacheKey);
            return res.json({
                success: true,
                data: cachedUrl,
                cached: true
            });
        }
        
        // Check rate limit
        if (!checkYouTubeRateLimit()) {
            console.log('[Stream] Rate limit exceeded, using Deezer fallback');
            
            // Fallback to Deezer preview
            if (title && artist) {
                const deezerResult = await deezer.searchTracks(`${title} ${artist}`, 1);
                if (deezerResult.success && deezerResult.data && deezerResult.data.length > 0) {
                    const track = deezerResult.data[0];
                    const fallbackData = {
                        streamUrl: track.preview,
                        title: track.title,
                        artist: track.artist,
                        duration: track.duration,
                        thumbnail: track.cover ? track.cover.medium : null,
                        source: 'deezer',
                        message: '30-second preview only (rate limit exceeded)'
                    };
                    
                    // Cache for shorter time (1 hour)
                    streamCache.set(cacheKey, fallbackData, 3600);
                    
                    return res.json({
                        success: true,
                        data: fallbackData,
                        cached: false,
                        fallback: true
                    });
                }
            }
            
            return res.status(429).json({
                success: false,
                error: 'Rate limit exceeded. Please try again in a minute.'
            });
        }
        
        let result;
        
        try {
            // Try yt-dlp first for full audio
            if (videoId) {
                console.log('[Stream] Fetching by video ID:', videoId);
                result = await ytdlp.getAudioUrlByVideoId(videoId);
            } else {
                console.log('[Stream] Searching YouTube for:', title, artist);
                result = await ytdlp.getYouTubeAudioUrl(title, artist);
            }
            
            if (result.success && result.data) {
                // Cache the result for 24 hours
                streamCache.set(cacheKey, result.data);
                console.log('[Stream] YouTube URL cached for:', cacheKey);
                
                return res.json({
                    success: true,
                    data: result.data,
                    cached: false
                });
            }
        } catch (ytError) {
            console.error('[Stream] YouTube/yt-dlp error:', ytError.message);
        }
        
        // Fallback to Deezer if YouTube fails
        console.log('[Stream] YouTube failed, falling back to Deezer');
        
        if (title && artist) {
            const deezerResult = await deezer.searchTracks(`${title} ${artist}`, 1);
            if (deezerResult.success && deezerResult.data && deezerResult.data.length > 0) {
                const track = deezerResult.data[0];
                const fallbackData = {
                    streamUrl: track.preview,
                    title: track.title,
                    artist: track.artist,
                    duration: track.duration,
                    thumbnail: track.cover ? track.cover.medium : null,
                    source: 'deezer',
                    message: '30-second preview only (YouTube unavailable)'
                };
                
                // Cache for shorter time (1 hour)
                streamCache.set(cacheKey, fallbackData, 3600);
                
                return res.json({
                    success: true,
                    data: fallbackData,
                    cached: false,
                    fallback: true
                });
            }
        }
        
        // Both YouTube and Deezer failed
        return res.status(404).json({
            success: false,
            error: 'Unable to find audio stream from any source'
        });
        
    } catch (error) {
        console.error('[Stream] Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get server status
router.get('/status', (req, res) => {
    res.json({
        success: true,
        status: 'online',
        message: 'Stream service is operational',
        cacheStats: {
            keys: streamCache.keys().length,
            stats: streamCache.getStats()
        }
    });
});

// Clear cache (admin endpoint)
router.post('/cache/clear', (req, res) => {
    streamCache.flushAll();
    res.json({
        success: true,
        message: 'Stream cache cleared'
    });
});

module.exports = router;
