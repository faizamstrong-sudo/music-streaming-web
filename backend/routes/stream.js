const express = require('express');
const router = express.Router();
const youtube = require('../controllers/youtube');
const NodeCache = require('node-cache');

// Cache for stream URLs (TTL: 1 hour)
const streamCache = new NodeCache({ stdTTL: 3600 });

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

// Clear cache (admin endpoint)
router.post('/cache/clear', (req, res) => {
    streamCache.flushAll();
    res.json({
        success: true,
        message: 'Stream cache cleared'
    });
});

module.exports = router;
