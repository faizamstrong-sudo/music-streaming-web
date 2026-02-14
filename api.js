// API Client for FASHIN Play Backend
// Handles all communication with the backend server

const API_CONFIG = {
    BASE_URL: 'http://localhost:3000',
    ENDPOINTS: {
        SONGS: '/api/songs',
        STREAM: '/api/stream'
    }
};

// Connection status
let isBackendConnected = false;

/**
 * Check backend connection
 */
async function checkBackendConnection() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/health`);
        const data = await response.json();
        isBackendConnected = data.status === 'ok';
        updateConnectionStatus(isBackendConnected);
        return isBackendConnected;
    } catch (error) {
        console.error('Backend connection failed:', error);
        isBackendConnected = false;
        updateConnectionStatus(false);
        return false;
    }
}

/**
 * Update connection status indicator in UI
 */
function updateConnectionStatus(connected) {
    const indicator = document.getElementById('connection-status');
    if (indicator) {
        indicator.className = connected ? 'connected' : 'disconnected';
        indicator.title = connected ? 'Connected to backend' : 'Backend offline';
    }
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Search tracks on Deezer
 */
async function searchTracks(query, limit = 25) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SONGS}/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    return apiFetch(url);
}

/**
 * Get chart/recommended tracks
 */
async function getChartTracks(limit = 25) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SONGS}/charts?limit=${limit}`;
    return apiFetch(url);
}

/**
 * Get tracks by genre
 */
async function getTracksByGenre(genreId, limit = 25) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SONGS}/genre/${genreId}?limit=${limit}`;
    return apiFetch(url);
}

/**
 * Get track details by ID
 */
async function getTrackById(trackId) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SONGS}/${trackId}`;
    return apiFetch(url);
}

/**
 * Get artist's top tracks
 */
async function getArtistTopTracks(artistId, limit = 10) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SONGS}/artist/${artistId}/top?limit=${limit}`;
    return apiFetch(url);
}

/**
 * Get YouTube stream URL
 */
async function getYouTubeStreamUrl(videoId) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STREAM}/youtube/${videoId}`;
    return apiFetch(url);
}

/**
 * Get YouTube video info
 */
async function getYouTubeVideoInfo(videoId) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STREAM}/info/${videoId}`;
    return apiFetch(url);
}

/**
 * Search YouTube
 */
async function searchYouTube(query, maxResults = 10) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STREAM}/search?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
    return apiFetch(url);
}

// Initialize connection check on load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        checkBackendConnection();
        // Check connection every 30 seconds
        setInterval(checkBackendConnection, 30000);
    });
}
