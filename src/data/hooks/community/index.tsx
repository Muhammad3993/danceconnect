import { communityApi } from 'data/api/community';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getImgePath } from 'data/api';
import { Community } from 'data/api/community/interfaces';

export default function useGetCommunities() {
  return useQuery({
    queryKey: ['communities'],
    queryFn: communityApi.getCommunities,
  });
}

export const useGetCommunity = (id: string) => {
  return useQuery({
    queryKey: ['communities', { id }],
    queryFn: () => communityApi.getCommunity(id),
  });
};

export const useCreateCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Community>) => {
      // const amityCommunity = await DCAmity.createCommunity({
      //   displayName: data.title,
      //   metadata: { photo: getImgePath(data.images[0]) ?? '' },
      // });

      // data.channelId = amityCommunity.data.channelId;

      const community = await communityApi.createCommunity(data);

      return community;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });
};

export const useUpdateCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Community>) => {
      // await DCAmity.updateCommunity(data.channelId, {
      //   displayName: data.title,
      //   metadata: { photo: getImgePath(data.images[0]) ?? '' },
      // });

      const community = await communityApi.updateCommunity(data);

      return community;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });
};

export const useToggleFollowCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (community: Community) => {
      // if (community.isFollowing) {
      //   await DCAmity.leaveCommunity(community.channelId);
      // } else {
      //   await DCAmity.joinCommunity(community.channelId);
      // }
      await communityApi.toggleFollowCommunity(community);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });
};
