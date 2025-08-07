# ATS Resume Builder - Backend API

This is the backend service for the ATS Resume Builder that handles PDF text extraction using Node.js.

## Features

- 🔍 **Robust PDF Text Extraction** - Uses `pdf-parse` library for reliable text extraction
- 🛡️ **Security** - Includes CORS, Helmet, and file validation
- 📊 **Structured Data Parsing** - Extracts personal info, skills, and sections automatically  
- 🚀 **Fast Performance** - Memory-based processing with compression
- 📝 **Detailed Logging** - Console logs for debugging extraction issues

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

### 3. Test the API
```bash
# Health check
curl http://localhost:3001/health

# Test PDF extraction (replace with your PDF file)
curl -X POST -F "resume=@your-resume.pdf" http://localhost:3001/api/extract-pdf-text
```

## API Endpoints

### GET /health
Health check endpoint to verify server status.

**Response:**
```json
{
  "status": "OK",
  "service": "ATS Resume Backend",
  "timestamp": "2025-08-07T20:30:00.000Z"
}
```

### POST /api/extract-pdf-text
Extract text from uploaded PDF resume.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: Form field named `resume` with PDF file

**Response:**
```json
{
  "success": true,
  "extractedText": "Full extracted text from PDF...",
  "metadata": {
    "pages": 2,
    "textLength": 1250,
    "fileName": "resume.pdf",
    "fileSize": 245760,
    "extractionMethod": "pdf-parse (Node.js)"
  },
  "structuredData": {
    "personalInfo": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "555-123-4567"
    },
    "skills": ["JavaScript", "React", "Node.js"],
    "rawLines": ["Line 1", "Line 2", "..."]
  }
}
```

## File Limits

- **Maximum file size:** 10MB
- **Allowed file types:** PDF only
- **CORS origins:** `http://localhost:5174`, `http://localhost:3000`

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `400` - Bad request (no file, wrong file type, file too large)
- `500` - Server error (PDF parsing failed)

## Environment Variables

- `PORT` - Server port (default: 3001)

## Dependencies

- **express** - Web framework
- **multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **compression** - Response compression
