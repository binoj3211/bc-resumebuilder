import axios from 'axios';

// Determine the API base URL from Vite's environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

console.log('🚀 Initializing API client...');
console.log(`VITE_API_URL: ${import.meta.env.VITE_API_URL}`);
console.log(`API Base URL set to: ${API_BASE_URL}`);
console.log(`Mode: ${import.meta.env.MODE}`);

// Create a pre-configured instance of axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Send cookies with requests
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
  (config) => {
    // In a browser environment, get the token from cookies
    if (typeof window !== 'undefined') {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken='))
        ?.split('=')[1];

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('🔑 Auth token attached to request.');
      }
    }
    return config;
  },
  (error) => {
    console.error('💥 Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', error.response || error.message);
    
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('🔒 Unauthorized or Forbidden response. Logging out.');
      // Here you could trigger a logout action globally
      // For example: window.dispatchEvent(new Event('auth-error'));
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
