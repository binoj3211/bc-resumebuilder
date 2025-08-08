# Deployment Guide for BC Resume Builder

## Quick Deploy Options:

### Option 1: Vercel (Frontend Only)
1. Push your code to GitHub
2. Go to vercel.com
3. Import your GitHub repository
4. Deploy automatically

### Option 2: Railway (Full-Stack)
1. Go to railway.app
2. Connect GitHub repository
3. Deploy both frontend and backend
4. Add MongoDB database

### Option 3: Netlify + Backend Service
1. Frontend: Deploy to Netlify
2. Backend: Deploy to Railway/Render
3. Update API URLs in frontend

## Environment Variables Needed:
- MONGODB_URI
- JWT_SECRET
- PORT
- NODE_ENV=production
- FRONTEND_URL

## Pre-deployment Checklist:
[ ] Remove password logging from App.jsx
[ ] Set up MongoDB Atlas account
[ ] Configure environment variables
[ ] Update API URLs for production
[ ] Test build process locally

## Commands to test locally:
```bash
# Frontend build test
npm run build

# Backend test
cd backend
npm start
```
