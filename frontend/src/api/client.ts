import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.detail || 'An error occurred';

      switch (status) {
        case 401:
          // Clear auth and redirect to login
          localStorage.removeItem('access_token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden:', message);
          break;
        case 404:
          console.error('Not found:', message);
          break;
        case 500:
          console.error('Server error:', message);
          break;
        default:
          console.error('Error:', message);
      }
    } else if (error.request) {
      console.error('Network error: No response from server');
    } else {
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
