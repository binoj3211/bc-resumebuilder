// Backend API utility for PDF text extraction
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001';

console.log('🔧 Backend Extractor Configuration:', {
  envApiUrl: import.meta.env.VITE_API_BASE_URL,
  backendUrl: BACKEND_URL,
  mode: import.meta.env.MODE
});

export class BackendPDFExtractor {
  constructor() {
    this.baseUrl = BACKEND_URL;
    console.log('🚀 BackendPDFExtractor initialized with URL:', this.baseUrl);
  }

  // Check if backend server is available
  async checkHealth() {
    try {
      console.log('🔍 Checking backend health at:', `${this.baseUrl}/health`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend server is healthy:', data);
        console.log('✅ Backend URL working:', this.baseUrl);
        return true;
      } else {
        console.log('❌ Backend health check failed - bad response:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('❌ Backend health check timed out after 5 seconds');
      } else {
        console.log('❌ Backend server not available:', error.message);
      }
      console.log('❌ Attempted URL:', `${this.baseUrl}/health`);
      return false;
    }
  }

  // Extract text from PDF using backend API
  async extractPDFText(file) {
    try {
      console.log('🚀 Sending PDF to backend for extraction...');
      
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`${this.baseUrl}/api/extract-pdf-text`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Backend extraction successful:', {
          textLength: result.extractedText?.length || 0,
          pages: result.metadata?.pages || 0,
          method: result.metadata?.extractionMethod || 'unknown',
          hasStructuredData: !!(result.structuredData),
          structuredDataKeys: result.structuredData ? Object.keys(result.structuredData) : []
        });
        console.log('🔍 First 200 chars of extracted text:', result.extractedText?.substring(0, 200) + '...');
        
        return {
          fullText: result.extractedText || '',
          lines: result.extractedText ? result.extractedText.split('\n').filter(line => line.trim()) : [],
          extractedSuccessfully: !!(result.extractedText && result.extractedText.trim()),
          pagesProcessed: result.metadata?.pages || 0,
          usedOCR: false, // Backend doesn't use OCR yet
          extractionMethod: 'Backend API (pdf-parse)',
          structuredData: result.structuredData || null
        };
      } else {
        console.error('❌ Backend extraction failed:', result.error);
        return {
          fullText: '',
          lines: [],
          extractedSuccessfully: false,
          error: result.error || 'Backend extraction failed',
          extractionMethod: 'Backend API (pdf-parse) - FAILED'
        };
      }
    } catch (error) {
      console.error('❌ Backend API error:', error);
      return {
        fullText: '',
        lines: [],
        extractedSuccessfully: false,
        error: error.message || 'Network error connecting to backend',
        extractionMethod: 'Backend API - CONNECTION FAILED'
      };
    }
  }
}

// Create singleton instance
export const backendExtractor = new BackendPDFExtractor();

// Enhanced PDF analyzer that tries backend first, then falls back to client-side
export const enhancedParsePDFContent = async (file) => {
  console.log('🔄 Attempting enhanced PDF extraction...');
  console.log('📄 File details:', { name: file.name, size: file.size, type: file.type });
  
  // Try backend first
  console.log('🔍 Checking if backend is available...');
  const isBackendAvailable = await backendExtractor.checkHealth();
  console.log('🎯 Backend availability result:', isBackendAvailable);
  
  if (isBackendAvailable) {
    console.log('🎯 Using backend API for PDF extraction');
    try {
      const backendResult = await backendExtractor.extractPDFText(file);
      console.log('🔍 Backend result:', {
        success: backendResult.extractedSuccessfully,
        textLength: backendResult.fullText?.length || 0,
        hasStructuredData: !!(backendResult.structuredData),
        structuredDataKeys: backendResult.structuredData ? Object.keys(backendResult.structuredData) : [],
        personalInfo: backendResult.structuredData?.personalInfo
      });
      
      if (backendResult.extractedSuccessfully) {
        console.log('✅ Backend extraction successful');
        return backendResult;
      } else {
        console.log('⚠️ Backend extraction failed, falling back to client-side...', backendResult.error);
      }
    } catch (error) {
      console.error('❌ Backend extraction error:', error);
      console.log('⚠️ Falling back to client-side extraction...');
    }
  } else {
    console.log('⚠️ Backend not available, using client-side extraction...');
  }
  
  // Fallback to original client-side method
  try {
    console.log('📄 Attempting client-side PDF extraction...');
    const { parsePDFContent } = await import('./atsAnalyzer.js');
    const clientResult = await parsePDFContent(file);
    console.log('📊 Client-side result:', {
      success: clientResult.extractedSuccessfully,
      textLength: clientResult.fullText?.length || 0,
      method: clientResult.extractionMethod
    });
    return {
      ...clientResult,
      extractionMethod: clientResult.extractionMethod || 'Client-side (PDF.js)'
    };
  } catch (error) {
    console.error('❌ Client-side extraction also failed:', error);
    return {
      fullText: '',
      lines: [],
      extractedSuccessfully: false,
      error: 'Both backend and client-side extraction failed',
      extractionMethod: 'ALL METHODS FAILED'
    };
  }
};
