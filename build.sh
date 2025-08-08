#!/bin/bash
# Build script for production deployment

echo "🚀 Building BC Resume Builder for Production..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "✅ Build complete! Ready for deployment."
echo ""
echo "📋 Next Steps:"
echo "1. Deploy to Railway, Vercel, or Render"
echo "2. Set up MongoDB Atlas database"
echo "3. Configure environment variables"
echo "4. Update API URLs in production"
