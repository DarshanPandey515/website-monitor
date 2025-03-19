// src/utils/api.js
import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:8000/api/";

export const api = axios.create({  // Export api
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleRequest = async (request) => {
  try {
    const response = await request();
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchWebsites = () => handleRequest(() => api.get('websites/'));
export const fetchPerformanceMetrics = () => handleRequest(() => api.get('performance-metrics/'));
export const fetchLogs = () => handleRequest(() => api.get('uptime-logs/'));
export const triggerCheck = (id) => handleRequest(() => api.post('trigger-check/', { website_id: id }));