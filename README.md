# 🎵 FASHIN Play - Professional Music Streaming Platform

A fully functional, production-ready music streaming web application with a modern, professional design and Traditional Javanese aesthetic. Features personalized greetings, Deezer API integration, and YouTube audio streaming capabilities.

![FASHIN Play Dark Mode](https://github.com/user-attachments/assets/23bd3807-c37b-42e3-a2b7-135d10ec4e5d)
![FASHIN Play Light Mode](https://github.com/user-attachments/assets/4575f518-5c4f-48f8-9565-808338e39937)

## ✨ Features

### 🎵 Music Player
- **Full Player Controls**: Play, Pause, Next, Previous with seamless control
- **Progress Bar**: Interactive seek functionality with current time and duration display
- **Volume Control**: Adjustable volume with visual feedback and SVG icons
- **Shuffle & Repeat**: Multiple playback modes (shuffle, repeat all, repeat one)
- **Queue Management**: View and manage upcoming songs

### 🎨 Personalized UI/UX Design
- **Time-Based Greeting**: "Selamat pagi/siang/sore/malam bbyy..." based on time of day
- **Personal Signature**: "FAIZ ❤ SHINTA" displayed with elegant typography
- **Traditional Javanese Color Scheme**:
  - Primary Color: Biru Muda (#4A90E2)
  - Secondary: White (#FFFFFF)  
  - Accent: Gold/Emas (#D4AF37)
  - Subtle batik-inspired patterns
- **Elegant Typography**: Georgia, Playfair Display for personal touch
- **Relocated Theme Toggle**: Small, elegant toggle in bottom-left corner
- **Dark & Light Mode**: Professional color palettes with smooth transitions
- **Connection Status**: Real-time backend connection indicator

### 🎼 Music Integration
- **Deezer API**: Search tracks, browse charts, explore genres (free, no key required)
- **YouTube Streaming**: Audio stream extraction via ytdl-core
- **Smart Caching**: Cache stream URLs for better performance
- **Featured Songs**: Discover trending tracks
- **Indonesian Hits**: Curated collection of Indonesian music
- **International Favorites**: Popular international tracks
- **Search Functionality**: Real-time search with Deezer database

### 📂 Playlist Management
- **Create Playlists**: Build custom collections with names and descriptions
- **Professional Modal**: Clean dialog for playlist creation
- **Persistent Storage**: Playlists saved to localStorage

### 🔍 Search Functionality
- **Real-time Search**: Find songs and artists as you type
- **Deezer Integration**: Powered by Deezer API for music metadata
- **Fallback to Last.fm**: Graceful degradation when backend unavailable

### 💾 Local Storage
- Playlists and collections
- Theme preference (dark/light mode)
- Volume settings
- Recently played history
- Liked songs collection

## 🎨 Design System

### Color Palette - Traditional Javanese Theme

**Dark Mode**
- Primary Background: `#1a1f2e` (Deep navy)
- Secondary Background: `#242938`
- Accent Color: `#4A90E2` (Biru Muda)
- Gold Accent: `#D4AF37` (Emas)
- Text Primary: `#ffffff`
- Text Secondary: `#b8c5d6`
- Batik Pattern: Subtle diagonal patterns with blue and gold

**Light Mode**
- Primary Background: `#f5f7fa` (Light gray)
- Secondary Background: `#FFFFFF` (White)
- Accent Color: `#4A90E2` (Biru Muda)
- Gold Accent: `#D4AF37` (Emas)
- Text Primary: `#1a1f2e`
- Text Secondary: `#4a5568`

### Typography
- Font Family: Georgia, Playfair Display, serif (elegant and personal)
- Headings: 700 weight
- Body: 400-600 weight

### Spacing Scale
- 4px, 8px, 12px, 16px, 24px, 32px

### Border Radius
- Small: 4px
- Medium: 8px
- Large: 12px
- Circular: 50%

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FASHIN Play Architecture                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend (Port 8000)          Backend (Port 3000)           │
│  ├── index.html                ├── server.js                 │
│  ├── styles.css                ├── routes/                   │
│  ├── app.js                    │   ├── songs.js              │
│  └── api-client.js             │   └── stream.js             │
│                                ├── controllers/              │
│                                │   ├── deezer.js             │
│                                │   └── youtube.js            │
│                                └── utils/                    │
│                                                               │
│  ┌──────────────┐              ┌──────────────┐             │
│  │   Browser    │─────────────▶│   Express    │             │
│  │              │   REST API   │   Server     │             │
│  └──────────────┘◀─────────────└──────────────┘             │
│         │                              │                     │
│         │                              ├──────────┐          │
│         │                              │          │          │
│         │                       ┌──────▼─────┐ ┌─▼────────┐ │
│         │                       │   Deezer   │ │  ytdl-   │ │
│         │                       │    API     │ │   core   │ │
│         │                       └────────────┘ └──────────┘ │
│         │                                                     │
│         └─────────────────────────────────────────────────┐  │
│                          localStorage                      │  │
│                    (Playlists, Settings, etc.)            │  │
│                                                             │  │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js v14 or higher
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation & Running

#### Option 1: Automated Start (Recommended)

**Start Backend:**
```bash
cd backend
chmod +x start.sh
./start.sh
```

**Start Frontend (in a new terminal):**
```bash
chmod +x start-frontend.sh
./start-frontend.sh
```

#### Option 2: Manual Start

**1. Start Backend Server:**
```bash
cd backend
npm install
npm start
```

**2. Start Frontend Server (in a new terminal):**
```bash
# Using Python 3
python3 -m http.server 8000

# Or using Node.js
npx http-server -p 8000
```

**3. Access the application:**
- Frontend: `http://localhost:8000`
- Backend API: `http://localhost:3000`
- Health Check: `http://localhost:3000/health`

### Verification

1. Open `http://localhost:8000` in your browser
2. Check "Backend Connected" indicator in top-right
3. Browse featured songs and Indonesian hits
4. Try searching for music
5. Toggle between dark and light themes (button in bottom-left)

## 📁 Project Structure

```
music-streaming-web/
├── index.html              # Main HTML with semantic structure
├── styles.css              # Javanese-themed CSS with batik patterns
├── app.js                  # Frontend JavaScript with greeting system
├── api-client.js           # Backend API client
├── start-frontend.sh       # Frontend startup script
├── README.md              # This file
│
├── backend/               # Node.js + Express Backend
│   ├── package.json       # Backend dependencies
│   ├── server.js          # Express server setup
│   ├── start.sh           # Backend startup script
│   ├── README.md          # Backend documentation
│   │
│   ├── routes/            # API Routes
│   │   ├── songs.js       # Deezer API routes
│   │   └── stream.js      # YouTube streaming routes
│   │
│   ├── controllers/       # Business Logic
│   │   ├── deezer.js      # Deezer API integration
│   │   └── youtube.js     # YouTube stream extraction
│   │
│   └── utils/             # Helper utilities
│
└── .gitignore            # Git ignore rules
```

## 🔧 Technical Stack

### Frontend
- **HTML5**: Semantic markup with inline SVG icons
- **CSS3**: Modern features (Grid, Flexbox, CSS Variables, Transitions)
- **JavaScript (ES6+)**: Vanilla JavaScript with async/await
- **Google Fonts**: Playfair Display for elegant typography

### Backend
- **Node.js + Express.js**: RESTful API server
- **ytdl-core**: YouTube audio extraction
- **axios**: HTTP client for Deezer API
- **node-cache**: In-memory caching for stream URLs
- **cors**: Cross-origin resource sharing

### APIs Used
- **Deezer API**: Music metadata, search, and charts (free, no authentication)
- **YouTube**: Audio streaming via ytdl-core

### Storage
- **LocalStorage**: Client-side data persistence (playlists, settings)
- **Node-Cache**: Server-side caching (stream URLs, API responses)

## 🎮 User Guide

### Playing Music
1. Browse featured songs or Indonesian hits
2. Click the play button overlay on any song card
3. Use player controls at the bottom to manage playback

### Creating Playlists
1. Click "Create Playlist" in the sidebar
2. Enter a name and optional description
3. Click "Create Playlist" to save

### Searching for Music
1. Click "Search" in the sidebar
2. Type song name or artist in the search box
3. Results appear automatically from Deezer

### Changing Theme
- Click the theme toggle button in the bottom-left corner
- Preference is saved automatically

### Playback Modes
- **Shuffle**: Random playback order
- **Repeat All**: Loop through all songs in queue
- **Repeat One**: Repeat current song continuously

## 📝 API Endpoints

### Health Check
- `GET /health` - Check backend server status

### Songs (Deezer)
- `GET /api/songs/search?q={query}&limit={limit}` - Search tracks
- `GET /api/songs/charts?limit={limit}` - Get chart tracks
- `GET /api/songs/genre/{genreId}?limit={limit}` - Get tracks by genre
- `GET /api/songs/{trackId}` - Get track details
- `GET /api/songs/artist/{artistId}/top?limit={limit}` - Get artist's top tracks

### Streaming (YouTube)
- `GET /api/stream/youtube/{videoId}` - Get stream URL for video
- `GET /api/stream/info/{videoId}` - Get video information
- `GET /api/stream/search?q={query}` - Search YouTube
- `POST /api/stream/cache/clear` - Clear stream cache

## 🔐 Privacy & Security

- **No Login Required**: Use all features without an account
- **Local Data Only**: All personal data stored in browser localStorage
- **No Tracking**: No analytics or tracking scripts
- **Client-Side Only**: No server communication except for music APIs
- **CORS Protected**: Backend properly configured for security

## 🛠️ Development

### Key Features Implemented
1. **Time-Based Greeting System**: Updates every minute
2. **Backend Connection Monitoring**: Checks every 30 seconds
3. **Smart Fallback**: Gracefully degrades to Last.fm when backend unavailable
4. **Mock Data**: Development mode with sample tracks
5. **Responsive Design**: Works on desktop, tablet, and mobile

### Environment Variables (Optional)

Create a `.env` file in the backend directory:
```env
PORT=3000
NODE_ENV=development
```

### CORS Configuration

The backend accepts requests from:
- `http://localhost:8000`
- `http://127.0.0.1:8000`
- `http://localhost:5500` (Live Server)

## 📈 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Traditional Javanese color inspiration
- FASHIN Play branding and design
- Professional SVG icons (inline)
- Music metadata from Deezer API
- YouTube audio streaming via ytdl-core

## 🐛 Troubleshooting

### Backend won't start
- Make sure port 3000 is not in use: `lsof -i :3000`
- Check Node.js version: `node --version` (should be v14+)
- Reinstall dependencies: `cd backend && rm -rf node_modules && npm install`

### Frontend can't connect to backend
- Verify backend is running: `curl http://localhost:3000/health`
- Check browser console for CORS errors
- Ensure both servers are running on correct ports

### Songs not loading
- Check backend logs for errors
- Verify Deezer API is accessible (mock data will be used if not)
- Clear browser cache and reload

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**FASHIN Play - Streaming Music dengan Sentuhan Tradisional Indonesia** 🎵🎶

Made with ❤️ by FAIZ & SHINTA
