#!/bin/bash

# ATS Resume Builder - Start Both Frontend and Backend

echo "🚀 Starting ATS Resume Builder with Backend API..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing frontend dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo "🔧 Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

echo "🔧 Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers are starting..."
echo "📡 Backend API: http://localhost:3001"
echo "🌐 Frontend App: http://localhost:5174"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C and cleanup
trap 'echo "🛑 Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID; exit' INT
wait
