# FASHIN Play V1 Features Documentation

## 🎵 Feature Overview

FASHIN Play V1 introduces three major features that transform the music streaming experience:

1. **Full Music Playback** - No more 30-second limits
2. **Lyrics Display** - Legal lyrics preview with Genius integration
3. **5-Band Equalizer** - Professional audio control

---

## 1. Full Music Playback (No 30s Limit)

### Description
Full-duration audio playback using YouTube audio extraction via yt-dlp, with automatic fallback to Deezer previews.

### How It Works
- **Primary Source**: YouTube audio extraction using yt-dlp CLI
- **Fallback Source**: Deezer 30-second previews when YouTube is unavailable
- **Caching**: Stream URLs cached for 24 hours to reduce API calls
- **Rate Limiting**: 5 YouTube requests per minute to prevent abuse

### User Experience
1. Click any song to play
2. System automatically fetches full-duration audio from YouTube
3. Loading indicator appears during fetch
4. If YouTube fails, automatically falls back to Deezer preview
5. Seamless playback begins once URL is fetched

### Technical Details
- **Backend**: `/api/stream/get-url` POST endpoint
- **Input**: `{ title, artist }` or `{ videoId }`
- **Response**: `{ streamUrl, title, artist, duration, thumbnail, source }`
- **Caching**: NodeCache with 24-hour TTL
- **Error Handling**: Automatic fallback, retry with exponential backoff

---

## 2. Lyrics Display (Legal & Safe)

### Description
Display lyrics preview from Genius with a link to view full lyrics on Genius.com, respecting copyright laws.

### How It Works
- **API**: Genius API (free, no authentication required)
- **Preview**: Shows 3-5 line preview of lyrics
- **Full Lyrics**: Button to open complete lyrics on Genius website
- **Caching**: Results cached for 7 days

### User Experience
1. Play a song
2. Lyrics panel automatically appears with preview
3. Click "View Full Lyrics on Genius" to see complete lyrics
4. Panel auto-hides if lyrics unavailable
5. Clean, readable typography with smooth animations

### Technical Details
- **Backend**: `/api/lyrics` GET endpoint
- **Query Params**: `title`, `artist`
- **Response**: `{ preview, fullLyricsUrl, title, artist, thumbnail }`
- **Caching**: NodeCache with 7-day TTL
- **Legal**: Only preview displayed; full lyrics viewed on Genius

---

## 3. 5-Band Equalizer

### Description
Professional-grade 5-band equalizer using Web Audio API for real-time audio processing.

### Frequency Bands
1. **Bass** (100Hz) - Lowshelf filter
2. **Low-Mid** (375Hz) - Peaking filter  
3. **Mid** (1.25kHz) - Peaking filter
4. **High-Mid** (3kHz) - Peaking filter
5. **Treble** (10kHz) - Highshelf filter

### Presets
- **Normal**: Flat response (0dB all bands)
- **Rock**: +3dB bass, +1dB low-mid, -1dB mid, +2dB high-mid, +3dB treble
- **Pop**: +2dB bass, +1dB low-mid, +3dB mid, +1dB high-mid, +2dB treble
- **Hip-Hop**: +5dB bass, +2dB low-mid, -2dB mid, +1dB high-mid, +2dB treble
- **Jazz**: +2dB bass, +1dB low-mid, +4dB mid, +2dB high-mid, +3dB treble
- **Classical**: -2dB bass, 0dB low-mid, +2dB mid, +2dB high-mid, +3dB treble

### User Experience
1. Equalizer panel visible on bottom-left of screen
2. Click preset button to apply pre-configured sound
3. Manually adjust any slider (-12dB to +12dB range)
4. Settings automatically saved to localStorage
5. Real-time audio processing - changes apply instantly

### Technical Details
- **Technology**: Web Audio API
- **Filters**: BiquadFilter nodes chained together
- **Storage**: localStorage for persistent settings
- **Processing**: Client-side, no backend required
- **Compatibility**: All modern browsers with Web Audio API support

---

## Performance Optimizations

### Caching Strategy
- **Stream URLs**: 24-hour cache (YouTube), 1-hour cache (Deezer fallback)
- **Lyrics**: 7-day cache
- **Client-side**: URL cache in memory to avoid redundant requests

### Rate Limiting
- YouTube: Maximum 5 requests per minute
- Automatic fallback to Deezer when rate limit exceeded

### Error Handling
- Graceful degradation: YouTube → Deezer → Error message
- User-friendly error notifications
- Automatic retry with exponential backoff
- Network timeout handling (10 seconds)

---

## Browser Compatibility

### Required Features
- HTML5 Audio API
- Web Audio API (for equalizer)
- Fetch API
- LocalStorage
- ES6+ JavaScript

### Tested Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Usage Tips

### For Best Audio Quality
1. Use YouTube source when available (full duration)
2. Adjust equalizer to your preference
3. Use headphones for better bass response

### For Lyrics
1. Lyrics availability depends on Genius database
2. Not all songs have lyrics
3. Preview is limited to respect copyright

### For Equalizer
1. Start with a preset, then fine-tune
2. Extreme settings (+/-12dB) may cause distortion
3. Settings persist across sessions

---

## Future Enhancements

### Planned Features
- Visual frequency spectrum analyzer
- Custom EQ preset saving
- Lyrics karaoke mode (if licensing allows)
- Audio visualization
- Crossfade between tracks
- Playlist sharing

### Under Consideration
- Spotify integration
- SoundCloud support
- Offline playback
- Smart recommendations based on EQ preferences
