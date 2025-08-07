# Google OAuth Setup Guide

To enable Google OAuth authentication in your ATS Resume Builder, follow these steps:

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google Sign-In API)

## 2. Configure OAuth 2.0

1. Go to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Configure the OAuth consent screen first if prompted
4. Choose "Web application" as the application type
5. Add authorized origins:
   - `http://localhost:5174` (for development)
   - Your production domain (when deployed)
6. Add authorized redirect URIs:
   - `http://localhost:5174` (for development)
   - Your production domain (when deployed)

## 3. Get Your Client ID

After creating the OAuth client, you'll get a Client ID that looks like:
`1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`

## 4. Environment Variables

Create a `.env` file in your project root and add:

```
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## 5. Update AuthContext

The AuthContext is already configured to use the Google Client ID from environment variables. Make sure to replace the placeholder in the GoogleOAuthProvider component.

## 6. Backend Setup (Required for Full Functionality)

To make authentication work properly, you'll need to set up a backend API with endpoints for:

- `POST /api/auth/login` - Manual login
- `POST /api/auth/register` - User registration  
- `POST /api/auth/google` - Google OAuth verification
- `GET /api/auth/me` - Get current user
- `POST /api/resumes` - Save resume
- `GET /api/resumes` - Get user resumes
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

The frontend is already configured to make API calls to these endpoints.

## 7. Test the Authentication

1. Start your development server: `npm run dev`
2. Click "Sign In" or "Sign Up" in the header
3. Test both Google OAuth and manual authentication
4. Verify that user session persists on page refresh

Note: Without a backend, the authentication will work in demo mode using localStorage, but data won't persist between sessions or be shared across devices.
