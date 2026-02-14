# 🎵 FASHIN Play - Complete Tutorial

Welcome to FASHIN Play, your professional music streaming platform with Traditional Javanese design! This comprehensive guide will walk you through every step to get started.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the Application](#running-the-application)
4. [Using the Application](#using-the-application)
5. [Features Guide](#features-guide)
6. [Troubleshooting](#troubleshooting)
7. [FAQs](#faqs)

---

## Prerequisites

Before you begin, make sure you have the following installed on your computer:

### Required Software

#### 1. Node.js (v14 or higher)

**Why?** Node.js powers the backend server that handles music data and streaming.

**Download:** https://nodejs.org/

**To check if installed:**
```bash
node --version
npm --version
```

You should see version numbers like `v18.16.0` and `9.5.1`.

#### 2. Python (v3.7 or higher) - Recommended

**Why?** Python provides a simple HTTP server for serving the frontend files.

**Download:** https://www.python.org/

**To check if installed:**
```bash
# Mac/Linux
python3 --version

# Windows
python --version
```

You should see a version number like `Python 3.10.0`.

**Alternative:** If you don't have Python, you can use Node.js's `http-server` package instead.

### Optional Software

- **Git** - For cloning the repository and version control
- **Visual Studio Code** - For viewing/editing code (optional)

---

## Installation

### Step 1: Get the Code

#### Option A: Clone with Git (Recommended)

```bash
git clone https://github.com/faizamstrong-sudo/music-streaming-web.git
cd music-streaming-web
```

#### Option B: Download ZIP

1. Go to the GitHub repository
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to your desired location
5. Open terminal/command prompt in the extracted folder

### Step 2: Automated Setup (Easiest)

We provide an automated setup script that checks all prerequisites and installs dependencies:

```bash
# Mac/Linux/Git Bash
node scripts/setup.js

# Windows Command Prompt
node scripts\setup.js

# Windows PowerShell
node scripts\setup.js
```

This script will:
- ✓ Check Node.js and npm installation
- ✓ Check Python installation (optional)
- ✓ Install all backend dependencies
- ✓ Create configuration files
- ✓ Verify project structure

### Step 3: Manual Setup (Alternative)

If the automated setup doesn't work, follow these manual steps:

#### Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend

# Install npm packages
npm install

# Go back to root directory
cd ..
```

#### Create Environment File

Create a file named `.env` in the `backend/` directory with the following content:

```env
PORT=3000
NODE_ENV=development
```

**On Windows:**
```batch
cd backend
echo PORT=3000> .env
echo NODE_ENV=development>> .env
cd ..
```

**On Mac/Linux:**
```bash
cd backend
cat > .env << EOF
PORT=3000
NODE_ENV=development
EOF
cd ..
```

---

## Running the Application

FASHIN Play consists of two parts:
1. **Backend Server** (Node.js) - Runs on port 3000
2. **Frontend Server** (Static files) - Runs on port 8000

Both need to be running simultaneously.

### Method 1: Automated Startup Scripts (Recommended)

#### For Windows Users

**Option A: Batch Script**
```batch
scripts\start-windows.bat
```
Double-click `scripts/start-windows.bat` or run the command above.

**Option B: PowerShell**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\start-powershell.ps1
```

#### For Mac/Linux Users

```bash
# Make script executable (first time only)
chmod +x scripts/start-unix.sh

# Run the script
./scripts/start-unix.sh
```

The script will:
1. ✓ Start the backend server (port 3000)
2. ✓ Start the frontend server (port 8000)
3. ✓ Open your browser automatically
4. ✓ Display status information

To stop: Press `Ctrl+C` in the terminal

### Method 2: Manual Startup

If the automated scripts don't work, you can start each server manually:

#### Terminal/Command Prompt 1 - Backend

```bash
# Navigate to backend directory
cd backend

# Start the backend server
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════╗
║                                                   ║
║        🎵 FASHIN Play Backend Server 🎵          ║
║                                                   ║
║        Server running on port 3000               ║
║        http://localhost:3000                      ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

**Keep this terminal open!**

#### Terminal/Command Prompt 2 - Frontend

Open a **NEW** terminal/command prompt window:

```bash
# Make sure you're in the project root directory
# (where index.html is located)

# Option A: Using Python 3
python3 -m http.server 8000

# Option B: Using Python 2
python -m SimpleHTTPServer 8000

# Option C: Using Node.js http-server
npx http-server -p 8000
```

You should see:
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

**Keep this terminal open too!**

#### Open Your Browser

Open your web browser and navigate to:
```
http://localhost:8000
```

Or try:
```
http://127.0.0.1:8000
```

---

## Using the Application

### First Launch

When you first open FASHIN Play, you'll see:

1. **Personalized Greeting** - "Selamat pagi/siang/sore/malam bbyy..." based on current time
2. **Personal Signature** - "FAIZ ❤ SHINTA" in elegant typography
3. **Connection Status** - Top-right indicator showing backend connection
4. **Featured Songs** - Curated selection of popular tracks
5. **Indonesian Hits** - Collection of Indonesian music
6. **International Favorites** - Popular international tracks

### Navigation

The sidebar on the left provides access to all features:

#### 🏠 Home
- View featured songs
- Browse Indonesian hits
- Discover international favorites
- Quick access to trending music

#### 🔍 Search
- Search for songs and artists
- Real-time search results from Deezer API
- Click to play any song

#### 📚 Your Library
- View your saved playlists
- Access recently played songs
- Manage your music collection

#### ❤️ Liked Songs
- Songs you've marked as favorites
- Automatically saved to browser storage
- Quick access to your favorites

### Playing Music

#### From Song Cards

1. **Hover over a song card** - You'll see a play button overlay
2. **Click the play button** - Song starts playing immediately
3. **View player controls** - Bottom of the screen shows current track

#### Player Controls

The player at the bottom of the screen includes:

- **Play/Pause** ⏯️ - Start or pause playback
- **Previous** ⏮️ - Go to previous track
- **Next** ⏭️ - Skip to next track
- **Progress Bar** - Click to seek to any position
- **Volume Control** 🔊 - Adjust volume (0-100%)
- **Shuffle** 🔀 - Randomize playback order
- **Repeat** 🔁 - Repeat all, one, or off
- **Queue** 📋 - View upcoming songs

### Creating Playlists

1. **Click "Create Playlist"** in the sidebar
2. **Enter playlist details:**
   - Name (required)
   - Description (optional)
3. **Click "Create Playlist"** button
4. **Add songs:** Click the "+" button on any song card

Your playlists are automatically saved to your browser's local storage!

### Search Functionality

1. **Click "Search"** in the sidebar
2. **Type in the search box** - Results appear as you type
3. **Browse results** - Songs from Deezer database
4. **Click to play** - Start playing any search result

### Theme Switching

- **Location:** Bottom-left corner
- **Toggle:** Click the moon/sun icon
- **Options:**
  - 🌙 Dark Mode - Deep navy background with blue and gold accents
  - ☀️ Light Mode - Light background with complementary colors
- **Persistence:** Your preference is automatically saved

---

## Features Guide

### 🎨 Traditional Javanese Design

FASHIN Play features a unique design inspired by Traditional Javanese aesthetics:

- **Color Scheme:**
  - Primary: Biru Muda (#4A90E2) - Light Blue
  - Secondary: White (#FFFFFF)
  - Accent: Gold/Emas (#D4AF37)
  
- **Batik Patterns:** Subtle diagonal patterns throughout the interface

- **Typography:** Elegant Georgia and Playfair Display fonts

### ⏰ Time-Based Greeting

The greeting changes based on the time of day:

- **5:00 AM - 10:59 AM:** "Selamat pagi bbyy..."
- **11:00 AM - 2:59 PM:** "Selamat siang bbyy..."
- **3:00 PM - 5:59 PM:** "Selamat sore bbyy..."
- **6:00 PM - 4:59 AM:** "Selamat malam bbyy..."

Updates automatically every minute!

### 🔌 Backend Connection Monitoring

- **Indicator Location:** Top-right corner
- **Status:**
  - 🟢 "Backend Connected" - Everything working
  - 🔴 "Backend Offline" - Backend not responding
- **Auto-check:** Every 30 seconds
- **Fallback:** Uses mock data if backend is offline

### 🎵 Music Integration

#### Deezer API
- Free music metadata
- No API key required
- Search millions of tracks
- Get album art and details

#### YouTube Streaming
- Audio extraction from YouTube
- High-quality audio formats
- Cached URLs for performance
- Automatic fallback handling

### 💾 Local Storage

All your data is saved locally in your browser:

- ✓ Playlists and collections
- ✓ Liked songs
- ✓ Recently played history
- ✓ Theme preference (dark/light)
- ✓ Volume settings
- ✓ Queue state

**Note:** Data is per-browser. Use the same browser to maintain your library.

---

## Troubleshooting

### Issue: Backend Won't Start

**Symptoms:**
- Error message when starting backend
- Port 3000 already in use

**Solutions:**

1. **Check if port is in use:**
   ```bash
   # Mac/Linux
   lsof -i :3000
   
   # Windows
   netstat -ano | findstr :3000
   ```

2. **Kill existing process:**
   ```bash
   # Mac/Linux
   kill -9 [PID]
   
   # Windows (run as Administrator)
   taskkill /PID [PID] /F
   ```

3. **Change port:** Edit `backend/.env` and change `PORT=3000` to another port like `3001`

4. **Reinstall dependencies:**
   ```bash
   cd backend
   rm -rf node_modules
   npm install
   ```

### Issue: Frontend Can't Connect to Backend

**Symptoms:**
- "Backend Offline" indicator
- No songs loading
- Console errors about failed requests

**Solutions:**

1. **Verify backend is running:**
   ```bash
   curl http://localhost:3000/health
   ```
   Should return: `{"status":"ok","message":"FASHIN Play Backend is running"}`

2. **Check CORS settings:**
   - Frontend must run on port 8000
   - Backend allows: localhost:8000, 127.0.0.1:8000, localhost:5500

3. **Clear browser cache:**
   - Press `Ctrl+Shift+R` (Windows/Linux)
   - Press `Cmd+Shift+R` (Mac)

4. **Check browser console:**
   - Press `F12` to open Developer Tools
   - Look for error messages in the Console tab

### Issue: Songs Won't Play

**Symptoms:**
- Songs load but don't play
- Audio player shows errors

**Solutions:**

1. **Check audio format support:**
   - Try different songs
   - Some formats may not be supported by your browser

2. **Browser permissions:**
   - Some browsers block autoplay
   - Click anywhere on the page first, then play

3. **Preview vs Full Track:**
   - Deezer API provides 30-second previews
   - Full streaming requires YouTube integration

4. **YouTube streaming:**
   - Ensure backend is running
   - Some videos may be unavailable in your region

### Issue: Python Not Found

**Symptoms:**
- "Python not found" error
- Can't start frontend server

**Solutions:**

1. **Use Node.js http-server:**
   ```bash
   npx http-server -p 8000
   ```

2. **Install Python:**
   - Download from https://www.python.org/
   - Make sure to check "Add Python to PATH" during installation

3. **Use Live Server (VS Code):**
   - Install "Live Server" extension
   - Right-click `index.html`
   - Select "Open with Live Server"

### Issue: Script Won't Execute (Mac/Linux)

**Symptoms:**
- "Permission denied" error

**Solutions:**

```bash
# Make scripts executable
chmod +x scripts/start-unix.sh
chmod +x scripts/setup.js

# Then run
./scripts/start-unix.sh
```

### Issue: PowerShell Execution Policy (Windows)

**Symptoms:**
- "Execution policy" error
- Scripts won't run in PowerShell

**Solutions:**

```powershell
# Run PowerShell as Administrator and execute:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or run script with bypass:
powershell -ExecutionPolicy Bypass -File scripts\start-powershell.ps1
```

---

## FAQs

### Q: Is an internet connection required?

**A:** Yes and no:
- **Required for:** Loading new songs, Deezer API, YouTube streaming
- **Not required for:** Playing cached songs, viewing saved playlists, using the interface
- **Offline mode:** Saved playlists and liked songs work offline

### Q: Do I need a Deezer account?

**A:** No! FASHIN Play uses the free Deezer API which doesn't require authentication.

### Q: Can I add my own music files?

**A:** Currently, FASHIN Play streams from Deezer and YouTube. Local file support is not yet implemented.

### Q: How long are songs cached?

**A:**
- Stream URLs: 1 hour
- API responses: 30 minutes
- Your playlists: Indefinitely (until you clear browser data)

### Q: Can I use a different port?

**A:** Yes:
- Backend: Edit `backend/.env` and change `PORT`
- Frontend: Use `-p [PORT]` flag with Python/http-server

### Q: Is my data private?

**A:** Yes!
- No account required
- No data sent to external servers (except Deezer/YouTube APIs)
- All playlists stored locally in your browser
- No tracking or analytics

### Q: Why "FAIZ ❤ SHINTA"?

**A:** FASHIN Play is a personal project created with love! The signature represents the creators.

### Q: Can I contribute to the project?

**A:** Yes! FASHIN Play is open source. Check the README.md for contribution guidelines.

### Q: What browsers are supported?

**A:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ Internet Explorer (not supported)

### Q: Why are some songs only 30 seconds?

**A:** Deezer's free API provides 30-second previews. For full tracks, the app attempts to stream from YouTube.

### Q: How do I update the app?

**A:**
```bash
git pull origin main
cd backend
npm install
```

### Q: Can I deploy this to a server?

**A:** Yes! You'll need:
1. Node.js hosting for backend
2. Static file hosting for frontend
3. Update CORS settings in backend
4. Update API URLs in frontend config

---

## Additional Resources

### Video Tutorials

*(Coming Soon)*

- Setup on Windows: [YouTube Link]
- Setup on Mac: [YouTube Link]
- Setup on Linux: [YouTube Link]
- Creating Playlists: [YouTube Link]
- Advanced Features: [YouTube Link]

### Documentation

- **README.md** - Project overview and quick start
- **backend/README.md** - Backend API documentation
- **GitHub Wiki** - Extended documentation and guides

### Support

- **GitHub Issues** - Report bugs or request features
- **Discussions** - Ask questions and share ideas
- **Email** - [Contact information if available]

---

## Conclusion

Congratulations! You're now ready to enjoy FASHIN Play! 🎉

If you encounter any issues not covered in this tutorial:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [FAQs](#faqs)
3. Search existing GitHub Issues
4. Create a new Issue with detailed information

---

**Made with ❤️ by FAIZ & SHINTA**

*FASHIN Play - Streaming Music dengan Sentuhan Tradisional Indonesia* 🎵🎶

---

*Last Updated: February 2024*
