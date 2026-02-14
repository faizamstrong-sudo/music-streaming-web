#!/usr/bin/env node
// FASHIN Play - Setup and Initialization Script
// This script initializes the application and checks prerequisites

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Print colored message
function log(message, color = colors.reset) {
    console.log(color + message + colors.reset);
}

// Print section header
function printHeader(title) {
    console.log('');
    log('========================================================', colors.cyan);
    log(`  ${title}`, colors.bright);
    log('========================================================', colors.cyan);
    console.log('');
}

// Check if command exists
function commandExists(command) {
    try {
        execSync(`${command} --version`, { stdio: 'pipe' });
        return true;
    } catch (error) {
        return false;
    }
}

// Main setup function
async function setup() {
    printHeader('🎵 FASHIN Play - Setup Wizard 🎵');
    
    log('Welcome to FASHIN Play Music Streaming Application!', colors.green);
    log('This script will help you set up everything you need.', colors.green);
    console.log('');
    
    // Step 1: Check Node.js
    log('[1/6] Checking Node.js...', colors.blue);
    if (!commandExists('node')) {
        log('❌ ERROR: Node.js is not installed!', colors.red);
        log('Please install Node.js from https://nodejs.org/', colors.yellow);
        process.exit(1);
    }
    
    try {
        const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
        log(`✓ Node.js ${nodeVersion} is installed`, colors.green);
    } catch (error) {
        log('❌ ERROR: Could not check Node.js version', colors.red);
        process.exit(1);
    }
    console.log('');
    
    // Step 2: Check npm
    log('[2/6] Checking npm...', colors.blue);
    if (!commandExists('npm')) {
        log('❌ ERROR: npm is not installed!', colors.red);
        log('npm should come with Node.js. Please reinstall Node.js.', colors.yellow);
        process.exit(1);
    }
    
    try {
        const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
        log(`✓ npm ${npmVersion} is installed`, colors.green);
    } catch (error) {
        log('❌ ERROR: Could not check npm version', colors.red);
        process.exit(1);
    }
    console.log('');
    
    // Step 3: Check Python (optional)
    log('[3/6] Checking Python (for frontend)...', colors.blue);
    let pythonAvailable = false;
    
    if (commandExists('python3')) {
        try {
            const pythonVersion = execSync('python3 --version', { encoding: 'utf8' }).trim();
            log(`✓ ${pythonVersion} is installed`, colors.green);
            pythonAvailable = true;
        } catch (error) {
            // Ignore
        }
    } else if (commandExists('python')) {
        try {
            const pythonVersion = execSync('python --version', { encoding: 'utf8' }).trim();
            log(`✓ ${pythonVersion} is installed`, colors.green);
            pythonAvailable = true;
        } catch (error) {
            // Ignore
        }
    }
    
    if (!pythonAvailable) {
        log('⚠ WARNING: Python is not installed', colors.yellow);
        log('You can still use npx http-server for the frontend', colors.yellow);
    }
    console.log('');
    
    // Step 4: Install backend dependencies
    log('[4/6] Installing backend dependencies...', colors.blue);
    const backendDir = path.join(__dirname, '..', 'backend');
    
    if (!fs.existsSync(path.join(backendDir, 'node_modules'))) {
        log('Installing npm packages...', colors.yellow);
        try {
            execSync('npm install', { 
                cwd: backendDir, 
                stdio: 'inherit' 
            });
            log('✓ Backend dependencies installed successfully', colors.green);
        } catch (error) {
            log('❌ ERROR: Failed to install backend dependencies', colors.red);
            process.exit(1);
        }
    } else {
        log('✓ Backend dependencies already installed', colors.green);
    }
    console.log('');
    
    // Step 5: Create .env file
    log('[5/6] Setting up environment...', colors.blue);
    const envPath = path.join(backendDir, '.env');
    
    if (!fs.existsSync(envPath)) {
        log('Creating .env file...', colors.yellow);
        const envContent = `PORT=3000
NODE_ENV=development
# Add any other environment variables here
`;
        try {
            fs.writeFileSync(envPath, envContent, 'utf8');
            log('✓ Created backend/.env file', colors.green);
        } catch (error) {
            log('❌ ERROR: Failed to create .env file', colors.red);
            log(error.message, colors.red);
            process.exit(1);
        }
    } else {
        log('✓ Environment file already exists', colors.green);
    }
    console.log('');
    
    // Step 6: Verify project structure
    log('[6/6] Verifying project structure...', colors.blue);
    const requiredFiles = [
        'index.html',
        'styles.css',
        'app.js',
        'api.js',
        'config.js',
        'backend/server.js',
        'backend/package.json'
    ];
    
    let allFilesExist = true;
    for (const file of requiredFiles) {
        const filePath = path.join(__dirname, '..', file);
        if (fs.existsSync(filePath)) {
            log(`  ✓ ${file}`, colors.green);
        } else {
            log(`  ❌ ${file} not found`, colors.red);
            allFilesExist = false;
        }
    }
    
    if (!allFilesExist) {
        log('⚠ WARNING: Some required files are missing', colors.yellow);
        log('The application may not work correctly', colors.yellow);
    }
    console.log('');
    
    // Final summary
    printHeader('✅ Setup Complete!');
    
    log('FASHIN Play is ready to use!', colors.green);
    console.log('');
    log('To start the application:', colors.bright);
    console.log('');
    
    // Platform-specific instructions
    const platform = process.platform;
    if (platform === 'win32') {
        log('  On Windows:', colors.cyan);
        log('    scripts\\start-windows.bat', colors.yellow);
        log('  Or PowerShell:', colors.cyan);
        log('    powershell -ExecutionPolicy Bypass -File scripts\\start-powershell.ps1', colors.yellow);
    } else {
        log('  On Mac/Linux:', colors.cyan);
        log('    chmod +x scripts/start-unix.sh', colors.yellow);
        log('    ./scripts/start-unix.sh', colors.yellow);
    }
    
    console.log('');
    log('  Manual start:', colors.cyan);
    log('    Terminal 1: cd backend && npm start', colors.yellow);
    log('    Terminal 2: python3 -m http.server 8000', colors.yellow);
    log('    Browser: http://localhost:8000', colors.yellow);
    
    console.log('');
    printHeader('Happy Streaming! 🎵');
}

// Run setup
setup().catch(error => {
    console.error('');
    log('❌ Setup failed:', colors.red);
    console.error(error);
    process.exit(1);
});
