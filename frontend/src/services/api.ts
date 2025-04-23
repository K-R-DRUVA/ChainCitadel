import axios from 'axios';
import { ApiResponse } from '../types';

// Base URL should be configured based on environment
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create an axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic GET request
export const get = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  try {
    const response = await api.get<ApiResponse<T>>(endpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<T>;
    }
    return {
      success: false,
      error: 'Network error occurred',
    };
  }
};

// Generic POST request
export const post = async <T>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
  try {
    const response = await api.post<ApiResponse<T>>(endpoint, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<T>;
    }
    return {
      success: false,
      error: 'Network error occurred',
    };
  }
};

export default api;