import { communityApi } from 'data/api/community';
import { useMutation, useQuery } from '@tanstack/react-query';

export default function useGetCommunities() {
  return useQuery({
    queryKey: ['communites'],
    queryFn: communityApi.getCommunities,
  });
}

export const useGetCommunity = (id: number) => {
  return useQuery({
    queryKey: ['community', id],
    queryFn: () => communityApi.getCommunity(id),
  });
};

export const useCreateCommunity = () => {
  return useMutation({ mutationFn: communityApi.createCommunity });
};
