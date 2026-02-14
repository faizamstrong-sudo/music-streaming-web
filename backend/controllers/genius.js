const axios = require('axios');

// Genius API endpoint (no auth required for search)
const GENIUS_API_BASE = 'https://api.genius.com';
const GENIUS_ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN || '';

/**
 * Search for a song on Genius and get lyrics preview
 * @param {string} title - Song title
 * @param {string} artist - Artist name
 * @returns {Promise<Object>} - Result with lyrics preview and full lyrics URL
 */
async function getLyricsPreview(title, artist) {
    try {
        const query = `${title} ${artist}`;
        console.log(`[Genius] Searching for: ${query}`);

        // Search for the song on Genius
        const searchResponse = await axios.get(`${GENIUS_API_BASE}/search`, {
            params: { q: query },
            headers: GENIUS_ACCESS_TOKEN ? {
                'Authorization': `Bearer ${GENIUS_ACCESS_TOKEN}`
            } : {},
            timeout: 10000
        });

        if (!searchResponse.data || !searchResponse.data.response || !searchResponse.data.response.hits || searchResponse.data.response.hits.length === 0) {
            return {
                success: false,
                error: 'No lyrics found',
                data: null
            };
        }

        // Get the first (most relevant) result
        const firstHit = searchResponse.data.response.hits[0];
        const song = firstHit.result;

        // Extract basic information
        const lyricsData = {
            title: song.title,
            artist: song.primary_artist.name,
            fullLyricsUrl: song.url,
            thumbnail: song.song_art_image_url,
            // For legal reasons, we only provide a preview message and link to full lyrics
            preview: getLyricsPreviewText(song.title, song.primary_artist.name),
            message: 'Preview only - Click "View Full Lyrics" to see complete lyrics on Genius'
        };

        console.log(`[Genius] Found lyrics for: ${song.title} by ${song.primary_artist.name}`);

        return {
            success: true,
            data: lyricsData
        };
    } catch (error) {
        console.error('[Genius] Error:', error.message);
        
        if (error.response && error.response.status === 404) {
            return {
                success: false,
                error: 'Lyrics not found',
                data: null
            };
        }

        return {
            success: false,
            error: error.message,
            data: null
        };
    }
}

/**
 * Generate a lyrics preview text (legal placeholder)
 * In production, this would show actual first few lines if we had scraping permission
 * For now, we provide a teaser that encourages visiting Genius
 */
function getLyricsPreviewText(title, artist) {
    return [
        `♪ ${title} ♪`,
        `by ${artist}`,
        '',
        'Lyrics are available on Genius.',
        'Click "View Full Lyrics" below to read the complete lyrics.'
    ];
}

/**
 * Search for multiple songs on Genius
 * @param {string} query - Search query
 * @param {number} limit - Number of results to return
 * @returns {Promise<Object>} - Search results
 */
async function searchGenius(query, limit = 5) {
    try {
        console.log(`[Genius] Searching for: ${query}`);

        const response = await axios.get(`${GENIUS_API_BASE}/search`, {
            params: { 
                q: query,
                per_page: limit
            },
            headers: GENIUS_ACCESS_TOKEN ? {
                'Authorization': `Bearer ${GENIUS_ACCESS_TOKEN}`
            } : {},
            timeout: 10000
        });

        if (!response.data || !response.data.response || !response.data.response.hits) {
            return {
                success: false,
                error: 'No results found',
                data: []
            };
        }

        const results = response.data.response.hits.map(hit => ({
            title: hit.result.title,
            artist: hit.result.primary_artist.name,
            url: hit.result.url,
            thumbnail: hit.result.song_art_image_url
        }));

        return {
            success: true,
            data: results
        };
    } catch (error) {
        console.error('[Genius] Search error:', error.message);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
}

module.exports = {
    getLyricsPreview,
    searchGenius
};
