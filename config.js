// Frontend Configuration for FASHIN Play
// Centralized configuration for the music streaming application

const CONFIG = {
    // Backend API Configuration
    API: {
        BASE_URL: 'http://localhost:3000',
        ENDPOINTS: {
            SONGS: '/api/songs',
            STREAM: '/api/stream',
            HEALTH: '/health'
        },
        TIMEOUT: 10000 // 10 seconds
    },
    
    // Application Settings
    APP: {
        NAME: 'FASHIN Play',
        VERSION: '1.0.0',
        DESCRIPTION: 'Professional Music Streaming Platform',
        THEME_DEFAULT: 'dark'
    },
    
    // Storage Keys for localStorage
    STORAGE_KEYS: {
        PLAYLISTS: 'fashin_playlists',
        LIKED_SONGS: 'fashin_liked_songs',
        RECENTLY_PLAYED: 'fashin_recently_played',
        THEME: 'fashin_theme',
        VOLUME: 'fashin_volume',
        QUEUE: 'fashin_queue',
        CURRENT_TRACK: 'fashin_current_track'
    },
    
    // Player Configuration
    PLAYER: {
        DEFAULT_VOLUME: 0.7,
        SEEK_STEP: 5, // seconds
        UPDATE_INTERVAL: 1000 // ms
    },
    
    // UI Configuration
    UI: {
        SONGS_PER_PAGE: 25,
        SEARCH_DEBOUNCE: 500, // ms
        TOAST_DURATION: 3000, // ms
        ANIMATION_DURATION: 300 // ms
    },
    
    // Theme Colors (Traditional Javanese)
    COLORS: {
        PRIMARY: '#4A90E2',    // Biru Muda (Light Blue)
        SECONDARY: '#FFFFFF',  // White
        ACCENT: '#D4AF37',     // Gold/Emas
        DARK_BG: '#1a1f2e',
        LIGHT_BG: '#f5f7fa'
    },
    
    // Greeting Messages
    GREETINGS: {
        MORNING: 'Selamat pagi bbyy...',
        NOON: 'Selamat siang bbyy...',
        AFTERNOON: 'Selamat sore bbyy...',
        EVENING: 'Selamat malam bbyy...'
    },
    
    // Personal Signature
    SIGNATURE: 'FAIZ ❤ SHINTA',
    
    // Feature Flags
    FEATURES: {
        YOUTUBE_STREAMING: true,
        DEEZER_INTEGRATION: true,
        OFFLINE_MODE: true,
        BATIK_DESIGN: true
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
