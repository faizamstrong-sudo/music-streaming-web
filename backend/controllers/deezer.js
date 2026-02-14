const axios = require('axios');

const DEEZER_API_BASE = 'https://api.deezer.com';

// Mock data for when external API is not accessible
const MOCK_TRACKS = [
    {
        id: 1,
        title: 'Shape of You',
        artist: { name: 'Ed Sheeran', id: 1 },
        album: { title: '÷ (Deluxe)', id: 1, cover_small: '', cover_medium: 'https://e-cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/250x250-000000-80-0-0.jpg', cover_big: '', cover_xl: '' },
        duration: 233,
        preview: 'https://cdns-preview-e.dzcdn.net/stream/c-e77d23e0c8ed7567a507a6d1b6a9ca1b-8.mp3',
        link: 'https://www.deezer.com/track/1'
    },
    {
        id: 2,
        title: 'Blinding Lights',
        artist: { name: 'The Weeknd', id: 2 },
        album: { title: 'After Hours', id: 2, cover_small: '', cover_medium: 'https://e-cdns-images.dzcdn.net/images/cover/ec3c8ed67427064c70f67e5815b74cef/250x250-000000-80-0-0.jpg', cover_big: '', cover_xl: '' },
        duration: 200,
        preview: 'https://cdns-preview-2.dzcdn.net/stream/c-2e0288e92f5f5b6c8b5c5a3e3e8f8d8c-8.mp3',
        link: 'https://www.deezer.com/track/2'
    },
    {
        id: 3,
        title: 'Levitating',
        artist: { name: 'Dua Lipa', id: 3 },
        album: { title: 'Future Nostalgia', id: 3, cover_small: '', cover_medium: 'https://e-cdns-images.dzcdn.net/images/cover/d4c5e5b3e0e1e5e5e5e5e5e5e5e5e5e5/250x250-000000-80-0-0.jpg', cover_big: '', cover_xl: '' },
        duration: 203,
        preview: 'https://cdns-preview-d.dzcdn.net/stream/c-d4c5e5b3e0e1e5e5e5e5e5e5e5e5e5e5-8.mp3',
        link: 'https://www.deezer.com/track/3'
    },
    {
        id: 4,
        title: 'Save Your Tears',
        artist: { name: 'The Weeknd', id: 2 },
        album: { title: 'After Hours', id: 2, cover_small: '', cover_medium: 'https://e-cdns-images.dzcdn.net/images/cover/ec3c8ed67427064c70f67e5815b74cef/250x250-000000-80-0-0.jpg', cover_big: '', cover_xl: '' },
        duration: 215,
        preview: 'https://cdns-preview-4.dzcdn.net/stream/c-4e0288e92f5f5b6c8b5c5a3e3e8f8d8c-8.mp3',
        link: 'https://www.deezer.com/track/4'
    },
    {
        id: 5,
        title: 'Good 4 U',
        artist: { name: 'Olivia Rodrigo', id: 5 },
        album: { title: 'SOUR', id: 5, cover_small: '', cover_medium: 'https://e-cdns-images.dzcdn.net/images/cover/b9c7d5a7e8f9c9d9e9f9e9e9e9e9e9e9/250x250-000000-80-0-0.jpg', cover_big: '', cover_xl: '' },
        duration: 178,
        preview: 'https://cdns-preview-5.dzcdn.net/stream/c-5e0288e92f5f5b6c8b5c5a3e3e8f8d8c-8.mp3',
        link: 'https://www.deezer.com/track/5'
    },
    {
        id: 6,
        title: 'Peaches',
        artist: { name: 'Justin Bieber ft. Daniel Caesar & Giveon', id: 6 },
        album: { title: 'Justice', id: 6, cover_small: '', cover_medium: 'https://e-cdns-images.dzcdn.net/images/cover/f8a9b8c9d8e9f9g9h9i9j9k9l9m9n9o9/250x250-000000-80-0-0.jpg', cover_big: '', cover_xl: '' },
        duration: 198,
        preview: 'https://cdns-preview-6.dzcdn.net/stream/c-6e0288e92f5f5b6c8b5c5a3e3e8f8d8c-8.mp3',
        link: 'https://www.deezer.com/track/6'
    }
];

const INDONESIAN_TRACKS = [
    {
        id: 101,
        title: 'Akad',
        artist: { name: 'Payung Teduh', id: 101 },
        album: { title: 'Akad', id: 101, cover_small: '', cover_medium: '', cover_big: '', cover_xl: '' },
        duration: 245,
        preview: '',
        link: ''
    },
    {
        id: 102,
        title: 'Lathi',
        artist: { name: 'Weird Genius ft. Sara Fajira', id: 102 },
        album: { title: 'Lathi', id: 102, cover_small: '', cover_medium: '', cover_big: '', cover_xl: '' },
        duration: 200,
        preview: '',
        link: ''
    },
    {
        id: 103,
        title: 'Bertaut',
        artist: { name: 'Nadin Amizah', id: 103 },
        album: { title: 'Bertaut', id: 103, cover_small: '', cover_medium: '', cover_big: '', cover_xl: '' },
        duration: 220,
        preview: '',
        link: ''
    }
];

/**
 * Search for tracks on Deezer
 */
async function searchTracks(query, limit = 25) {
    try {
        const response = await axios.get(`${DEEZER_API_BASE}/search`, {
            params: { q: query, limit },
            timeout: 5000
        });
        
        return {
            success: true,
            data: response.data.data.map(formatTrack),
            total: response.data.total
        };
    } catch (error) {
        console.error('Deezer search error:', error.message, '- Using mock data');
        // Return mock data based on query
        const filtered = query.toLowerCase().includes('indonesia') 
            ? INDONESIAN_TRACKS 
            : MOCK_TRACKS;
        return {
            success: true,
            data: filtered.slice(0, limit).map(formatTrack),
            total: filtered.length,
            mock: true
        };
    }
}

/**
 * Get chart/recommended tracks
 */
async function getChartTracks(limit = 25) {
    try {
        const response = await axios.get(`${DEEZER_API_BASE}/chart/0/tracks`, {
            params: { limit },
            timeout: 5000
        });
        
        return {
            success: true,
            data: response.data.data.map(formatTrack)
        };
    } catch (error) {
        console.error('Deezer chart error:', error.message, '- Using mock data');
        return {
            success: true,
            data: MOCK_TRACKS.slice(0, limit).map(formatTrack),
            mock: true
        };
    }
}

/**
 * Get tracks by genre
 */
async function getTracksByGenre(genreId, limit = 25) {
    try {
        const response = await axios.get(`${DEEZER_API_BASE}/genre/${genreId}/artists`, {
            timeout: 5000
        });
        const artists = response.data.data.slice(0, 5);
        
        let tracks = [];
        for (const artist of artists) {
            try {
                const artistTracksRes = await axios.get(`${DEEZER_API_BASE}/artist/${artist.id}/top`, {
                    params: { limit: 5 },
                    timeout: 5000
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
        console.error('Deezer genre error:', error.message, '- Using mock data');
        return {
            success: true,
            data: MOCK_TRACKS.slice(0, limit).map(formatTrack),
            mock: true
        };
    }
}

/**
 * Get track details by ID
 */
async function getTrackById(trackId) {
    try {
        const response = await axios.get(`${DEEZER_API_BASE}/track/${trackId}`, {
            timeout: 5000
        });
        
        return {
            success: true,
            data: formatTrack(response.data)
        };
    } catch (error) {
        console.error('Deezer track error:', error.message);
        // Find in mock data
        const track = MOCK_TRACKS.find(t => t.id == trackId);
        return {
            success: !!track,
            data: track ? formatTrack(track) : null,
            mock: !!track
        };
    }
}

/**
 * Get artist's top tracks
 */
async function getArtistTopTracks(artistId, limit = 10) {
    try {
        const response = await axios.get(`${DEEZER_API_BASE}/artist/${artistId}/top`, {
            params: { limit },
            timeout: 5000
        });
        
        return {
            success: true,
            data: response.data.data.map(formatTrack)
        };
    } catch (error) {
        console.error('Deezer artist tracks error:', error.message, '- Using mock data');
        return {
            success: true,
            data: MOCK_TRACKS.slice(0, limit).map(formatTrack),
            mock: true
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
