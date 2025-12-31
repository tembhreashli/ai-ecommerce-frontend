import api from './api';
import { User, LoginForm, RegisterForm, ApiResponse } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Login user
 */
export const login = async (credentials: LoginForm): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
  
  // Store token and user data
  if (response.data.success && response.data.data) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.data.token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.data.user));
  }
  
  return response.data.data;
};

/**
 * Register new user
 */
export const register = async (userData: RegisterForm): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
  
  // Store token and user data
  if (response.data.success && response.data.data) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.data.token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.data.user));
  }
  
  return response.data.data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } finally {
    // Clear local storage regardless of API response
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>('/auth/me');
  return response.data.data;
};

/**
 * Refresh auth token
 */
export const refreshToken = async (): Promise<string> => {
  const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh');
  const newToken = response.data.data.token;
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
  return newToken;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Get stored user data
 */
export const getStoredUser = (): User | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  return userData ? JSON.parse(userData) : null;
};
