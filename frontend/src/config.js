// Centralized API Base URL configuration for SHOPEZ
// Automatically switches between localhost (dev) and production (deployed)

const getApiBaseUrl = () => {
  // If explicitly provided in environment variables
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Fallback dynamic detection based on client hostname
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }

  // Put your production Render URL here or relative path if hosting on the same domain
  return 'https://shopez-backend.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
