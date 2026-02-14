#!/bin/bash
# ========================================
# FASHIN Play - Mac/Linux Auto-Start Script
# One-Click Setup & Launch
# ========================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo ""
echo "================================================"
echo "          FASHIN Play - Auto Setup"
echo "        Mac/Linux One-Click Launcher"
echo "================================================"
echo ""

# Check if Node.js is installed
echo "[1/6] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}ERROR: Node.js is not installed!${NC}"
    echo ""
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Or use a package manager:"
    echo "  - Mac: brew install node"
    echo "  - Ubuntu/Debian: sudo apt install nodejs npm"
    echo "  - Fedora: sudo dnf install nodejs"
    echo ""
    exit 1
fi
echo -e "${GREEN}SUCCESS: Node.js is installed${NC}"
node --version
echo ""

# Check if Python is installed
echo "[2/6] Checking Python installation..."
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo -e "${RED}ERROR: Python is not installed!${NC}"
    echo ""
    echo "Please install Python from: https://www.python.org/"
    echo "Or use a package manager:"
    echo "  - Mac: brew install python3"
    echo "  - Ubuntu/Debian: sudo apt install python3"
    echo "  - Fedora: sudo dnf install python3"
    echo ""
    exit 1
fi
echo -e "${GREEN}SUCCESS: Python is installed${NC}"
if command -v python3 &> /dev/null; then
    python3 --version
else
    python --version
fi
echo ""

# Install backend dependencies
echo "[3/6] Installing backend dependencies..."
cd "$SCRIPT_DIR/backend" || exit 1
if [ -d "node_modules" ]; then
    echo "Backend dependencies already installed. Checking for updates..."
    npm install --silent
else
    echo "Installing fresh backend dependencies..."
    npm install
fi
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Failed to install backend dependencies!${NC}"
    exit 1
fi
echo -e "${GREEN}SUCCESS: Backend dependencies installed${NC}"
cd "$SCRIPT_DIR" || exit 1
echo ""

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Kill processes on ports if already running
echo "[4/6] Checking for running servers..."
if check_port 3000; then
    echo -e "${YELLOW}Port 3000 is in use. Stopping existing backend...${NC}"
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 1
fi
if check_port 8000; then
    echo -e "${YELLOW}Port 8000 is in use. Stopping existing frontend...${NC}"
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    sleep 1
fi
echo ""

# Start backend server
echo "[5/6] Starting backend server on port 3000..."
cd "$SCRIPT_DIR/backend" || exit 1
node server.js > /tmp/fashin-backend.log 2>&1 &
BACKEND_PID=$!
sleep 2

# Check if backend started successfully
if ! ps -p $BACKEND_PID > /dev/null; then
    echo -e "${RED}ERROR: Failed to start backend server!${NC}"
    echo "Check logs: tail -f /tmp/fashin-backend.log"
    exit 1
fi
echo -e "${GREEN}SUCCESS: Backend server started (PID: $BACKEND_PID)${NC}"
cd "$SCRIPT_DIR" || exit 1
echo ""

# Start frontend server
echo "[6/6] Starting frontend server on port 8000..."
cd "$SCRIPT_DIR/frontend" || exit 1
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000 > /tmp/fashin-frontend.log 2>&1 &
else
    python -m http.server 8000 > /tmp/fashin-frontend.log 2>&1 &
fi
FRONTEND_PID=$!
sleep 2

# Check if frontend started successfully
if ! ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${RED}ERROR: Failed to start frontend server!${NC}"
    echo "Check logs: tail -f /tmp/fashin-frontend.log"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi
echo -e "${GREEN}SUCCESS: Frontend server started (PID: $FRONTEND_PID)${NC}"
cd "$SCRIPT_DIR" || exit 1
echo ""

# Save PIDs for cleanup
echo $BACKEND_PID > /tmp/fashin-backend.pid
echo $FRONTEND_PID > /tmp/fashin-frontend.pid

# Wait a moment for servers to fully start
sleep 2

# Open browser
echo "Opening browser..."
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:8000 &
elif command -v open &> /dev/null; then
    open http://localhost:8000 &
else
    echo -e "${YELLOW}Could not open browser automatically.${NC}"
    echo "Please open: http://localhost:8000"
fi
echo ""

echo "================================================"
echo "      FASHIN Play is now running!"
echo "================================================"
echo ""
echo "Backend:  http://localhost:3000  (PID: $BACKEND_PID)"
echo "Frontend: http://localhost:8000  (PID: $FRONTEND_PID)"
echo ""
echo "Logs:"
echo "  Backend:  tail -f /tmp/fashin-backend.log"
echo "  Frontend: tail -f /tmp/fashin-frontend.log"
echo ""
echo "To stop the servers, run:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo "Or use: pkill -f 'node server.js' && pkill -f 'http.server 8000'"
echo ""
echo -e "${GREEN}Enjoy FASHIN Play! ❤${NC}"
echo ""
