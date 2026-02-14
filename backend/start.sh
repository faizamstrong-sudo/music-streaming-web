#!/bin/bash

# FASHIN Play - Start Backend Server

echo "╔═══════════════════════════════════════════════════╗"
echo "║                                                   ║"
echo "║      🎵 Starting FASHIN Play Backend 🎵          ║"
echo "║                                                   ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the server
echo "🚀 Starting server on port 3000..."
echo ""
npm start
