import { apiClient } from '../';
import { Community } from './interfaces';

export const communityApi = {
  async getCommunities() {
    const res = await apiClient.get<Community[]>('/community');

    return res.data;
  },

  async getCommunity(id: string) {
    const res = await apiClient.get<Community>(`/community/${id}`);

    return res.data;
  },

  async createCommunity(communityData: Omit<Community, 'id'>) {
    const res = await apiClient.post<Community>('/community', communityData);
    return res.data;
  },

  async updateCommunity(communityData: Community) {
    const res = await apiClient.put<Community>(
      `/community/update/${communityData.id}`,
      communityData,
    );
    return res.data;
  },

  async toggleFollowCommunity({ isFollowing, id }: Community) {
    const res = await apiClient.post(
      `/community/${isFollowing ? 'unfollow' : 'follow'}/${id}`,
    );
    return res.data;
  },
};
