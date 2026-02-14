# FASHIN Play API Documentation

## Base URL
```
http://localhost:3000/api
```

---

## Health Check

### GET /health
Check if the backend server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "FASHIN Play Backend is running",
  "timestamp": "2026-02-14T18:00:00.000Z"
}
```

---

## Stream API

### POST /api/stream/get-url
Get streaming URL for a song using YouTube (via yt-dlp) with Deezer fallback.

**Request Body:**
```json
{
  "title": "Shape of You",
  "artist": "Ed Sheeran"
}
```

OR

```json
{
  "videoId": "JGwWNGJdvx8"
}
```

**Success Response (YouTube):**
```json
{
  "success": true,
  "data": {
    "streamUrl": "https://...",
    "title": "Shape of You",
    "artist": "Ed Sheeran",
    "duration": "233",
    "thumbnail": "https://...",
    "videoId": "JGwWNGJdvx8",
    "source": "youtube"
  },
  "cached": false
}
```

**Success Response (Deezer Fallback):**
```json
{
  "success": true,
  "data": {
    "streamUrl": "https://cdns-preview-e.dzcdn.net/...",
    "title": "Shape of You",
    "artist": "Ed Sheeran",
    "duration": 233,
    "thumbnail": "https://...",
    "source": "deezer",
    "message": "30-second preview only (YouTube unavailable)"
  },
  "cached": false,
  "fallback": true
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Unable to find audio stream from any source"
}
```

**Rate Limit Response:**
```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again in a minute."
}
```

**Notes:**
- YouTube URLs are cached for 24 hours
- Deezer fallback URLs are cached for 1 hour
- Rate limit: 5 YouTube requests per minute
- Automatic fallback to Deezer if YouTube fails

---

### GET /api/stream/status
Get stream service status and cache statistics.

**Response:**
```json
{
  "success": true,
  "status": "online",
  "message": "Stream service is operational",
  "cacheStats": {
    "keys": 15,
    "stats": {
      "hits": 42,
      "misses": 15,
      "keys": 15,
      "ksize": 0,
      "vsize": 0
    }
  }
}
```

---

### POST /api/stream/cache/clear
Clear the stream URL cache (admin endpoint).

**Response:**
```json
{
  "success": true,
  "message": "Stream cache cleared"
}
```

---

## Lyrics API

### GET /api/lyrics
Get lyrics preview for a song from Genius.

**Query Parameters:**
- `title` (required): Song title
- `artist` (required): Artist name

**Example:**
```
GET /api/lyrics?title=Shape%20of%20You&artist=Ed%20Sheeran
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "title": "Shape of You",
    "artist": "Ed Sheeran",
    "fullLyricsUrl": "https://genius.com/Ed-sheeran-shape-of-you-lyrics",
    "thumbnail": "https://...",
    "preview": [
      "♪ Shape of You ♪",
      "by Ed Sheeran",
      "",
      "Lyrics are available on Genius.",
      "Click \"View Full Lyrics\" below to read the complete lyrics."
    ],
    "message": "Preview only - Click \"View Full Lyrics\" to see complete lyrics on Genius"
  },
  "cached": false
}
```

**Error Response (Not Found):**
```json
{
  "success": false,
  "error": "Lyrics not found",
  "data": null
}
```

**Notes:**
- Results are cached for 7 days
- Only preview is provided to respect copyright
- Full lyrics available via Genius URL

---

### GET /api/lyrics/search
Search for songs on Genius.

**Query Parameters:**
- `q` (required): Search query
- `limit` (optional): Number of results (default: 5, max: 100)

**Example:**
```
GET /api/lyrics/search?q=shape+of+you&limit=5
```

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "title": "Shape of You",
      "artist": "Ed Sheeran",
      "url": "https://genius.com/Ed-sheeran-shape-of-you-lyrics",
      "thumbnail": "https://..."
    }
  ]
}
```

---

### GET /api/lyrics/status
Get lyrics service status and cache statistics.

**Response:**
```json
{
  "success": true,
  "status": "online",
  "message": "Lyrics service is operational",
  "cacheStats": {
    "keys": 8,
    "stats": {
      "hits": 20,
      "misses": 8,
      "keys": 8,
      "ksize": 0,
      "vsize": 0
    }
  }
}
```

---

### POST /api/lyrics/cache/clear
Clear the lyrics cache (admin endpoint).

**Response:**
```json
{
  "success": true,
  "message": "Lyrics cache cleared"
}
```

---

## Songs API

### GET /api/songs/search
Search for songs on Deezer.

**Query Parameters:**
- `q` (required): Search query
- `limit` (optional): Number of results (default: 25, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 3135556,
      "title": "Shape of You",
      "artist": "Ed Sheeran",
      "artistId": 4050,
      "album": "÷ (Deluxe)",
      "albumId": 14408426,
      "duration": 233,
      "cover": {
        "small": "https://...",
        "medium": "https://...",
        "large": "https://...",
        "xl": "https://..."
      },
      "preview": "https://cdns-preview-e.dzcdn.net/...",
      "link": "https://www.deezer.com/track/3135556"
    }
  ]
}
```

---

### GET /api/songs/trending
Get trending songs.

**Query Parameters:**
- `limit` (optional): Number of results (default: 25, max: 100)

**Response:** Same format as search

---

### GET /api/songs/recommendations
Get recommended songs.

**Query Parameters:**
- `limit` (optional): Number of results (default: 25, max: 100)

**Response:** Same format as search

---

### GET /api/songs/trending-id
Get trending Indonesian songs.

**Query Parameters:**
- `limit` (optional): Number of results (default: 25, max: 100)

**Response:** Same format as search

---

## Error Handling

All endpoints return consistent error format:

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (missing required parameters)
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "status": 404
}
```

---

## Rate Limiting

### YouTube Stream Requests
- **Limit**: 5 requests per minute per IP
- **Reset**: Every 60 seconds
- **Fallback**: Automatic switch to Deezer when limit exceeded

---

## Caching

### Cache Duration
- **Stream URLs (YouTube)**: 24 hours (86400 seconds)
- **Stream URLs (Deezer)**: 1 hour (3600 seconds)
- **Lyrics**: 7 days (604800 seconds)

### Cache Keys
- **Stream**: `{title}_{artist}` (lowercase, spaces to underscores)
- **Lyrics**: `{title}_{artist}` (lowercase, spaces to underscores)

### Cache Statistics
Available via `/api/stream/status` and `/api/lyrics/status` endpoints.

---

## CORS Configuration

### Allowed Origins
- `http://localhost:8000`
- `http://127.0.0.1:8000`
- `http://localhost:5500`

### Credentials
- Enabled for all allowed origins

---

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3000
GENIUS_ACCESS_TOKEN=your_genius_token_here
```

**Notes:**
- `PORT`: Server port (default: 3000)
- `GENIUS_ACCESS_TOKEN`: Optional Genius API token for higher rate limits

---

## Dependencies

### Required
- `express` ^4.18.2
- `cors` ^2.8.5
- `axios` ^1.6.0
- `dotenv` ^16.3.1
- `node-cache` ^5.1.2

### System Requirements
- **Node.js**: v20.0.0 or higher
- **yt-dlp**: Installed globally or in PATH

---

## Installation

### Install yt-dlp
```bash
# Using pip
pip install yt-dlp

# Or download binary from https://github.com/yt-dlp/yt-dlp/releases
```

### Install Node Dependencies
```bash
cd backend
npm install
```

### Start Server
```bash
npm start
```

---

## Testing

### Health Check
```bash
curl http://localhost:3000/health
```

### Test Stream Endpoint
```bash
curl -X POST http://localhost:3000/api/stream/get-url \
  -H "Content-Type: application/json" \
  -d '{"title": "Shape of You", "artist": "Ed Sheeran"}'
```

### Test Lyrics Endpoint
```bash
curl "http://localhost:3000/api/lyrics?title=Shape%20of%20You&artist=Ed%20Sheeran"
```

---

## Performance Tips

1. **Use caching**: Cache is automatically enabled
2. **Rate limiting**: Respect the 5 req/min YouTube limit
3. **Fallback**: Deezer fallback ensures availability
4. **Timeout**: All requests have 10-second timeout
5. **Connection pooling**: Axios handles connection reuse
