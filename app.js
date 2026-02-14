// Music Streaming Web Application
// All-in-one JavaScript file with complete functionality

// ============================================
// Configuration & Constants
// ============================================
const CONFIG = {
    LASTFM_API_KEY: '8d0d5e4f99dd5b9c17cfafea0d3d3d3d', // Public Last.fm API key for demo
    STORAGE_KEYS: {
        PLAYLISTS: 'music_playlists',
        LIKED_SONGS: 'liked_songs',
        RECENT_PLAYED: 'recently_played',
        THEME: 'theme_preference',
        VOLUME: 'volume_preference',
        QUEUE: 'current_queue'
    }
};

// ============================================
// State Management
// ============================================
const state = {
    currentTrack: null,
    isPlaying: false,
    queue: [],
    currentQueueIndex: -1,
    shuffle: false,
    repeat: false, // false, 'one', 'all'
    volume: 0.7,
    playlists: [],
    likedSongs: [],
    recentlyPlayed: [],
    currentView: 'home',
    currentPlaylist: null
};

// ============================================
// Audio Player Setup
// ============================================
const audioPlayer = document.getElementById('audio-player');

// ============================================
// Initialize App
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadFromStorage();
    setupEventListeners();
    setupAudioListeners();
    renderView('home');
    updatePlayerUI();
    updateGreeting(); // Add greeting
    loadFeaturedSongs();
    loadIndonesianSongs();
    loadInternationalSongs();
    renderPlaylists();
    
    // Update greeting every minute
    setInterval(updateGreeting, 60000);
}

// ============================================
// Greeting System
// ============================================
function updateGreeting() {
    const hour = new Date().getHours();
    let greeting;
    
    if (hour >= 5 && hour < 11) {
        greeting = 'Selamat pagi bbyy...';
    } else if (hour >= 11 && hour < 15) {
        greeting = 'Selamat siang bbyy...';
    } else if (hour >= 15 && hour < 18) {
        greeting = 'Selamat sore bbyy...';
    } else {
        greeting = 'Selamat malam bbyy...';
    }
    
    const greetingElement = document.getElementById('greeting-text');
    if (greetingElement) {
        greetingElement.textContent = greeting;
    }
}

// ============================================
// Connection Status Update
// ============================================
function updateConnectionStatus(connected) {
    const indicator = document.getElementById('connection-status');
    const text = document.getElementById('connection-text');
    
    if (indicator && text) {
        indicator.className = 'connection-status ' + (connected ? 'connected' : 'disconnected');
        text.textContent = connected ? 'Backend Connected' : 'Backend Offline';
    }
}

// ============================================
// Storage Functions
// ============================================
function loadFromStorage() {
    // Load theme
    const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || 'dark';
    setTheme(savedTheme);
    
    // Load playlists
    const savedPlaylists = localStorage.getItem(CONFIG.STORAGE_KEYS.PLAYLISTS);
    state.playlists = savedPlaylists ? JSON.parse(savedPlaylists) : [];
    
    // Load liked songs
    const savedLiked = localStorage.getItem(CONFIG.STORAGE_KEYS.LIKED_SONGS);
    state.likedSongs = savedLiked ? JSON.parse(savedLiked) : [];
    
    // Load recently played
    const savedRecent = localStorage.getItem(CONFIG.STORAGE_KEYS.RECENT_PLAYED);
    state.recentlyPlayed = savedRecent ? JSON.parse(savedRecent) : [];
    
    // Load volume
    const savedVolume = localStorage.getItem(CONFIG.STORAGE_KEYS.VOLUME);
    state.volume = savedVolume ? parseFloat(savedVolume) : 0.7;
    audioPlayer.volume = state.volume;
}

function saveToStorage() {
    localStorage.setItem(CONFIG.STORAGE_KEYS.PLAYLISTS, JSON.stringify(state.playlists));
    localStorage.setItem(CONFIG.STORAGE_KEYS.LIKED_SONGS, JSON.stringify(state.likedSongs));
    localStorage.setItem(CONFIG.STORAGE_KEYS.RECENT_PLAYED, JSON.stringify(state.recentlyPlayed));
    localStorage.setItem(CONFIG.STORAGE_KEYS.VOLUME, state.volume);
}

// ============================================
// Event Listeners Setup
// ============================================
function setupEventListeners() {
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Sidebar navigation
    document.querySelectorAll('.sidebar-item[data-view]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = e.currentTarget.dataset.view;
            renderView(view);
            updateActiveSidebarItem(e.currentTarget);
        });
    });
    
    // Player controls
    document.getElementById('play-pause-btn').addEventListener('click', togglePlayPause);
    document.getElementById('next-btn').addEventListener('click', playNext);
    document.getElementById('prev-btn').addEventListener('click', playPrevious);
    document.getElementById('shuffle-btn').addEventListener('click', toggleShuffle);
    document.getElementById('repeat-btn').addEventListener('click', toggleRepeat);
    
    // Progress bar
    document.getElementById('progress-bar').addEventListener('click', seekTrack);
    
    // Volume control
    document.getElementById('volume-slider').addEventListener('click', setVolume);
    document.getElementById('volume-icon').addEventListener('click', toggleMute);
    
    // Create playlist
    document.getElementById('create-playlist-btn').addEventListener('click', (e) => {
        e.preventDefault();
        showModal('create-playlist-modal');
    });
    
    document.getElementById('close-modal').addEventListener('click', () => {
        hideModal('create-playlist-modal');
    });
    
    document.getElementById('create-playlist-form').addEventListener('submit', createPlaylist);
    
    // Search
    const searchInput = document.getElementById('search-input');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchSongs(e.target.value);
        }, 500);
    });
}

function setupAudioListeners() {
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', handleTrackEnd);
    audioPlayer.addEventListener('loadedmetadata', () => {
        updateDuration();
    });
    audioPlayer.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        showNotification('Unable to play this track. Trying next...');
        playNext();
    });
}

// ============================================
// Theme Functions
// ============================================
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, theme);
    
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    if (theme === 'dark') {
        themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        themeText.textContent = 'Dark Mode';
    } else {
        themeIcon.innerHTML = `
            <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        `;
        themeText.textContent = 'Light Mode';
    }
}

// ============================================
// View Management
// ============================================
function renderView(viewName) {
    // Hide all views
    document.querySelectorAll('.view-content').forEach(view => {
        view.classList.add('hidden');
    });
    
    // Show selected view
    const viewElement = document.getElementById(`${viewName}-view`);
    if (viewElement) {
        viewElement.classList.remove('hidden');
        state.currentView = viewName;
    }
    
    // Render view-specific content
    switch(viewName) {
        case 'library':
            renderLibrary();
            break;
        case 'liked':
            renderLikedSongs();
            break;
        case 'search':
            break;
    }
}

function updateActiveSidebarItem(activeItem) {
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    activeItem.classList.add('active');
}

// ============================================
// API Functions - Music Data
// ============================================
async function fetchTopTracks(tag = '', limit = 12) {
    try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${CONFIG.LASTFM_API_KEY}&format=json&limit=${limit}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.tracks && data.tracks.track) {
            return data.tracks.track.map(track => ({
                id: `${track.artist.name}-${track.name}`.replace(/\s/g, '-').toLowerCase(),
                title: track.name,
                artist: track.artist.name,
                cover: track.image[2]['#text'] || '',
                duration: 210, // Default duration
                url: null // Will be populated when playing
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching tracks:', error);
        return [];
    }
}

async function searchLastFM(query) {
    if (!query.trim()) return [];
    
    try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${CONFIG.LASTFM_API_KEY}&format=json&limit=20`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results && data.results.trackmatches && data.results.trackmatches.track) {
            const tracks = Array.isArray(data.results.trackmatches.track) 
                ? data.results.trackmatches.track 
                : [data.results.trackmatches.track];
                
            return tracks.map(track => ({
                id: `${track.artist}-${track.name}`.replace(/\s/g, '-').toLowerCase(),
                title: track.name,
                artist: track.artist,
                cover: track.image && track.image[2] ? track.image[2]['#text'] : '',
                duration: 210,
                url: null
            }));
        }
        return [];
    } catch (error) {
        console.error('Error searching tracks:', error);
        return [];
    }
}

async function loadFeaturedSongs() {
    const container = document.getElementById('featured-songs');
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    
    try {
        // Try backend first (Deezer API)
        if (typeof getChartTracks !== 'undefined') {
            const result = await getChartTracks(12);
            if (result.success && result.data) {
                renderSongGrid(result.data, container);
                return;
            }
        }
    } catch (error) {
        console.log('Backend not available, using fallback');
    }
    
    // Fallback to LastFM
    const songs = await fetchTopTracks('', 12);
    renderSongGrid(songs, container);
}

async function loadIndonesianSongs() {
    const container = document.getElementById('indonesian-songs');
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    
    try {
        // Try backend first - search for Indonesian hits
        if (typeof searchTracks !== 'undefined') {
            const result = await searchTracks('indonesia pop hits', 12);
            if (result.success && result.data && result.data.length > 0) {
                renderSongGrid(result.data, container);
                return;
            }
        }
    } catch (error) {
        console.log('Backend not available, using fallback');
    }
    
    // Fallback: Create sample Indonesian songs
    const indonesianSongs = [
        { id: 'indo-1', title: 'Seperti Bintang', artist: 'Afgan', cover: '', duration: 210, url: null },
        { id: 'indo-2', title: 'Akad', artist: 'Payung Teduh', cover: '', duration: 245, url: null },
        { id: 'indo-3', title: 'Surat Cinta untuk Starla', artist: 'Virgoun', cover: '', duration: 280, url: null },
        { id: 'indo-4', title: 'Mungkin Hari Ini', artist: 'Anneth', cover: '', duration: 195, url: null },
        { id: 'indo-5', title: 'Lathi', artist: 'Weird Genius ft. Sara Fajira', cover: '', duration: 200, url: null },
        { id: 'indo-6', title: 'Bertaut', artist: 'Nadin Amizah', cover: '', duration: 220, url: null }
    ];
    
    renderSongGrid(indonesianSongs, container);
}

async function loadInternationalSongs() {
    const container = document.getElementById('international-songs');
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    
    try {
        // Try backend first
        if (typeof searchTracks !== 'undefined') {
            const result = await searchTracks('international pop', 12);
            if (result.success && result.data) {
                renderSongGrid(result.data.slice(0, 6), container);
                return;
            }
        }
    } catch (error) {
        console.log('Backend not available, using fallback');
    }
    
    // Fallback to LastFM
    const songs = await fetchTopTracks('', 12);
    renderSongGrid(songs.slice(0, 6), container);
}

// ============================================
// Render Functions
// ============================================
function renderSongGrid(songs, container) {
    if (!songs || songs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18V5L21 12L9 19V18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="empty-state-text">No songs available</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = songs.map(song => {
        // Handle both Deezer format (cover.medium) and old format (cover as string)
        let coverUrl = '';
        if (song.cover) {
            if (typeof song.cover === 'object' && song.cover.medium) {
                coverUrl = song.cover.medium;
            } else if (typeof song.cover === 'string') {
                coverUrl = song.cover;
            }
        }
        
        return `
        <div class="song-card" data-song='${JSON.stringify(song).replace(/'/g, "&apos;")}'>
            <div class="song-cover">
                ${coverUrl && coverUrl.startsWith('http') 
                    ? `<img src="${coverUrl}" alt="${song.title}">` 
                    : `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18V5L21 12L9 19V18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>`}
                <div class="play-button-overlay" onclick="playSong(this.closest('.song-card'))">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>
                    </svg>
                </div>
            </div>
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
        </div>
        `;
    }).join('');
}

function renderPlaylists() {
    const playlistList = document.getElementById('playlist-list');
    const userPlaylists = document.getElementById('user-playlists');
    
    if (state.playlists.length === 0) {
        playlistList.innerHTML = '';
        if (userPlaylists) {
            userPlaylists.innerHTML = `
                <div class="empty-state">
                    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h3 class="empty-state-title">No playlists yet</h3>
                    <p class="empty-state-text">Create your first playlist to get started</p>
                </div>
            `;
        }
        return;
    }
    
    const playlistHTML = state.playlists.map(playlist => `
        <a href="#playlist-${playlist.id}" class="sidebar-item" onclick="viewPlaylist('${playlist.id}')">
            <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18V5L21 12L9 19V18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>${playlist.name}</span>
        </a>
    `).join('');
    
    playlistList.innerHTML = playlistHTML;
    
    if (userPlaylists) {
        userPlaylists.innerHTML = state.playlists.map(playlist => `
            <div class="playlist-card" onclick="viewPlaylist('${playlist.id}')">
                <div class="playlist-cover">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18V5L21 12L9 19V18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="playlist-info">
                    <h3>${playlist.name}</h3>
                    <p>${playlist.songs.length} songs</p>
                </div>
            </div>
        `).join('');
    }
}

function renderLibrary() {
    const recentlyPlayedContainer = document.getElementById('recently-played');
    
    if (state.recentlyPlayed.length === 0) {
        recentlyPlayedContainer.innerHTML = `
            <div class="empty-state">
                <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18V5L21 12L9 19V18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="empty-state-text">No recently played songs</p>
            </div>
        `;
    } else {
        renderSongGrid(state.recentlyPlayed.slice(0, 12), recentlyPlayedContainer);
    }
    
    renderPlaylists();
}

function renderLikedSongs() {
    const likedSongsContainer = document.getElementById('liked-songs');
    
    if (state.likedSongs.length === 0) {
        likedSongsContainer.innerHTML = `
            <div class="empty-state">
                <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61C20.3292 4.09935 19.7228 3.69627 19.0554 3.42513C18.3879 3.15398 17.6725 3.01998 16.95 3.03C16.2275 3.04002 15.5164 3.19418 14.8563 3.48364C14.1963 3.7731 13.6001 4.19217 13.1 4.72L12 5.82L10.9 4.72C9.86963 3.68963 8.49077 3.1113 7.05 3.1113C5.60923 3.1113 4.23037 3.68963 3.2 4.72C2.16963 5.75037 1.5913 7.12923 1.5913 8.57C1.5913 10.0108 2.16963 11.3896 3.2 12.42L12 21.22L20.8 12.42C21.3106 11.9092 21.7137 11.3028 21.9849 10.6354C22.256 9.96789 22.39 9.25249 22.38 8.53C22.37 7.80751 22.2158 7.09639 21.9264 6.43637C21.6369 5.77635 21.2178 5.18013 20.69 4.67L20.84 4.61Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h3 class="empty-state-title">No liked songs yet</h3>
                <p class="empty-state-text">Songs you like will appear here</p>
            </div>
        `;
    } else {
        renderSongGrid(state.likedSongs, likedSongsContainer);
    }
}

function renderQueue() {
    const queueList = document.getElementById('queue-list');
    
    if (state.queue.length === 0 || state.currentQueueIndex === state.queue.length - 1) {
        queueList.innerHTML = `
            <div class="empty-state">
                <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="empty-state-text">Queue is empty</p>
            </div>
        `;
        return;
    }
    
    const upcomingSongs = state.queue.slice(state.currentQueueIndex + 1);
    
    queueList.innerHTML = upcomingSongs.map((song, index) => `
        <div class="queue-item" onclick="playFromQueue(${state.currentQueueIndex + 1 + index})">
            <div class="queue-item-cover">
                ${song.cover && song.cover.startsWith('http') 
                    ? `<img src="${song.cover}" alt="${song.title}">` 
                    : `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18V5L21 12L9 19V18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>`}
            </div>
            <div class="queue-item-info">
                <div class="queue-item-title">${song.title}</div>
                <div class="queue-item-artist">${song.artist}</div>
            </div>
        </div>
    `).join('');
}

// ============================================
// Playlist Functions
// ============================================
function createPlaylist(e) {
    e.preventDefault();
    
    const name = document.getElementById('playlist-name').value;
    const description = document.getElementById('playlist-description').value;
    
    const playlist = {
        id: Date.now().toString(),
        name: name,
        description: description,
        songs: [],
        createdAt: new Date().toISOString()
    };
    
    state.playlists.push(playlist);
    saveToStorage();
    renderPlaylists();
    
    hideModal('create-playlist-modal');
    document.getElementById('create-playlist-form').reset();
    showNotification(`Playlist "${name}" created successfully!`);
}

function viewPlaylist(playlistId) {
    const playlist = state.playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    state.currentPlaylist = playlist;
    
    document.getElementById('playlist-detail-title').textContent = playlist.name;
    document.getElementById('playlist-detail-count').textContent = `${playlist.songs.length} songs`;
    
    const songsContainer = document.getElementById('playlist-detail-songs');
    renderSongGrid(playlist.songs, songsContainer);
    
    renderView('playlist-detail');
}

function addToPlaylist(song, playlistId) {
    const playlist = state.playlists.find(p => p.id === playlistId);
    if (playlist) {
        const exists = playlist.songs.some(s => s.id === song.id);
        if (!exists) {
            playlist.songs.push(song);
            saveToStorage();
            showNotification(`Added to ${playlist.name}`);
        } else {
            showNotification('Song already in playlist');
        }
    }
}

// ============================================
// Player Functions
// ============================================
function playSong(element) {
    const songData = element.dataset.song;
    if (!songData) return;
    
    const song = JSON.parse(songData);
    
    // Add to queue if not already playing from queue
    if (state.currentTrack?.id !== song.id) {
        state.queue = [song];
        state.currentQueueIndex = 0;
    }
    
    playTrack(song);
}

async function playTrack(song) {
    state.currentTrack = song;
    state.isPlaying = true;
    
    // Update UI
    updatePlayerUI();
    updateNowPlayingUI();
    
    // For demo purposes, we'll use a sample audio URL
    // In production, this would fetch from yt-dlp or similar service
    const demoAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    
    try {
        audioPlayer.src = demoAudioUrl;
        await audioPlayer.play();
        
        // Add to recently played
        addToRecentlyPlayed(song);
    } catch (error) {
        console.error('Error playing track:', error);
        showNotification('Unable to play this track');
        state.isPlaying = false;
        updatePlayerUI();
    }
}

function togglePlayPause() {
    if (!state.currentTrack) {
        showNotification('Please select a song to play');
        return;
    }
    
    if (state.isPlaying) {
        audioPlayer.pause();
        state.isPlaying = false;
    } else {
        audioPlayer.play();
        state.isPlaying = true;
    }
    
    updatePlayerUI();
}

function playNext() {
    if (state.queue.length === 0) return;
    
    if (state.shuffle) {
        // Play random song
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * state.queue.length);
        } while (randomIndex === state.currentQueueIndex && state.queue.length > 1);
        
        state.currentQueueIndex = randomIndex;
    } else {
        state.currentQueueIndex++;
        
        if (state.currentQueueIndex >= state.queue.length) {
            if (state.repeat === 'all') {
                state.currentQueueIndex = 0;
            } else {
                state.currentQueueIndex = state.queue.length - 1;
                return;
            }
        }
    }
    
    playTrack(state.queue[state.currentQueueIndex]);
}

function playPrevious() {
    if (state.queue.length === 0) return;
    
    if (audioPlayer.currentTime > 3) {
        // If more than 3 seconds played, restart current song
        audioPlayer.currentTime = 0;
        return;
    }
    
    state.currentQueueIndex--;
    
    if (state.currentQueueIndex < 0) {
        if (state.repeat === 'all') {
            state.currentQueueIndex = state.queue.length - 1;
        } else {
            state.currentQueueIndex = 0;
            return;
        }
    }
    
    playTrack(state.queue[state.currentQueueIndex]);
}

function playFromQueue(index) {
    if (index < 0 || index >= state.queue.length) return;
    
    state.currentQueueIndex = index;
    playTrack(state.queue[index]);
}

function toggleShuffle() {
    state.shuffle = !state.shuffle;
    const shuffleBtn = document.getElementById('shuffle-btn');
    
    if (state.shuffle) {
        shuffleBtn.classList.add('active');
        showNotification('Shuffle enabled');
    } else {
        shuffleBtn.classList.remove('active');
        showNotification('Shuffle disabled');
    }
}

function toggleRepeat() {
    const repeatBtn = document.getElementById('repeat-btn');
    
    if (state.repeat === false) {
        state.repeat = 'all';
        repeatBtn.classList.add('active');
        repeatBtn.setAttribute('aria-label', 'Repeat all enabled');
        showNotification('Repeat all enabled');
    } else if (state.repeat === 'all') {
        state.repeat = 'one';
        repeatBtn.setAttribute('aria-label', 'Repeat one enabled');
        repeatBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="17 1 21 5 17 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 11V9C3 7.93913 3.42143 6.92172 4.17157 6.17157C4.92172 5.42143 5.93913 5 7 5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="7 23 3 19 7 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 13V15C21 16.0609 20.5786 17.0783 19.8284 17.8284C19.0783 18.5786 18.0609 19 17 19H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <text x="12" y="15" text-anchor="middle" font-size="10" fill="currentColor">1</text>
        </svg>`;
        showNotification('Repeat one enabled');
    } else {
        state.repeat = false;
        repeatBtn.classList.remove('active');
        repeatBtn.removeAttribute('aria-label');
        repeatBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="17 1 21 5 17 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 11V9C3 7.93913 3.42143 6.92172 4.17157 6.17157C4.92172 5.42143 5.93913 5 7 5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="7 23 3 19 7 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 13V15C21 16.0609 20.5786 17.0783 19.8284 17.8284C19.0783 18.5786 18.0609 19 17 19H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
        showNotification('Repeat disabled');
    }
}

function handleTrackEnd() {
    if (state.repeat === 'one') {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        playNext();
    }
}

// ============================================
// Player UI Updates
// ============================================
function updatePlayerUI() {
    const playPauseBtn = document.getElementById('play-pause-btn');
    
    if (!state.currentTrack) {
        playPauseBtn.innerHTML = `<svg class="play-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>
        </svg>`;
        document.getElementById('player-title').textContent = 'No track selected';
        document.getElementById('player-artist').textContent = 'Artist';
        document.getElementById('player-cover').innerHTML = `<svg class="default-track-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18V5L21 12L9 19V18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
        return;
    }
    
    if (state.isPlaying) {
        playPauseBtn.innerHTML = `<svg class="play-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
            <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
        </svg>`;
    } else {
        playPauseBtn.innerHTML = `<svg class="play-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>
        </svg>`;
    }
    
    document.getElementById('player-title').textContent = state.currentTrack.title;
    document.getElementById('player-artist').textContent = state.currentTrack.artist;
    
    const playerCover = document.getElementById('player-cover');
    if (state.currentTrack.cover && state.currentTrack.cover.startsWith('http')) {
        playerCover.innerHTML = `<img src="${state.currentTrack.cover}" alt="${state.currentTrack.title}">`;
    } else {
        playerCover.innerHTML = `<svg class="default-track-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18V5L21 12L9 19V18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    }
}

function updateNowPlayingUI() {
    if (!state.currentTrack) return;
    
    document.getElementById('now-playing-title').textContent = state.currentTrack.title;
    document.getElementById('now-playing-artist').textContent = state.currentTrack.artist;
    
    const nowPlayingArt = document.getElementById('now-playing-art');
    if (state.currentTrack.cover && state.currentTrack.cover.startsWith('http')) {
        nowPlayingArt.innerHTML = `<img src="${state.currentTrack.cover}" alt="${state.currentTrack.title}">`;
    } else {
        nowPlayingArt.innerHTML = `<svg class="default-track-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18V5L21 12L9 19V18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    }
    
    renderQueue();
}

function updateProgress() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration || 0;
    
    const progressFill = document.getElementById('progress-fill');
    const percentage = (currentTime / duration) * 100;
    progressFill.style.width = `${percentage}%`;
    
    document.getElementById('current-time').textContent = formatTime(currentTime);
}

function updateDuration() {
    const duration = audioPlayer.duration || 0;
    document.getElementById('duration-time').textContent = formatTime(duration);
}

function seekTrack(e) {
    const progressBar = document.getElementById('progress-bar');
    const clickX = e.offsetX;
    const width = progressBar.offsetWidth;
    const percentage = clickX / width;
    
    audioPlayer.currentTime = audioPlayer.duration * percentage;
}

function setVolume(e) {
    const volumeSlider = document.getElementById('volume-slider');
    const clickX = e.offsetX;
    const width = volumeSlider.offsetWidth;
    const volume = clickX / width;
    
    audioPlayer.volume = volume;
    state.volume = volume;
    localStorage.setItem(CONFIG.STORAGE_KEYS.VOLUME, volume);
    
    updateVolumeUI();
}

function toggleMute() {
    if (audioPlayer.volume > 0) {
        audioPlayer.volume = 0;
    } else {
        audioPlayer.volume = state.volume || 0.7;
    }
    
    updateVolumeUI();
}

function updateVolumeUI() {
    const volumeFill = document.getElementById('volume-fill');
    const volumeIcon = document.getElementById('volume-icon');
    const volume = audioPlayer.volume;
    
    volumeFill.style.width = `${volume * 100}%`;
    
    if (volume === 0) {
        volumeIcon.innerHTML = `
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        `;
    } else if (volume < 0.5) {
        volumeIcon.innerHTML = `
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        `;
    } else {
        volumeIcon.innerHTML = `
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        `;
    }
}

// ============================================
// Search Functions
// ============================================
async function searchSongs(query) {
    const resultsContainer = document.getElementById('search-results-container');
    
    if (!query.trim()) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18V5L21 12L9 19V18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h3 class="empty-state-title">Search for music</h3>
                <p class="empty-state-text">Find your favorite songs and artists</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    
    let results = [];
    
    try {
        // Try backend first (Deezer API)
        if (typeof searchTracks !== 'undefined') {
            const result = await searchTracks(query, 20);
            if (result.success && result.data) {
                results = result.data;
            }
        }
    } catch (error) {
        console.log('Backend search not available, using fallback');
    }
    
    // Fallback to LastFM if no results from backend
    if (results.length === 0) {
        results = await searchLastFM(query);
    }
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h3 class="empty-state-title">No results found</h3>
                <p class="empty-state-text">Try searching with different keywords</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = `
        <div class="section">
            <div class="section-header">
                <h2 class="section-title">Search Results</h2>
            </div>
            <div class="song-grid" id="search-results-grid"></div>
        </div>
    `;
    
    renderSongGrid(results, document.getElementById('search-results-grid'));
}

// ============================================
// Utility Functions
// ============================================
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function addToRecentlyPlayed(song) {
    // Remove if already exists
    state.recentlyPlayed = state.recentlyPlayed.filter(s => s.id !== song.id);
    
    // Add to beginning
    state.recentlyPlayed.unshift(song);
    
    // Keep only last 50 songs
    if (state.recentlyPlayed.length > 50) {
        state.recentlyPlayed = state.recentlyPlayed.slice(0, 50);
    }
    
    saveToStorage();
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function showNotification(message) {
    // Simple notification (can be enhanced with a toast library)
    console.log('Notification:', message);
}

// ============================================
// Global Functions (for onclick handlers)
// ============================================
window.playSong = playSong;
window.viewPlaylist = viewPlaylist;
window.playFromQueue = playFromQueue;
