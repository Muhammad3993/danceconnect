import { apiClient, getImgePath } from '../';
import { Community } from './interfaces';
import { client } from 'common/libs/strem-chat';

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
    const channel = client.channel('messaging', null, {
      blocked: false,
      name: communityData.title,
      image: getImgePath(communityData.images[0]),
    });

    const created = await channel.create();

    communityData.channelId = created.channel.id;

    const res = await apiClient.post<Community>('/community', communityData);
    return res.data;
  },

  async toggleFollowCommunity({ isFollowing, id }: Community) {
    const res = await apiClient.post(
      `/community/${isFollowing ? 'unfollow' : 'follow'}/${id}`,
    );
    return res.data;
  },
};
