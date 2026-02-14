# INSTALLATION GUIDE - FASHIN Play

Detailed step-by-step installation guide untuk semua platform.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Windows Installation](#windows-installation)
3. [macOS Installation](#macos-installation)
4. [Linux Installation](#linux-installation)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

Pastikan sistem Anda memiliki software berikut:

### Node.js
- **Version**: v20.0.0 atau lebih baru
- **Download**: https://nodejs.org/

#### Verify Node.js Installation:
```bash
node --version
npm --version
```

### Python
- **Version**: Python 3.7 atau lebih baru
- **Download**: https://www.python.org/downloads/

#### Verify Python Installation:
```bash
python --version
# atau
python3 --version
```

### Git (Optional)
- **Download**: https://git-scm.com/downloads
- Diperlukan jika Anda ingin clone repository

---

## Windows Installation

### Step 1: Install Prerequisites

1. **Install Node.js**:
   - Download Node.js dari https://nodejs.org/
   - Jalankan installer (.msi file)
   - Ikuti wizard installation
   - Restart Command Prompt setelah installation

2. **Install Python**:
   - Download Python dari https://www.python.org/downloads/
   - **PENTING**: Centang "Add Python to PATH" saat installation
   - Ikuti wizard installation
   - Verify installation di Command Prompt:
     ```cmd
     python --version
     ```

### Step 2: Clone atau Download Repository

**Option A: Menggunakan Git**
```cmd
git clone https://github.com/faizamstrong-sudo/music-streaming-web.git
cd music-streaming-web
```

**Option B: Download ZIP**
- Download repository sebagai ZIP file
- Extract ke folder pilihan Anda
- Buka Command Prompt di folder tersebut

### Step 3: Install Backend Dependencies

```cmd
cd backend
npm install
```

Tunggu hingga proses installation selesai. Ini akan menginstall:
- express
- cors
- axios
- dotenv

### Step 4: Start Backend Server

```cmd
npm start
```

Output yang diharapkan:
```
Backend server running on http://localhost:3000
```

**Jangan tutup terminal ini!** Backend harus tetap running.

### Step 5: Start Frontend Server

Buka **Command Prompt BARU** (jangan tutup yang lama):

```cmd
cd frontend
python -m http.server 8000
```

Atau jika menggunakan Python 2:
```cmd
python -m SimpleHTTPServer 8000
```

Output yang diharapkan:
```
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

### Step 6: Access Application

Buka browser dan navigate ke:
```
http://localhost:8000
```

✅ **Done!** FASHIN Play sekarang running di komputer Anda.

---

## macOS Installation

### Step 1: Install Prerequisites

1. **Install Homebrew** (jika belum ada):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Node.js**:
   ```bash
   brew install node
   ```

3. **Verify Python** (macOS sudah include Python):
   ```bash
   python3 --version
   ```

### Step 2: Clone Repository

```bash
git clone https://github.com/faizamstrong-sudo/music-streaming-web.git
cd music-streaming-web
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 4: Start Backend Server

```bash
npm start
```

Output yang diharapkan:
```
Backend server running on http://localhost:3000
```

**Buka Terminal TAB baru** dengan `Cmd+T` (jangan tutup yang lama).

### Step 5: Start Frontend Server

Di terminal tab baru:
```bash
cd music-streaming-web/frontend
python3 -m http.server 8000
```

### Step 6: Access Application

Buka browser:
```
http://localhost:8000
```

✅ **Done!** Enjoy FASHIN Play on macOS.

---

## Linux Installation

### Step 1: Install Prerequisites

#### Ubuntu/Debian:
```bash
# Update package list
sudo apt update

# Install Node.js v20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Python biasanya sudah terinstall
python3 --version

# Install Git (optional)
sudo apt install -y git
```

#### Fedora/RHEL/CentOS:
```bash
# Install Node.js
sudo dnf install -y nodejs

# Python biasanya sudah terinstall
python3 --version

# Install Git (optional)
sudo dnf install -y git
```

#### Arch Linux:
```bash
# Install Node.js
sudo pacman -S nodejs npm

# Python biasanya sudah terinstall
python3 --version

# Install Git (optional)
sudo pacman -S git
```

### Step 2: Clone Repository

```bash
git clone https://github.com/faizamstrong-sudo/music-streaming-web.git
cd music-streaming-web
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 4: Start Backend Server

```bash
npm start
```

**Buka terminal TAB/window baru** (Ctrl+Shift+T).

### Step 5: Start Frontend Server

Di terminal baru:
```bash
cd music-streaming-web/frontend
python3 -m http.server 8000
```

### Step 6: Access Application

Buka browser:
```
http://localhost:8000
```

✅ **Done!** FASHIN Play running on Linux.

---

## Troubleshooting

### Backend tidak bisa start

**Problem**: Port 3000 sudah digunakan
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

Atau edit `backend/.env` file dan ubah port:
```env
PORT=3001
```

Jangan lupa update `frontend/app.js` line yang ada `http://localhost:3000` menjadi port baru.

---

### Frontend tidak bisa start

**Problem**: Port 8000 sudah digunakan

**Solution**: Gunakan port lain
```bash
python3 -m http.server 8001
```

Lalu akses: `http://localhost:8001`

---

### Backend Connection Failed

**Problem**: Frontend tidak bisa connect ke backend

**Checklist**:
1. ✅ Backend running di `http://localhost:3000`
2. ✅ Check browser console untuk error CORS
3. ✅ Pastikan tidak ada firewall blocking port 3000
4. ✅ Try access `http://localhost:3000/health` langsung di browser

**Solution**:
- Restart backend server
- Clear browser cache (Ctrl+Shift+R)
- Check backend logs untuk error messages

---

### Node.js Version Mismatch

**Problem**: 
```
error This project requires Node.js version >= 20.0.0
```

**Solution**:
```bash
# Check current version
node --version

# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js v20
nvm install 20
nvm use 20
```

---

### npm install gagal

**Problem**: Dependencies installation error

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules dan package-lock.json
rm -rf node_modules package-lock.json

# Install ulang
npm install
```

---

### Permission Denied (Linux/macOS)

**Problem**: 
```
Error: EACCES: permission denied
```

**Solution**:
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Atau gunakan nvm untuk install Node.js tanpa sudo
```

---

## Additional Information

### Default Ports
- **Backend**: Port 3000
- **Frontend**: Port 8000

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Network Requirements
- Internet connection required untuk:
  - Streaming music dari Deezer/YouTube
  - Loading Google Fonts
- Dapat berjalan offline dengan mock data

### Performance Tips
1. Close unnecessary browser tabs
2. Ensure adequate RAM (minimum 4GB recommended)
3. Use modern browser untuk better performance

---

## Getting Help

Jika mengalami masalah yang tidak tercantum di guide ini:

1. **Check Backend Logs**: Lihat output di terminal backend untuk error messages
2. **Check Browser Console**: Press F12 → Console tab untuk client-side errors
3. **GitHub Issues**: Open issue di repository untuk bantuan
4. **Restart Everything**: Sometimes a full restart solves the problem!

---

## Next Steps

Setelah berhasil install:

1. 📖 Baca **README.md** untuk fitur-fitur aplikasi
2. 🎵 Explore featured songs dan Indonesian hits
3. 🎨 Try dark/light theme toggle
4. 📂 Create your first playlist
5. 🔍 Search untuk lagu favorit Anda

---

**Happy Streaming! 🎵**

Made with ❤️ by FAIZ & SHINTA
