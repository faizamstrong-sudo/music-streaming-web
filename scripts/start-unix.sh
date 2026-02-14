#!/bin/bash
# FASHIN Play - Unix/Linux/Mac Startup Script
# This script will set up and start the FASHIN Play Music Streaming Application

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "========================================================"
echo ""
echo "     🎵 FASHIN Play - Music Streaming Application 🎵"
echo ""
echo "========================================================"
echo ""

# Check if Node.js is installed
echo -e "${BLUE}[1/5] Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}ERROR: Node.js is not installed!${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

node --version
echo -e "${GREEN}Node.js is installed!${NC}"
echo ""

# Check if Python is installed (for frontend)
echo -e "${BLUE}[2/5] Checking Python installation...${NC}"
if command -v python3 &> /dev/null; then
    python3 --version
    echo -e "${GREEN}Python 3 is installed!${NC}"
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    python --version
    echo -e "${GREEN}Python is installed!${NC}"
    PYTHON_CMD="python"
else
    echo -e "${YELLOW}WARNING: Python is not installed.${NC}"
    echo "You will need to use an alternative method to run the frontend."
    echo "Consider installing Python from https://www.python.org/"
    PYTHON_CMD=""
fi
echo ""

# Install backend dependencies
echo -e "${BLUE}[3/5] Installing backend dependencies...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installing npm packages..."
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}ERROR: Failed to install backend dependencies${NC}"
        cd ..
        exit 1
    fi
else
    echo -e "${GREEN}Backend dependencies already installed.${NC}"
fi
cd ..
echo ""

# Create .env file if it doesn't exist
echo -e "${BLUE}[4/5] Setting up environment...${NC}"
if [ ! -f "backend/.env" ]; then
    echo "Creating .env file..."
    cat > backend/.env << EOF
PORT=3000
NODE_ENV=development
EOF
    echo -e "${GREEN}Created backend/.env file${NC}"
else
    echo -e "${GREEN}Environment file already exists.${NC}"
fi
echo ""

# Start the backend server
echo -e "${BLUE}[5/5] Starting servers...${NC}"
echo ""
echo "========================================================"
echo " 🚀 Starting Backend Server"
echo "========================================================"
echo ""

# Start backend in background
cd backend
node server.js &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 3

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}ERROR: Backend failed to start${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Backend is running (PID: $BACKEND_PID)${NC}"
echo ""

# Start frontend
echo "========================================================"
echo " 🌐 Starting Frontend Server"
echo "========================================================"
echo ""

if [ -n "$PYTHON_CMD" ]; then
    echo "Starting frontend with $PYTHON_CMD..."
    
    # Start frontend in background
    if [ "$PYTHON_CMD" = "python3" ]; then
        $PYTHON_CMD -m http.server 8000 &
    else
        $PYTHON_CMD -m SimpleHTTPServer 8000 &
    fi
    FRONTEND_PID=$!
    
    # Wait a moment
    sleep 2
    
    echo -e "${GREEN}✓ Frontend is running (PID: $FRONTEND_PID)${NC}"
    echo ""
    echo "========================================================"
    echo " ✅ FASHIN Play is Running!"
    echo "========================================================"
    echo ""
    echo -e "  ${GREEN}Backend:${NC}  http://localhost:3000"
    echo -e "  ${GREEN}Frontend:${NC} http://localhost:8000"
    echo ""
    echo "  Open http://localhost:8000 in your browser"
    echo ""
    echo "========================================================"
    echo ""
    echo "Press Ctrl+C to stop all servers"
    echo ""
    
    # Try to open browser (works on macOS and some Linux)
    if command -v open &> /dev/null; then
        sleep 2
        open http://localhost:8000 2>/dev/null
    elif command -v xdg-open &> /dev/null; then
        sleep 2
        xdg-open http://localhost:8000 2>/dev/null
    fi
    
    # Cleanup function
    cleanup() {
        echo ""
        echo "Shutting down servers..."
        kill $BACKEND_PID 2>/dev/null
        kill $FRONTEND_PID 2>/dev/null
        echo "Servers stopped."
        exit 0
    }
    
    # Trap Ctrl+C
    trap cleanup INT TERM
    
    # Wait for user to stop
    wait
else
    echo -e "${YELLOW}Python not found. Please start frontend manually:${NC}"
    echo ""
    echo "  Option 1 - Using npx:"
    echo "    npx http-server -p 8000"
    echo ""
    echo "  Option 2 - Install Python and run:"
    echo "    python3 -m http.server 8000"
    echo ""
    echo "  Then open: http://localhost:8000"
    echo ""
    echo "Backend is running on http://localhost:3000"
    echo ""
    echo "Press Ctrl+C to stop the backend server"
    
    # Cleanup function
    cleanup() {
        echo ""
        echo "Shutting down backend..."
        kill $BACKEND_PID 2>/dev/null
        echo "Backend stopped."
        exit 0
    }
    
    # Trap Ctrl+C
    trap cleanup INT TERM
    
    # Wait for user to stop
    wait
fi
