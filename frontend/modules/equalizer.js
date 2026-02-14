/**
 * FASHIN Play - 5-Band Equalizer Module
 * Web Audio API-based equalizer with presets
 */

class Equalizer {
    constructor() {
        this.audioContext = null;
        this.sourceNode = null;
        this.filters = [];
        this.audioElement = null;
        this.isInitialized = false;
        
        // 5-Band frequency configuration
        this.bands = [
            { name: 'Bass', frequency: 100, type: 'lowshelf', gain: 0 },
            { name: 'Low-Mid', frequency: 375, type: 'peaking', gain: 0 },
            { name: 'Mid', frequency: 1250, type: 'peaking', gain: 0 },
            { name: 'High-Mid', frequency: 3000, type: 'peaking', gain: 0 },
            { name: 'Treble', frequency: 10000, type: 'highshelf', gain: 0 }
        ];
        
        // Equalizer presets
        this.presets = {
            normal: [0, 0, 0, 0, 0],
            rock: [3, 1, -1, 2, 3],
            pop: [2, 1, 3, 1, 2],
            hiphop: [5, 2, -2, 1, 2],
            jazz: [2, 1, 4, 2, 3],
            classical: [-2, 0, 2, 2, 3]
        };
        
        this.currentPreset = 'normal';
        
        // Load saved preset
        const savedPreset = localStorage.getItem('fashin_eq_preset');
        if (savedPreset && this.presets[savedPreset]) {
            this.currentPreset = savedPreset;
        }
        
        // Load custom values
        const savedValues = localStorage.getItem('fashin_eq_values');
        if (savedValues) {
            try {
                const values = JSON.parse(savedValues);
                if (Array.isArray(values) && values.length === 5) {
                    values.forEach((val, idx) => {
                        this.bands[idx].gain = val;
                    });
                    this.currentPreset = 'custom';
                }
            } catch (e) {
                console.error('Failed to load EQ values:', e);
            }
        }
    }
    
    /**
     * Initialize the equalizer with an audio element
     */
    init(audioElement) {
        if (this.isInitialized) {
            return;
        }
        
        try {
            this.audioElement = audioElement;
            
            // Create AudioContext
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create source node from audio element
            this.sourceNode = this.audioContext.createMediaElementSource(audioElement);
            
            // Create filters for each band
            let previousNode = this.sourceNode;
            
            this.bands.forEach((band, index) => {
                const filter = this.audioContext.createBiquadFilter();
                filter.type = band.type;
                filter.frequency.value = band.frequency;
                filter.Q.value = 1.0;
                filter.gain.value = band.gain;
                
                previousNode.connect(filter);
                previousNode = filter;
                
                this.filters.push(filter);
            });
            
            // Connect to destination (speakers)
            previousNode.connect(this.audioContext.destination);
            
            this.isInitialized = true;
            console.log('[Equalizer] Initialized successfully');
            
            // Resume context if needed (for autoplay policies)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
        } catch (error) {
            console.error('[Equalizer] Initialization error:', error);
        }
    }
    
    /**
     * Set gain for a specific band
     */
    setBandGain(bandIndex, gainValue) {
        if (!this.isInitialized || !this.filters[bandIndex]) {
            return;
        }
        
        // Clamp value between -12 and +12 dB
        const clampedGain = Math.max(-12, Math.min(12, gainValue));
        
        this.filters[bandIndex].gain.value = clampedGain;
        this.bands[bandIndex].gain = clampedGain;
        
        // Save to localStorage
        this.saveValues();
    }
    
    /**
     * Apply a preset
     */
    applyPreset(presetName) {
        if (!this.presets[presetName]) {
            console.error('[Equalizer] Unknown preset:', presetName);
            return;
        }
        
        const values = this.presets[presetName];
        
        values.forEach((gain, index) => {
            this.setBandGain(index, gain);
        });
        
        this.currentPreset = presetName;
        
        // Save preset preference
        localStorage.setItem('fashin_eq_preset', presetName);
        
        console.log('[Equalizer] Applied preset:', presetName);
    }
    
    /**
     * Get current band values
     */
    getBandValues() {
        return this.bands.map(band => band.gain);
    }
    
    /**
     * Save current values to localStorage
     */
    saveValues() {
        const values = this.getBandValues();
        localStorage.setItem('fashin_eq_values', JSON.stringify(values));
        
        // If values don't match any preset, mark as custom
        let isPreset = false;
        for (const [name, presetValues] of Object.entries(this.presets)) {
            if (JSON.stringify(presetValues) === JSON.stringify(values)) {
                this.currentPreset = name;
                isPreset = true;
                break;
            }
        }
        
        if (!isPreset) {
            this.currentPreset = 'custom';
        }
    }
    
    /**
     * Reset all bands to 0dB
     */
    reset() {
        this.applyPreset('normal');
    }
    
    /**
     * Get equalizer status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            currentPreset: this.currentPreset,
            bands: this.bands.map((band, index) => ({
                name: band.name,
                frequency: band.frequency,
                gain: band.gain
            }))
        };
    }
}

// Create global equalizer instance
window.equalizer = new Equalizer();
