@echo off
REM FASHIN Play - Windows Startup Script
REM This script will set up and start the FASHIN Play Music Streaming Application

echo.
echo ========================================================
echo.
echo        FASHIN Play - Music Streaming Application
echo.
echo ========================================================
echo.

REM Check if Node.js is installed
echo [1/5] Checking Node.js installation...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

node --version
echo Node.js is installed!
echo.

REM Check if Python is installed (for frontend)
echo [2/5] Checking Python installation...
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    python --version
    echo Python is installed!
) else (
    echo WARNING: Python is not installed.
    echo You will need to use an alternative method to run the frontend.
    echo Consider installing Python from https://www.python.org/
)
echo.

REM Install backend dependencies
echo [3/5] Installing backend dependencies...
cd backend
if not exist "node_modules\" (
    echo Installing npm packages...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install backend dependencies
        cd ..
        pause
        exit /b 1
    )
) else (
    echo Backend dependencies already installed.
)
cd ..
echo.

REM Create .env file if it doesn't exist
echo [4/5] Setting up environment...
if not exist "backend\.env" (
    echo Creating .env file...
    echo PORT=3000> backend\.env
    echo NODE_ENV=development>> backend\.env
    echo Created backend\.env file
) else (
    echo Environment file already exists.
)
echo.

REM Start the backend server
echo [5/5] Starting backend server...
echo.
echo ========================================================
echo  Backend server will start on http://localhost:3000
echo ========================================================
echo.
cd backend
start cmd /k "node server.js"
cd ..
echo.

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Instructions for frontend
echo.
echo ========================================================
echo  NEXT STEPS - Starting Frontend
echo ========================================================
echo.
echo The backend is now running!
echo.
echo To start the frontend, open a NEW command prompt and run:
echo.
echo   Option 1 - Using Python:
echo   python -m http.server 8000
echo.
echo   Option 2 - Using Node.js:
echo   npx http-server -p 8000
echo.
echo   Then open: http://localhost:8000
echo.
echo ========================================================
echo.
echo Press any key to open frontend instructions...
pause >nul

REM Try to start frontend automatically
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Starting frontend server...
    start cmd /k "python -m http.server 8000"
    echo.
    echo Frontend starting on http://localhost:8000
    echo.
    timeout /t 2 /nobreak >nul
    start http://localhost:8000
) else (
    echo Please start the frontend manually using one of the options above.
)

echo.
echo ========================================================
echo  FASHIN Play is running!
echo  Backend: http://localhost:3000
echo  Frontend: http://localhost:8000
echo ========================================================
echo.
echo Press Ctrl+C in each window to stop the servers
echo.
pause
