# Backend Server Setup (Optional)

The ATS Resume Builder frontend is fully functional without a backend - it will store data in localStorage for demo purposes. However, for production use with persistent user accounts and data, you can set up a backend server.

## Quick Backend Setup with Node.js + Express

Create a new directory for your backend:

```bash
mkdir ats-backend
cd ats-backend
npm init -y
```

Install dependencies:

```bash
npm install express cors dotenv bcryptjs jsonwebtoken mongoose
npm install -D nodemon
```

Create a basic server (`server.js`):

```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ATS Resume Builder API' });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  // Implement user registration
  res.json({ message: 'Registration endpoint' });
});

app.post('/api/auth/login', (req, res) => {
  // Implement user login
  res.json({ message: 'Login endpoint' });
});

app.post('/api/auth/google', (req, res) => {
  // Implement Google OAuth verification
  res.json({ message: 'Google OAuth endpoint' });
});

app.get('/api/auth/me', (req, res) => {
  // Get current user
  res.json({ message: 'Get user endpoint' });
});

// Resume routes
app.get('/api/resumes', (req, res) => {
  // Get user resumes
  res.json({ resumes: [] });
});

app.post('/api/resumes', (req, res) => {
  // Save new resume
  res.json({ message: 'Save resume endpoint' });
});

app.put('/api/resumes/:id', (req, res) => {
  // Update resume
  res.json({ message: 'Update resume endpoint' });
});

app.delete('/api/resumes/:id', (req, res) => {
  // Delete resume
  res.json({ message: 'Delete resume endpoint' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

Add to `package.json` scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

Create `.env` file in backend directory:

```
PORT=3001
JWT_SECRET=your-secret-key-here
MONGODB_URI=mongodb://localhost:27017/ats-resume-builder
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Database Setup (MongoDB)

1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `ats-resume-builder`
3. Update the `MONGODB_URI` in your `.env` file

## Running the Backend

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## Frontend Configuration

Update your frontend `.env` file:

```
VITE_API_BASE_URL=http://localhost:3001/api
```

The frontend will automatically detect the backend and use it for data persistence instead of localStorage.
