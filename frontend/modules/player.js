/**
 * FASHIN Play - Audio Player Module
 * Handles full-duration playback with YouTube streaming via yt-dlp
 */

class AudioPlayer {
    constructor() {
        this.audioElement = null;
        this.currentTrack = null;
        this.isLoading = false;
        this.streamCache = new Map(); // Client-side cache for stream URLs
    }
    
    /**
     * Initialize the player with an audio element
     */
    init(audioElement) {
        this.audioElement = audioElement;
        
        // Initialize equalizer with this audio element
        if (window.equalizer) {
            window.equalizer.init(audioElement);
        }
        
        console.log('[Player] Initialized');
    }
    
    /**
     * Fetch streaming URL from backend (YouTube via yt-dlp with Deezer fallback)
     */
    async fetchStreamUrl(track) {
        try {
            const title = track.title;
            const artist = typeof track.artist === 'string' 
                ? track.artist 
                : track.artist?.name || 'Unknown';
            
            // Check client-side cache first
            const cacheKey = `${title}_${artist}`.toLowerCase();
            const cached = this.streamCache.get(cacheKey);
            
            if (cached && cached.expiresAt > Date.now()) {
                console.log('[Player] Using cached stream URL');
                return cached.data;
            }
            
            // Show loading indicator
            this.showLoadingIndicator();
            
            console.log('[Player] Fetching stream URL for:', title, '-', artist);
            
            const response = await fetch(`${CONFIG.API.BASE_URL}/api/stream/get-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, artist })
            });
            
            const result = await response.json();
            
            this.hideLoadingIndicator();
            
            if (result.success && result.data) {
                // Cache for 23 hours (a bit less than backend to be safe)
                const cacheTime = result.data.source === 'youtube' 
                    ? 23 * 60 * 60 * 1000  // 23 hours for YouTube
                    : 30 * 60 * 1000;       // 30 minutes for Deezer
                
                this.streamCache.set(cacheKey, {
                    data: result.data,
                    expiresAt: Date.now() + cacheTime
                });
                
                // Show notification if fallback was used
                if (result.fallback) {
                    this.showNotification(
                        result.data.message || 'Playing 30-second preview',
                        'warning'
                    );
                }
                
                return result.data;
            } else {
                throw new Error(result.error || 'Failed to fetch stream URL');
            }
        } catch (error) {
            this.hideLoadingIndicator();
            console.error('[Player] Stream URL error:', error);
            this.showNotification('Failed to load audio: ' + error.message, 'error');
            return null;
        }
    }
    
    /**
     * Play a track with full duration support
     */
    async playTrack(track) {
        if (!this.audioElement) {
            console.error('[Player] Audio element not initialized');
            return false;
        }
        
        try {
            // Fetch stream URL
            const streamData = await this.fetchStreamUrl(track);
            
            if (!streamData || !streamData.streamUrl) {
                return false;
            }
            
            // Update current track with stream info
            this.currentTrack = {
                ...track,
                streamUrl: streamData.streamUrl,
                source: streamData.source,
                duration: streamData.duration
            };
            
            // Set audio source and play
            this.audioElement.src = streamData.streamUrl;
            
            try {
                await this.audioElement.play();
                console.log('[Player] Playing:', track.title, '(source:', streamData.source + ')');
                
                // Update lyrics
                if (window.lyricsManager) {
                    window.lyricsManager.updateForTrack(track);
                }
                
                return true;
            } catch (playError) {
                console.error('[Player] Playback error:', playError);
                this.showNotification('Playback failed. Please try again.', 'error');
                return false;
            }
            
        } catch (error) {
            console.error('[Player] Play track error:', error);
            this.showNotification('Failed to play track: ' + error.message, 'error');
            return false;
        }
    }
    
    /**
     * Show loading indicator
     */
    showLoadingIndicator() {
        this.isLoading = true;
        const indicator = document.getElementById('loading-indicator');
        if (indicator) {
            indicator.classList.add('visible');
        }
    }
    
    /**
     * Hide loading indicator
     */
    hideLoadingIndicator() {
        this.isLoading = false;
        const indicator = document.getElementById('loading-indicator');
        if (indicator) {
            indicator.classList.remove('visible');
        }
    }
    
    /**
     * Show notification to user
     */
    showNotification(message, type = 'info') {
        // Use existing toast notification system if available
        if (window.showToast) {
            window.showToast(message);
        } else {
            console.log('[Player] Notification:', message);
        }
    }
    
    /**
     * Pause playback
     */
    pause() {
        if (this.audioElement) {
            this.audioElement.pause();
        }
    }
    
    /**
     * Resume playback
     */
    resume() {
        if (this.audioElement) {
            this.audioElement.play();
        }
    }
    
    /**
     * Stop playback
     */
    stop() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }
        this.currentTrack = null;
    }
    
    /**
     * Get current track
     */
    getCurrentTrack() {
        return this.currentTrack;
    }
    
    /**
     * Clear stream cache
     */
    clearCache() {
        this.streamCache.clear();
        console.log('[Player] Cache cleared');
    }
}

// Create global player instance
window.audioPlayer = new AudioPlayer();
