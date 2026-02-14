const express = require('express');
const router = express.Router();
const deezer = require('../controllers/deezer');

// Search tracks
router.get('/search', async (req, res) => {
    try {
        const { q, limit } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter "q" is required'
            });
        }
        
        const result = await deezer.searchTracks(q, parseInt(limit) || 25);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get chart/recommended tracks
router.get('/charts', async (req, res) => {
    try {
        const { limit } = req.query;
        const result = await deezer.getChartTracks(parseInt(limit) || 25);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get trending tracks
router.get('/trending', async (req, res) => {
    try {
        const { limit } = req.query;
        const result = await deezer.getChartTracks(parseInt(limit) || 25);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get recommendations
router.get('/recommendations', async (req, res) => {
    try {
        const { limit } = req.query;
        const result = await deezer.getChartTracks(parseInt(limit) || 25);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get trending Indonesian songs
router.get('/trending-id', async (req, res) => {
    try {
        const { limit } = req.query;
        // Search for Indonesian music
        const result = await deezer.searchTracks('Indonesia music terpopuler', parseInt(limit) || 25);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get tracks by genre
router.get('/genre/:genreId', async (req, res) => {
    try {
        const { genreId } = req.params;
        const { limit } = req.query;
        const result = await deezer.getTracksByGenre(genreId, parseInt(limit) || 25);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get track by ID
router.get('/:trackId', async (req, res) => {
    try {
        const { trackId } = req.params;
        const result = await deezer.getTrackById(trackId);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get artist's top tracks
router.get('/artist/:artistId/top', async (req, res) => {
    try {
        const { artistId } = req.params;
        const { limit } = req.query;
        const result = await deezer.getArtistTopTracks(artistId, parseInt(limit) || 10);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
