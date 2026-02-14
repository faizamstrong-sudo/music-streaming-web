# 🎵 Music Streaming Web Application

A fully functional music streaming web application with a modern Spotify-like design. Built with pure HTML, CSS, and JavaScript - no backend required!

![Music App Dark Mode](https://github.com/user-attachments/assets/85cbda9e-6292-4662-89d9-8e24945e4552)
![Music App Light Mode](https://github.com/user-attachments/assets/1f500503-6ad7-4ae7-a76c-cd100ce209e0)

## ✨ Features

### 🎵 Music Player
- **Full Player Controls**: Play, Pause, Next, Previous with seamless control
- **Progress Bar**: Interactive seek functionality with current time and duration display
- **Volume Control**: Adjustable volume with visual feedback
- **Shuffle & Repeat**: Multiple playback modes (shuffle, repeat all, repeat one)
- **Queue Management**: View and manage upcoming songs

### 📱 Modern UI/UX
- **3-Column Layout**: Sidebar navigation, main content area, and now playing sidebar
- **Dark & Light Mode**: Toggle between themes with smooth transitions
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Empty States**: User-friendly messages when no content is available

### 🎼 Music Library
- **Featured Songs**: Discover trending tracks
- **Indonesian Hits**: Curated collection of Indonesian music
- **International Favorites**: Popular international tracks
- **Recently Played**: Track your listening history
- **Liked Songs**: Save your favorite tracks

### 📂 Playlist Management
- **Create Playlists**: Build custom collections with names and descriptions
- **Edit Playlists**: Add or remove songs from playlists
- **Delete Playlists**: Remove playlists you no longer need
- **Persistent Storage**: Playlists saved to localStorage

### 🔍 Search Functionality
- **Real-time Search**: Find songs and artists as you type
- **API Integration**: Powered by Last.fm API for music metadata
- **Search Results Grid**: Beautiful display of search results

### 💾 Local Storage
- Playlists and collections
- Theme preference (dark/light mode)
- Volume settings
- Recently played history
- Liked songs collection

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or backend required!

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/faizamstrong-sudo/music-streaming-web.git
cd music-streaming-web
```

2. **Open in browser**
```bash
# Option 1: Using Python
python3 -m http.server 8000

# Option 2: Using Node.js
npx http-server

# Option 3: Just open index.html directly
open index.html
```

3. **Access the application**
Navigate to `http://localhost:8000` in your browser

## 📁 Project Structure

```
music-streaming-web/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS styling with themes
├── app.js             # All JavaScript functionality
└── README.md          # Documentation
```

## 🎨 Design Features

### Color Schemes

**Dark Mode (Default)**
- Background: Deep blacks and grays
- Accent: Spotify green (#1db954)
- Text: White and light gray

**Light Mode**
- Background: Clean whites and light grays
- Accent: Spotify green (#1db954)
- Text: Black and dark gray

### Layout
- **Left Sidebar (250px)**: Navigation and playlists
- **Main Content (Flexible)**: Featured songs and content
- **Right Sidebar (300px)**: Now playing and queue
- **Player Bar (90px)**: Fixed bottom player controls

### Responsive Breakpoints
- **Desktop**: Full 3-column layout (1200px+)
- **Tablet**: 2-column layout without right sidebar (768px-1200px)
- **Mobile**: Single column with collapsible sidebar (<768px)

## 🔧 Technical Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern features (Grid, Flexbox, CSS Variables)
- **JavaScript (ES6+)**: Vanilla JavaScript, no frameworks

### APIs Used
- **Last.fm API**: Music metadata and search
- **Demo Audio**: SoundHelix for testing (in production, integrate with yt-dlp or similar)

### Storage
- **LocalStorage**: Client-side data persistence

## 🎮 User Guide

### Playing Music
1. Browse featured songs or Indonesian hits
2. Click the play button on any song card
3. Use player controls at the bottom to manage playback

### Creating Playlists
1. Click "Create Playlist" in the sidebar
2. Enter a name and optional description
3. Click "Create Playlist" to save

### Searching for Music
1. Click "Search" in the sidebar
2. Type song name or artist in the search box
3. Results appear automatically as you type

### Changing Theme
- Click the theme toggle button at the bottom of the sidebar
- Preference is saved automatically

### Managing Volume
1. Use the volume slider on the right side of the player bar
2. Click the volume icon to mute/unmute

### Playback Modes
- **Shuffle**: Random playback order
- **Repeat All**: Loop through all songs in queue
- **Repeat One**: Repeat current song continuously

## 🔐 Privacy & Security

- **No Login Required**: Use all features without an account
- **Local Data Only**: All personal data stored in browser localStorage
- **No Tracking**: No analytics or tracking scripts
- **Client-Side Only**: No server communication except for music APIs

## 🛠️ Development

### Adding New Features

**To add a new music source:**
```javascript
// In app.js
async function fetchFromNewSource() {
    // Add your API integration here
}
```

**To customize theme colors:**
```css
/* In styles.css */
:root {
    --accent-color: #yourcolor;
    /* Add more variables */
}
```

### API Integration

The application uses Last.fm API for music metadata. To use your own API key:

1. Get a free API key from [Last.fm API](https://www.last.fm/api)
2. Update the API key in `app.js`:
```javascript
const CONFIG = {
    LASTFM_API_KEY: 'your-api-key-here',
    // ...
};
```

### Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📝 Future Enhancements

Potential features for future versions:

- [ ] Lyrics integration
- [ ] Social sharing
- [ ] Import/export playlists
- [ ] Advanced equalizer
- [ ] Music visualization
- [ ] Keyboard shortcuts
- [ ] PWA support for offline usage
- [ ] Integration with more music APIs
- [ ] Collaborative playlists
- [ ] Song recommendations based on listening history

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

- Design inspiration from Spotify
- Music metadata from Last.fm API
- Icons using Unicode emojis for simplicity
- Demo audio from SoundHelix

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ for music lovers everywhere**

Enjoy your music! 🎵🎶
