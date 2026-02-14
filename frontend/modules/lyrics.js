/**
 * FASHIN Play - Lyrics Display Module
 * Fetches and displays lyrics from Genius API
 */

class LyricsManager {
    constructor() {
        this.currentLyrics = null;
        this.isVisible = false;
    }
    
    /**
     * Fetch lyrics for a song
     */
    async fetchLyrics(title, artist) {
        try {
            console.log('[Lyrics] Fetching for:', title, artist);
            
            const response = await fetch(
                `${CONFIG.API.BASE_URL}/api/lyrics?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`
            );
            
            const result = await response.json();
            
            if (result.success && result.data) {
                this.currentLyrics = result.data;
                console.log('[Lyrics] Fetched successfully:', result.cached ? '(cached)' : '(fresh)');
                return result.data;
            } else {
                console.log('[Lyrics] Not found');
                this.currentLyrics = null;
                return null;
            }
        } catch (error) {
            console.error('[Lyrics] Fetch error:', error);
            this.currentLyrics = null;
            return null;
        }
    }
    
    /**
     * Display lyrics in the UI
     */
    displayLyrics(lyricsData) {
        const lyricsPanel = document.getElementById('lyrics-panel');
        const lyricsContent = document.getElementById('lyrics-content');
        const lyricsButton = document.getElementById('view-full-lyrics-btn');
        
        if (!lyricsPanel || !lyricsContent) {
            console.error('[Lyrics] UI elements not found');
            return;
        }
        
        if (!lyricsData) {
            this.hideLyrics();
            return;
        }
        
        // Build lyrics preview HTML
        let previewHTML = '';
        if (Array.isArray(lyricsData.preview)) {
            previewHTML = lyricsData.preview.map(line => 
                `<p class="lyrics-line">${this.escapeHtml(line)}</p>`
            ).join('');
        } else if (typeof lyricsData.preview === 'string') {
            previewHTML = `<p class="lyrics-line">${this.escapeHtml(lyricsData.preview)}</p>`;
        }
        
        lyricsContent.innerHTML = previewHTML;
        
        // Set up the "View Full Lyrics" button
        if (lyricsButton && lyricsData.fullLyricsUrl) {
            lyricsButton.style.display = 'block';
            lyricsButton.onclick = () => {
                window.open(lyricsData.fullLyricsUrl, '_blank');
            };
        } else if (lyricsButton) {
            lyricsButton.style.display = 'none';
        }
        
        // Show the panel
        this.showLyrics();
    }
    
    /**
     * Show the lyrics panel
     */
    showLyrics() {
        const lyricsPanel = document.getElementById('lyrics-panel');
        if (lyricsPanel) {
            lyricsPanel.classList.add('visible');
            this.isVisible = true;
        }
    }
    
    /**
     * Hide the lyrics panel
     */
    hideLyrics() {
        const lyricsPanel = document.getElementById('lyrics-panel');
        if (lyricsPanel) {
            lyricsPanel.classList.remove('visible');
            this.isVisible = false;
        }
    }
    
    /**
     * Update lyrics for current track
     */
    async updateForTrack(track) {
        if (!track || !track.title || !track.artist) {
            this.hideLyrics();
            return;
        }
        
        const artistName = typeof track.artist === 'string' 
            ? track.artist 
            : track.artist.name || 'Unknown';
        
        const lyricsData = await this.fetchLyrics(track.title, artistName);
        this.displayLyrics(lyricsData);
    }
    
    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Get current lyrics data
     */
    getCurrentLyrics() {
        return this.currentLyrics;
    }
}

// Create global lyrics manager instance
window.lyricsManager = new LyricsManager();
