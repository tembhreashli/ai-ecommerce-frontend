import api from './api';
import { User, ApiResponse } from '../types';

/**
 * Get user profile
 */
export const getUserProfile = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>('/users/profile');
  return response.data.data;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  const response = await api.put<ApiResponse<User>>('/users/profile', userData);
  return response.data.data;
};

/**
 * Change password
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  await api.put('/users/password', {
    currentPassword,
    newPassword,
  });
};

/**
 * Delete user account
 */
export const deleteAccount = async (): Promise<void> => {
  await api.delete('/users/account');
};

/**
 * Upload user avatar
 */
export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await api.post<ApiResponse<{ url: string }>>(
    '/users/avatar',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data.data.url;
};
