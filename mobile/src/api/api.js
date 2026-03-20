import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use 'localhost' for Web preview, '10.0.2.2' for Android Emulator, 
// and your PC's IP (e.g., 192.168.1.5) for real device testing.
const API_BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000/api'
  : 'http://192.168.1.3:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
