const { spawn } = require('child_process');
const path = require('path');

/**
 * Search YouTube for a track and get audio streaming URL using yt-dlp
 * @param {string} title - Song title
 * @param {string} artist - Artist name
 * @returns {Promise<Object>} - Result with streaming URL and metadata
 */
async function getYouTubeAudioUrl(title, artist) {
    try {
        const query = `${title} ${artist} official audio`;
        console.log(`[yt-dlp] Searching YouTube for: ${query}`);

        return new Promise((resolve, reject) => {
            // Use yt-dlp to search and get best audio URL
            const ytdlp = spawn('yt-dlp', [
                '--format', 'bestaudio',
                '--get-url',
                '--get-title',
                '--get-duration',
                '--get-thumbnail',
                '--get-id',
                '--no-playlist',
                '--default-search', 'ytsearch1',
                query
            ]);

            let stdout = '';
            let stderr = '';

            ytdlp.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            ytdlp.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            ytdlp.on('close', (code) => {
                if (code !== 0) {
                    console.error(`[yt-dlp] Error: ${stderr}`);
                    return reject(new Error(`yt-dlp failed with code ${code}: ${stderr}`));
                }

                // Parse output
                const lines = stdout.trim().split('\n').filter(line => line.trim());
                
                if (lines.length < 5) {
                    return reject(new Error('yt-dlp returned incomplete data'));
                }

                const [videoTitle, duration, thumbnail, videoId, streamUrl] = lines;

                resolve({
                    success: true,
                    data: {
                        streamUrl: streamUrl.trim(),
                        title: videoTitle.trim(),
                        artist,
                        duration: duration.trim(),
                        thumbnail: thumbnail.trim(),
                        videoId: videoId.trim(),
                        source: 'youtube'
                    }
                });
            });

            ytdlp.on('error', (error) => {
                console.error(`[yt-dlp] Spawn error:`, error);
                reject(new Error(`Failed to spawn yt-dlp: ${error.message}`));
            });
        });
    } catch (error) {
        console.error('[yt-dlp] Error:', error.message);
        return {
            success: false,
            error: error.message,
            data: null
        };
    }
}

/**
 * Get audio URL for a specific YouTube video ID
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<Object>} - Result with streaming URL
 */
async function getAudioUrlByVideoId(videoId) {
    try {
        console.log(`[yt-dlp] Getting audio URL for video ID: ${videoId}`);

        return new Promise((resolve, reject) => {
            const ytdlp = spawn('yt-dlp', [
                '--format', 'bestaudio',
                '--get-url',
                '--get-title',
                '--get-duration',
                '--get-thumbnail',
                `https://www.youtube.com/watch?v=${videoId}`
            ]);

            let stdout = '';
            let stderr = '';

            ytdlp.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            ytdlp.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            ytdlp.on('close', (code) => {
                if (code !== 0) {
                    console.error(`[yt-dlp] Error: ${stderr}`);
                    return reject(new Error(`yt-dlp failed with code ${code}`));
                }

                const lines = stdout.trim().split('\n').filter(line => line.trim());
                
                if (lines.length < 4) {
                    return reject(new Error('yt-dlp returned incomplete data'));
                }

                const [videoTitle, duration, thumbnail, streamUrl] = lines;

                resolve({
                    success: true,
                    data: {
                        streamUrl: streamUrl.trim(),
                        title: videoTitle.trim(),
                        duration: duration.trim(),
                        thumbnail: thumbnail.trim(),
                        videoId,
                        source: 'youtube'
                    }
                });
            });

            ytdlp.on('error', (error) => {
                console.error(`[yt-dlp] Spawn error:`, error);
                reject(new Error(`Failed to spawn yt-dlp: ${error.message}`));
            });
        });
    } catch (error) {
        console.error('[yt-dlp] Error:', error.message);
        return {
            success: false,
            error: error.message,
            data: null
        };
    }
}

module.exports = {
    getYouTubeAudioUrl,
    getAudioUrlByVideoId
};
