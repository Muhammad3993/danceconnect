import { communityApi } from 'data/api/community';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function useGetCommunities() {
  return useQuery({
    queryKey: ['communities'],
    queryFn: communityApi.getCommunities,
  });
}

export const useGetCommunity = (id: string) => {
  return useQuery({
    queryKey: ['communities', id],
    queryFn: () => communityApi.getCommunity(id),
  });
};

export const useCreateCommunity = () => {
  return useMutation({ mutationFn: communityApi.createCommunity });
};

export const useToggleFollowCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: communityApi.toggleFollowCommunity,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });
};
