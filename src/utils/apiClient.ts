// utils/apiClient.ts
import axios from 'axios';
import { getAuthApiBaseUrl } from '../composables/authConfig';

const apiClient = axios.create({
  baseURL: getAuthApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const tokenData = localStorage.getItem('token');
  
  if (tokenData) {
    try {
      const parsed = JSON.parse(tokenData);
      const isExpired = parsed.expiresAt < Date.now();
      if (!isExpired) {
        config.headers['Authorization'] = `Bearer ${parsed.accessToken}`;
      }
    } catch (e) {
      // Token parsing failed – continue without auth header
    }
  }
  return config;
});

export default apiClient;
