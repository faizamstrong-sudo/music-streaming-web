# FASHIN Play Backend Server

Backend server for FASHIN Play Music Streaming application with Deezer API integration and YouTube audio streaming.

## Features

- 🎵 **Deezer API Integration**: Search tracks, get charts, browse by genre
- 🎬 **YouTube Audio Streaming**: Extract audio streams using ytdl-core
- 💾 **Smart Caching**: Cache stream URLs for better performance
- 🔒 **CORS Enabled**: Properly configured for frontend communication
- ⚡ **Express.js**: Fast and minimal web framework

## Prerequisites

- Node.js v14 or higher
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- **GET** `/health` - Check server status

### Songs (Deezer API)
- **GET** `/api/songs/search?q={query}&limit={limit}` - Search tracks
- **GET** `/api/songs/charts?limit={limit}` - Get chart tracks
- **GET** `/api/songs/genre/{genreId}?limit={limit}` - Get tracks by genre
- **GET** `/api/songs/{trackId}` - Get track details
- **GET** `/api/songs/artist/{artistId}/top?limit={limit}` - Get artist's top tracks

### Streaming (YouTube)
- **GET** `/api/stream/youtube/{videoId}` - Get stream URL for video
- **GET** `/api/stream/info/{videoId}` - Get video information
- **GET** `/api/stream/search?q={query}&maxResults={max}` - Search YouTube
- **POST** `/api/stream/cache/clear` - Clear stream cache

## Example Requests

### Search for tracks
```bash
curl "http://localhost:3000/api/songs/search?q=adele&limit=10"
```

### Get chart tracks
```bash
curl "http://localhost:3000/api/songs/charts?limit=20"
```

### Get YouTube stream URL
```bash
curl "http://localhost:3000/api/stream/youtube/dQw4w9WgXcQ"
```

## Environment Variables

Create a `.env` file in the backend directory (optional):

```env
PORT=3000
NODE_ENV=development
```

## CORS Configuration

The server is configured to accept requests from:
- `http://localhost:8000`
- `http://127.0.0.1:8000`
- `http://localhost:5500` (Live Server)

## Caching

Stream URLs are cached for 1 hour to improve performance and reduce API calls.

## Error Handling

All endpoints return JSON responses with a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Dependencies

- `express` - Web framework
- `cors` - CORS middleware
- `axios` - HTTP client for Deezer API
- `ytdl-core` - YouTube audio extraction
- `node-cache` - In-memory caching

## Development

The server includes request logging for debugging:
```
[2024-02-14T10:30:00.000Z] GET /api/songs/search?q=test
```

## Notes

- YouTube stream URLs expire after a certain time
- Deezer API is free and doesn't require authentication
- The server caches stream URLs to minimize API calls
- For production, consider implementing rate limiting

## License

MIT
