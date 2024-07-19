import { apiClient } from '../';
import { Community } from './interfaces';

export const communityApi = {
  async getCommunities() {
    const res = await apiClient.get<Community[]>('/community');

    return res.data;
  },
};
