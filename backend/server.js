const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const songsRoutes = require('./routes/songs');
const streamRoutes = require('./routes/stream');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:5500'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'FASHIN Play Backend is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/songs', songsRoutes);
app.use('/api/stream', streamRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        status: err.status || 500
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        status: 404
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║        🎵 FASHIN Play Backend Server 🎵          ║
║                                                   ║
║        Server running on port ${PORT}              ║
║        http://localhost:${PORT}                     ║
║                                                   ║
║        Health check: http://localhost:${PORT}/health ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
    `);
});

module.exports = app;
