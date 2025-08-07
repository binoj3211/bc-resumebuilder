@echo off
REM ATS Resume Builder - Start Both Frontend and Backend (Windows)

echo 🚀 Starting ATS Resume Builder with Backend API...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo 📦 Installing frontend dependencies...
call npm install

echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

echo 🔧 Starting backend server...
cd backend
start "Backend Server" cmd /k "npm start"
cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

echo 🔧 Starting frontend development server...
start "Frontend Server" cmd /k "npm run dev"

echo ✅ Both servers are starting...
echo 📡 Backend API: http://localhost:3001
echo 🌐 Frontend App: http://localhost:5174
echo.
echo Press any key to continue...
pause
