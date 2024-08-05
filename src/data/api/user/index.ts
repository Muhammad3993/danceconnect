import { apiClient } from '../';
import {
  AuthResponse,
  AuthUserRequest,
  User,
  EditUserRequest,
} from './inerfaces';

export const userApi = {
  async googleLoginUser(idToken: string) {
    const res = await apiClient.post<AuthResponse>('/auth/google', { idToken });

    return res.data;
  },
  async loginUser(data: AuthUserRequest) {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    return res.data;
  },
  async registerUser(data: AuthUserRequest) {
    const res = await apiClient.post<AuthResponse>('/user', data);

    return res.data;
  },
  async editUser(data: EditUserRequest) {
    const res = await apiClient.put<User>('/user', data);

    return res.data;
  },
  async getUser() {
    const res = await apiClient.get<User>('/profile');
    return res.data;
  },
  async deleteAccount(id: string) {
    const res = await apiClient.delete(`/${id}`);
    return res.data;
  },
};
