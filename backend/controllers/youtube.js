const ytdl = require('ytdl-core');
const axios = require('axios');

/**
 * Get YouTube stream URL for a given video ID
 */
async function getStreamUrl(videoId) {
    try {
        if (!ytdl.validateID(videoId)) {
            throw new Error('Invalid YouTube video ID');
        }

        const info = await ytdl.getInfo(videoId);
        
        // Get audio-only formats
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        
        if (audioFormats.length === 0) {
            throw new Error('No audio formats available');
        }
        
        // Sort by quality and select best
        const bestFormat = audioFormats.sort((a, b) => {
            return (b.audioBitrate || 0) - (a.audioBitrate || 0);
        })[0];
        
        return {
            success: true,
            data: {
                videoId,
                streamUrl: bestFormat.url,
                title: info.videoDetails.title,
                author: info.videoDetails.author.name,
                duration: info.videoDetails.lengthSeconds,
                thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
                format: {
                    quality: bestFormat.quality,
                    audioBitrate: bestFormat.audioBitrate,
                    audioCodec: bestFormat.audioCodec,
                    container: bestFormat.container
                }
            }
        };
    } catch (error) {
        console.error('YouTube stream error:', error.message);
        return {
            success: false,
            error: error.message,
            data: null
        };
    }
}

/**
 * Search YouTube for a track
 */
async function searchYouTube(query, maxResults = 10) {
    try {
        // Note: This is a simplified search using ytdl.
        // For production, consider using YouTube Data API v3
        const searchQuery = `${query} official audio`;
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
        
        return {
            success: true,
            message: 'Use YouTube Data API for search',
            searchUrl
        };
    } catch (error) {
        console.error('YouTube search error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get video info
 */
async function getVideoInfo(videoId) {
    try {
        if (!ytdl.validateID(videoId)) {
            throw new Error('Invalid YouTube video ID');
        }

        const info = await ytdl.getInfo(videoId);
        
        return {
            success: true,
            data: {
                videoId,
                title: info.videoDetails.title,
                author: info.videoDetails.author.name,
                duration: info.videoDetails.lengthSeconds,
                thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
                description: info.videoDetails.description,
                viewCount: info.videoDetails.viewCount
            }
        };
    } catch (error) {
        console.error('YouTube info error:', error.message);
        return {
            success: false,
            error: error.message,
            data: null
        };
    }
}

module.exports = {
    getStreamUrl,
    searchYouTube,
    getVideoInfo
};
