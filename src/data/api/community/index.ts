import { apiClient } from '../';
import { Community } from './interfaces';

export const communityApi = {
  async getCommunities() {
    const res = await apiClient.get<Community[]>('/community');

    return res.data;
  },

  async getCommunity(id: number) {
    const res = await apiClient.get<Community>(`/community/${id}`);

    return res.data;
  },

  async createCommunity(communityData: Omit<Community, 'id'>) {
    const res = await apiClient.post<Community>('/community', communityData);
    return res.data;
  },
};
