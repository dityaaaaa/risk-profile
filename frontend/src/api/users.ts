import apiClient from './client';
import { User, UserCreate } from '../types/user';

export const usersApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users/');
    return response.data;
  },

  createUser: async (data: UserCreate): Promise<User> => {
    const response = await apiClient.post<User>('/users/', data);
    return response.data;
  },

  updateUser: async (id: number, data: UserCreate): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
