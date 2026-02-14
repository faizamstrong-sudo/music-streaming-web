const axios = require('axios');

const DEEZER_API_BASE = 'https://api.deezer.com';

/**
 * Search for tracks on Deezer
 */
async function searchTracks(query, limit = 25) {
    try {
        const response = await axios.get(`${DEEZER_API_BASE}/search`, {
            params: { q: query, limit }
        });
        
        return {
            success: true,
            data: response.data.data.map(formatTrack),
            total: response.data.total
        };
    } catch (error) {
        console.error('Deezer search error:', error.message);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
}

/**
 * Get chart/recommended tracks
 */
async function getChartTracks(limit = 25) {
    try {
        const response = await axios.get(`${DEEZER_API_BASE}/chart/0/tracks`, {
            params: { limit }
        });
        
        return {
            success: true,
            data: response.data.data.map(formatTrack)
        };
    } catch (error) {
        console.error('Deezer chart error:', error.message);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
}

/**
 * Get tracks by genre
 */
async function getTracksByGenre(genreId, limit = 25) {
    try {
        const response = await axios.get(`${DEEZER_API_BASE}/genre/${genreId}/artists`);
        const artists = response.data.data.slice(0, 5);
        
        let tracks = [];
        for (const artist of artists) {
            try {
                const artistTracksRes = await axios.get(`${DEEZER_API_BASE}/artist/${artist.id}/top`, {
                    params: { limit: 5 }
                });
                tracks = tracks.concat(artistTracksRes.data.data);
            } catch (err) {
                console.error(`Error fetching tracks for artist ${artist.id}:`, err.message);
            }
        }
        
        return {
            success: true,
            data: tracks.slice(0, limit).map(formatTrack)
        };
    } catch (error) {
        console.error('Deezer genre error:', error.message);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
}

/**
 * Get track details by ID
 */
async function getTrackById(trackId) {
    try {
        const response = await axios.get(`${DEEZER_API_BASE}/track/${trackId}`);
        
        return {
            success: true,
            data: formatTrack(response.data)
        };
    } catch (error) {
        console.error('Deezer track error:', error.message);
        return {
            success: false,
            error: error.message,
            data: null
        };
    }
}

/**
 * Get artist's top tracks
 */
async function getArtistTopTracks(artistId, limit = 10) {
    try {
        const response = await axios.get(`${DEEZER_API_BASE}/artist/${artistId}/top`, {
            params: { limit }
        });
        
        return {
            success: true,
            data: response.data.data.map(formatTrack)
        };
    } catch (error) {
        console.error('Deezer artist tracks error:', error.message);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
}

/**
 * Format track data to standardized format
 */
function formatTrack(track) {
    return {
        id: track.id,
        title: track.title,
        artist: track.artist ? track.artist.name : 'Unknown Artist',
        artistId: track.artist ? track.artist.id : null,
        album: track.album ? track.album.title : 'Unknown Album',
        albumId: track.album ? track.album.id : null,
        duration: track.duration,
        cover: track.album ? {
            small: track.album.cover_small,
            medium: track.album.cover_medium,
            large: track.album.cover_big,
            xl: track.album.cover_xl
        } : null,
        preview: track.preview,
        link: track.link
    };
}

module.exports = {
    searchTracks,
    getChartTracks,
    getTracksByGenre,
    getTrackById,
    getArtistTopTracks
};
