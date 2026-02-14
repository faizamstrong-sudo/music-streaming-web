# FASHIN Play - PowerShell Startup Script
# This script will set up and start the FASHIN Play Music Streaming Application

# Requires -Version 5.1

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "     FASHIN Play - Music Streaming Application" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check command exists
function Test-CommandExists {
    param($Command)
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try {
        if (Get-Command $Command) { return $true }
    }
    catch { return $false }
    finally { $ErrorActionPreference = $oldPreference }
}

# Check if Node.js is installed
Write-Host "[1/5] Checking Node.js installation..." -ForegroundColor Blue
if (-not (Test-CommandExists node)) {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/"
    pause
    exit 1
}

$nodeVersion = node --version
Write-Host "Node.js $nodeVersion is installed!" -ForegroundColor Green
Write-Host ""

# Check if Python is installed (for frontend)
Write-Host "[2/5] Checking Python installation..." -ForegroundColor Blue
$pythonCmd = $null
if (Test-CommandExists python) {
    $pythonVersion = python --version
    Write-Host "$pythonVersion is installed!" -ForegroundColor Green
    $pythonCmd = "python"
}
elseif (Test-CommandExists python3) {
    $pythonVersion = python3 --version
    Write-Host "$pythonVersion is installed!" -ForegroundColor Green
    $pythonCmd = "python3"
}
else {
    Write-Host "WARNING: Python is not installed." -ForegroundColor Yellow
    Write-Host "You will need to use an alternative method to run the frontend."
    Write-Host "Consider installing Python from https://www.python.org/"
}
Write-Host ""

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = Split-Path -Parent $scriptDir
$backendDir = Join-Path $projectDir "backend"

# Install backend dependencies
Write-Host "[3/5] Installing backend dependencies..." -ForegroundColor Blue
Push-Location $backendDir

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm packages..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install backend dependencies" -ForegroundColor Red
        Pop-Location
        pause
        exit 1
    }
}
else {
    Write-Host "Backend dependencies already installed." -ForegroundColor Green
}

Pop-Location
Write-Host ""

# Create .env file if it doesn't exist
Write-Host "[4/5] Setting up environment..." -ForegroundColor Blue
$envFile = Join-Path $backendDir ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "Creating .env file..."
    @"
PORT=3000
NODE_ENV=development
"@ | Out-File -FilePath $envFile -Encoding utf8
    Write-Host "Created backend/.env file" -ForegroundColor Green
}
else {
    Write-Host "Environment file already exists." -ForegroundColor Green
}
Write-Host ""

# Start the backend server
Write-Host "[5/5] Starting servers..." -ForegroundColor Blue
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Starting Backend Server" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Start backend in new window
$backendScript = Join-Path $backendDir "server.js"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; node server.js"

# Wait for backend to start
Write-Host "Waiting for backend to start..."
Start-Sleep -Seconds 3

# Test backend connection
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "Backend is running!" -ForegroundColor Green
}
catch {
    Write-Host "WARNING: Could not verify backend status" -ForegroundColor Yellow
}
Write-Host ""

# Start frontend
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Starting Frontend Server" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

if ($pythonCmd) {
    Write-Host "Starting frontend with $pythonCmd..."
    
    # Start frontend in new window
    if ($pythonCmd -eq "python3") {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectDir'; python3 -m http.server 8000"
    }
    else {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectDir'; python -m http.server 8000"
    }
    
    Start-Sleep -Seconds 2
    
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host " FASHIN Play is Running!" -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Backend:  http://localhost:3000" -ForegroundColor Green
    Write-Host "  Frontend: http://localhost:8000" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Opening browser..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Open browser
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:8000"
    
    Write-Host "Press any key to close this window (servers will keep running)..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
else {
    Write-Host "Python not found. Please start frontend manually:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Option 1 - Using npx:"
    Write-Host "    npx http-server -p 8000"
    Write-Host ""
    Write-Host "  Option 2 - Install Python and run:"
    Write-Host "    python -m http.server 8000"
    Write-Host ""
    Write-Host "  Then open: http://localhost:8000"
    Write-Host ""
    Write-Host "Backend is running on http://localhost:3000" -ForegroundColor Green
    Write-Host ""
    pause
}
