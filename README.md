# FASHIN Play - Music Streaming Web Application

Modern music streaming web application dengan design batik Indonesia tradisional, terintegrasi dengan Deezer API untuk real music streaming.

## ✨ Features

### 🎵 Music Streaming
- **Real Deezer Integration** - Stream actual music from Deezer's extensive library
- **HTML5 Audio Player** - Native audio playback with full controls
- **30-Second Previews** - High-quality preview clips for all tracks
- **Instant Playback** - No delay, click and play

### 🎮 Player Controls
- Play/Pause functionality
- Next/Previous track navigation
- Shuffle mode
- Repeat (off/all/one) modes
- Progress bar with seek capability
- Volume control with slider
- Current time & duration display

### 🔍 Search & Discovery
- Live search dari Deezer API
- Trending songs
- Recommendations
- Genre-based discovery
- Indonesian music section
- International hits section

### 📝 Playlist Management
- Create custom playlists
- Add/remove songs
- Recently played history
- Liked songs collection

### 🎨 Design
- Traditional Javanese Batik aesthetic
- Blue-White-Gold color theme
- Dark/Light mode toggle
- Responsive design
- Mobile-friendly interface
- Smooth animations

## 🚀 One-Click Setup & Launch

### Prerequisites
- **Node.js v20+** - [Download](https://nodejs.org/)
- **Python 3+** - [Download](https://www.python.org/)

### Installation & Running

#### Windows (1-Click):
```bash
# Double-click or run:
start.bat
```
That's it! The script will:
1. ✅ Check Node.js and Python installation
2. ✅ Auto-install backend dependencies
3. ✅ Start backend server (port 3000)
4. ✅ Start frontend server (port 8000)
5. ✅ Open browser automatically

#### Mac/Linux (1-Click):
```bash
# Make executable (first time only):
chmod +x start.sh

# Run:
./start.sh
```
The script will:
1. ✅ Check Node.js and Python installation
2. ✅ Auto-install backend dependencies
3. ✅ Start backend server (port 3000)
4. ✅ Start frontend server (port 8000)
5. ✅ Open browser automatically

#### Manual Installation (Alternative):
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
python -m http.server 8000
# or: python3 -m http.server 8000
```

## 🌐 Access Points

- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## 📡 API Endpoints

### Songs (Deezer Integration)
- `GET /api/songs/search?q={query}` - Search tracks
- `GET /api/songs/trending` - Get trending tracks
- `GET /api/songs/recommendations` - Get recommended tracks
- `GET /api/songs/charts` - Get chart toppers
- `GET /api/songs/:trackId` - Get track details
- `GET /api/songs/genre/:genreId` - Get tracks by genre
- `GET /api/songs/artist/:artistId/top` - Get artist's top tracks

### Streaming
- `GET /api/stream/youtube/:videoId` - Get YouTube stream URL
- `GET /api/stream/info/:videoId` - Get video info
- `GET /api/stream/search?q={query}` - Search YouTube

## 🏗️ File Structure
```
music-streaming-web/
├── start.bat              # Windows 1-click launcher
├── start.sh               # Mac/Linux 1-click launcher
├── backend/
│   ├── package.json       # Backend dependencies
│   ├── server.js          # Express server
│   ├── controllers/
│   │   ├── deezer.js      # Deezer API integration
│   │   └── youtube.js     # YouTube integration
│   ├── routes/
│   │   ├── songs.js       # Song routes
│   │   └── stream.js      # Stream routes
│   └── utils/
│       └── cache.js       # Caching utilities
├── frontend/
│   ├── index.html         # Main HTML with audio player
│   ├── styles.css         # Batik-themed styling
│   └── app.js             # Complete app logic
├── README.md              # This file
├── INSTALLATION.md        # Detailed installation guide
└── .gitignore
```

## 🔧 Technologies

### Frontend
- HTML5 (with Audio API)
- CSS3 (Variables, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Fetch API for backend communication

### Backend
- Node.js v20+
- Express.js - Web framework
- Axios - HTTP client
- CORS - Cross-origin support
- Node-Cache - Response caching
- Deezer API - Music data & previews

### APIs
- **Deezer API** - https://api.deezer.com (No auth required)
  - Real music data
  - Album covers
  - 30-second preview URLs
  - Artist information
  - Charts and recommendations

## 🎯 How It Works

1. **Backend** fetches music data from Deezer API
2. **Frontend** displays songs with album art
3. **Click Play** on any song
4. **Audio Player** streams 30-second preview from Deezer
5. **Full Controls** - Play/pause, seek, volume, next/prev
6. **Playlist** management stored in browser localStorage

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```

### Node.js Not Found
- Install from: https://nodejs.org/
- Restart terminal after installation
- Verify: `node --version`

### Python Not Found
- Install from: https://www.python.org/
- Restart terminal after installation
- Verify: `python --version` or `python3 --version`

### Backend Won't Start
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

### No Audio Playing
- Check browser console for errors
- Ensure preview URL exists (not all tracks have previews)
- Check audio permissions in browser
- Try different browser (Chrome recommended)

### CORS Errors
- Backend automatically enables CORS for localhost:8000
- If issues persist, check browser console
- Ensure backend is running on port 3000

## 📝 License

Personal Project - FAIZ ❤ SHINTA

## 🤝 Contributing

This is a personal project. Feel free to fork and customize!

## 💖 Author

**FAIZ ❤ SHINTA**

Crafted with love, powered by music 🎵
