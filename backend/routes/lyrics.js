const express = require('express');
const router = express.Router();
const genius = require('../controllers/genius');
const NodeCache = require('node-cache');

// Cache for lyrics (TTL: 7 days = 604800 seconds)
const lyricsCache = new NodeCache({ stdTTL: 604800 });

/**
 * GET /api/lyrics
 * Get lyrics preview for a song
 * Query params: title, artist
 */
router.get('/', async (req, res) => {
    try {
        const { title, artist } = req.query;

        if (!title || !artist) {
            return res.status(400).json({
                success: false,
                error: 'Both title and artist are required'
            });
        }

        // Create cache key
        const cacheKey = `${title.toLowerCase()}_${artist.toLowerCase()}`;

        // Check cache first
        const cachedLyrics = lyricsCache.get(cacheKey);
        if (cachedLyrics) {
            console.log(`[Lyrics] Cache hit for: ${title} - ${artist}`);
            return res.json({
                success: true,
                data: cachedLyrics,
                cached: true
            });
        }

        // Fetch from Genius API
        const result = await genius.getLyricsPreview(title, artist);

        if (result.success && result.data) {
            // Cache the result
            lyricsCache.set(cacheKey, result.data);
            console.log(`[Lyrics] Cached for: ${title} - ${artist}`);

            return res.json({
                ...result,
                cached: false
            });
        } else {
            return res.status(404).json(result);
        }
    } catch (error) {
        console.error('[Lyrics] Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/lyrics/search
 * Search for songs on Genius
 * Query params: q (query), limit
 */
router.get('/search', async (req, res) => {
    try {
        const { q, limit } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter "q" is required'
            });
        }

        const result = await genius.searchGenius(q, parseInt(limit) || 5);
        res.json(result);
    } catch (error) {
        console.error('[Lyrics Search] Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/lyrics/status
 * Get lyrics service status and cache stats
 */
router.get('/status', (req, res) => {
    res.json({
        success: true,
        status: 'online',
        message: 'Lyrics service is operational',
        cacheStats: {
            keys: lyricsCache.keys().length,
            stats: lyricsCache.getStats()
        }
    });
});

/**
 * POST /api/lyrics/cache/clear
 * Clear lyrics cache (admin endpoint)
 */
router.post('/cache/clear', (req, res) => {
    lyricsCache.flushAll();
    res.json({
        success: true,
        message: 'Lyrics cache cleared'
    });
});

module.exports = router;
