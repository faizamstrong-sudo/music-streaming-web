#!/bin/bash

# FASHIN Play - Start Frontend Server

echo "╔═══════════════════════════════════════════════════╗"
echo "║                                                   ║"
echo "║      🎵 Starting FASHIN Play Frontend 🎵         ║"
echo "║                                                   ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "🚀 Starting frontend server on port 8000..."
    echo "📱 Open http://localhost:8000 in your browser"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "🚀 Starting frontend server on port 8000..."
    echo "📱 Open http://localhost:8000 in your browser"
    echo ""
    python -m SimpleHTTPServer 8000
else
    echo "❌ Python not found. Please install Python to run the frontend server."
    echo "Or use: npx http-server -p 8000"
fi
