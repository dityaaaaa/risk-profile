import axios from 'axios';
import apiClient from './client';
import { LoginRequest, RegisterRequest, TokenResponse } from '../types/auth';
import { User } from '../types/user';
import { API_BASE_URL } from '../utils/constants';

export const authApi = {
  // Login - uses x-www-form-urlencoded
  login: async (email: string, password: string): Promise<TokenResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', email); // Backend expects 'username' field
    formData.append('password', password);

    const response = await axios.post<TokenResponse>(
      `${API_BASE_URL}/auth/token`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  },

  // Register - uses JSON
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register', data);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};
