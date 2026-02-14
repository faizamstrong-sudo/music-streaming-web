@echo off
REM ========================================
REM FASHIN Play - Windows Auto-Start Script
REM One-Click Setup & Launch
REM ========================================

title FASHIN Play - Auto Setup
color 0B

echo.
echo ================================================
echo          FASHIN Play - Auto Setup
echo         Windows One-Click Launcher
echo ================================================
echo.

REM Check if Node.js is installed
echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version and run the installer.
    echo.
    pause
    exit /b 1
)
echo SUCCESS: Node.js is installed
node --version
echo.

REM Check if Python is installed
echo [2/6] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    py --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo WARNING: Python is not installed!
        echo Python is required to run the frontend server.
        echo.
        echo Please install Python from: https://www.python.org/
        echo Download version 3.8 or higher.
        echo.
        pause
        exit /b 1
    ) else (
        echo SUCCESS: Python is installed
        py --version
    )
) else (
    echo SUCCESS: Python is installed
    python --version
)
echo.

REM Install backend dependencies
echo [3/6] Installing backend dependencies...
cd backend
if exist node_modules (
    echo Backend dependencies already installed. Checking for updates...
    call npm install --silent
) else (
    echo Installing fresh backend dependencies...
    call npm install
)
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies!
    pause
    exit /b 1
)
echo SUCCESS: Backend dependencies installed
cd ..
echo.

REM Start backend server
echo [4/6] Starting backend server on port 3000...
start "FASHIN Play Backend" cmd /k "cd backend && node server.js"
timeout /t 3 /nobreak >nul
echo SUCCESS: Backend server started
echo.

REM Start frontend server
echo [5/6] Starting frontend server on port 8000...
cd frontend
start "FASHIN Play Frontend" cmd /k "python -m http.server 8000"
timeout /t 2 /nobreak >nul
echo SUCCESS: Frontend server started
cd ..
echo.

REM Open browser
echo [6/6] Opening browser...
timeout /t 3 /nobreak >nul
start http://localhost:8000
echo SUCCESS: Browser opened
echo.

echo ================================================
echo      FASHIN Play is now running!
echo ================================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:8000
echo.
echo Press any key to view this window or close it.
echo The servers will continue running in separate windows.
echo.
echo To stop the servers, close the server windows or press Ctrl+C
echo.
pause
