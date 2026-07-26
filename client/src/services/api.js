import axios from 'axios';

/**
 * Axios instance pre-configured for the HireHelper API.
 * Reads base URL from environment variable VITE_API_BASE_URL or defaults to http://localhost:5000/api.
 */
const api = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach Auth Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      console.warn('Unauthorized access - 401');
    } else if (status === 403) {
      console.warn('Forbidden resource - 403');
    } else if (status === 404) {
      console.warn('Resource not found - 404');
    } else if (status >= 500) {
      console.error('Server error - 500 range');
    }
    return Promise.reject(error);
  }
);

export default api;
