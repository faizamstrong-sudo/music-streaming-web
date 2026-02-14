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
    loadFeaturedSongs();
    loadIndonesianSongs();
    loadInternationalSongs();
    renderPlaylists();
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
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Mode';
    } else {
        themeIcon.textContent = '☀️';
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
                cover: track.image[2]['#text'] || '🎵',
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
                cover: track.image && track.image[2] ? track.image[2]['#text'] : '🎵',
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
    
    const songs = await fetchTopTracks('', 12);
    renderSongGrid(songs, container);
}

async function loadIndonesianSongs() {
    const container = document.getElementById('indonesian-songs');
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    
    // Create sample Indonesian songs
    const indonesianSongs = [
        { id: 'indo-1', title: 'Seperti Bintang', artist: 'Afgan', cover: '🎵', duration: 210, url: null },
        { id: 'indo-2', title: 'Akad', artist: 'Payung Teduh', cover: '🎵', duration: 245, url: null },
        { id: 'indo-3', title: 'Surat Cinta untuk Starla', artist: 'Virgoun', cover: '🎵', duration: 280, url: null },
        { id: 'indo-4', title: 'Mungkin Hari Ini', artist: 'Anneth', cover: '🎵', duration: 195, url: null },
        { id: 'indo-5', title: 'Lathi', artist: 'Weird Genius ft. Sara Fajira', cover: '🎵', duration: 200, url: null },
        { id: 'indo-6', title: 'Bertaut', artist: 'Nadin Amizah', cover: '🎵', duration: 220, url: null }
    ];
    
    renderSongGrid(indonesianSongs, container);
}

async function loadInternationalSongs() {
    const container = document.getElementById('international-songs');
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    
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
                <div class="empty-state-icon">🎵</div>
                <p class="empty-state-text">No songs available</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = songs.map(song => `
        <div class="song-card" data-song='${JSON.stringify(song).replace(/'/g, "&apos;")}'>
            <div class="song-cover">
                ${song.cover.startsWith('http') 
                    ? `<img src="${song.cover}" alt="${song.title}">` 
                    : song.cover}
                <div class="play-button-overlay" onclick="playSong(this.closest('.song-card'))">
                    ▶️
                </div>
            </div>
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
        </div>
    `).join('');
}

function renderPlaylists() {
    const playlistList = document.getElementById('playlist-list');
    const userPlaylists = document.getElementById('user-playlists');
    
    if (state.playlists.length === 0) {
        playlistList.innerHTML = '';
        if (userPlaylists) {
            userPlaylists.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📁</div>
                    <h3 class="empty-state-title">No playlists yet</h3>
                    <p class="empty-state-text">Create your first playlist to get started</p>
                </div>
            `;
        }
        return;
    }
    
    const playlistHTML = state.playlists.map(playlist => `
        <a href="#playlist-${playlist.id}" class="sidebar-item" onclick="viewPlaylist('${playlist.id}')">
            <span class="sidebar-icon">🎵</span>
            <span>${playlist.name}</span>
        </a>
    `).join('');
    
    playlistList.innerHTML = playlistHTML;
    
    if (userPlaylists) {
        userPlaylists.innerHTML = state.playlists.map(playlist => `
            <div class="playlist-card" onclick="viewPlaylist('${playlist.id}')">
                <div class="playlist-cover">🎵</div>
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
                <div class="empty-state-icon">🎵</div>
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
                <div class="empty-state-icon">❤️</div>
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
                <div class="empty-state-icon">📃</div>
                <p class="empty-state-text">Queue is empty</p>
            </div>
        `;
        return;
    }
    
    const upcomingSongs = state.queue.slice(state.currentQueueIndex + 1);
    
    queueList.innerHTML = upcomingSongs.map((song, index) => `
        <div class="queue-item" onclick="playFromQueue(${state.currentQueueIndex + 1 + index})">
            <div class="queue-item-cover">
                ${song.cover.startsWith('http') 
                    ? `<img src="${song.cover}" alt="${song.title}">` 
                    : song.cover}
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
        repeatBtn.textContent = '🔁';
        showNotification('Repeat all enabled');
    } else if (state.repeat === 'all') {
        state.repeat = 'one';
        repeatBtn.textContent = '🔂';
        showNotification('Repeat one enabled');
    } else {
        state.repeat = false;
        repeatBtn.classList.remove('active');
        repeatBtn.textContent = '🔁';
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
        playPauseBtn.textContent = '▶️';
        document.getElementById('player-title').textContent = 'No track selected';
        document.getElementById('player-artist').textContent = 'Artist';
        document.getElementById('player-cover').innerHTML = '🎵';
        return;
    }
    
    playPauseBtn.textContent = state.isPlaying ? '⏸️' : '▶️';
    
    document.getElementById('player-title').textContent = state.currentTrack.title;
    document.getElementById('player-artist').textContent = state.currentTrack.artist;
    
    const playerCover = document.getElementById('player-cover');
    if (state.currentTrack.cover.startsWith('http')) {
        playerCover.innerHTML = `<img src="${state.currentTrack.cover}" alt="${state.currentTrack.title}">`;
    } else {
        playerCover.innerHTML = state.currentTrack.cover;
    }
}

function updateNowPlayingUI() {
    if (!state.currentTrack) return;
    
    document.getElementById('now-playing-title').textContent = state.currentTrack.title;
    document.getElementById('now-playing-artist').textContent = state.currentTrack.artist;
    
    const nowPlayingArt = document.getElementById('now-playing-art');
    if (state.currentTrack.cover.startsWith('http')) {
        nowPlayingArt.innerHTML = `<img src="${state.currentTrack.cover}" alt="${state.currentTrack.title}">`;
    } else {
        nowPlayingArt.innerHTML = state.currentTrack.cover;
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
        volumeIcon.textContent = '🔇';
    } else if (volume < 0.5) {
        volumeIcon.textContent = '🔉';
    } else {
        volumeIcon.textContent = '🔊';
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
                <div class="empty-state-icon">🎵</div>
                <h3 class="empty-state-title">Search for music</h3>
                <p class="empty-state-text">Find your favorite songs and artists</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    
    const results = await searchLastFM(query);
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
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
