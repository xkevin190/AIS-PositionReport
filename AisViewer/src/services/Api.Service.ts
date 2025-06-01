// src/services/api.ts
import axios from 'axios';
import config from 'react-native-config';


const baseURL = config.BASE_URL ?? ''

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;