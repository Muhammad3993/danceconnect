import { DCAmity } from 'common/libs/amity';
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
    const amityCommunity = await DCAmity.createCommunity({
      displayName: communityData.title,
      metadata: { photo: communityData.images[0] },
    });

    communityData.channelId = amityCommunity.data.channelId;

    const res = await apiClient.post<Community>('/community', communityData);
    return res.data;
  },

  async toggleFollowCommunity({ isFollowing, id, channelId }: Community) {
    if (isFollowing) {
      await DCAmity.leaveCommunity(channelId);
    } else {
      await DCAmity.joinCommunity(channelId);
    }

    const res = await apiClient.post(
      `/community/${isFollowing ? 'unfollow' : 'follow'}/${id}`,
    );
    return res.data;
  },
};
