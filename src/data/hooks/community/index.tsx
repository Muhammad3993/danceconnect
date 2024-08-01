import { communityApi } from 'data/api/community';
import { Community } from 'data/api/community/interfaces';
import { useMutation, useQuery } from 'react-query';

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
  return useMutation((communityData: Omit<Community, 'id'>) =>
    communityApi.createCommunity(communityData),
  );
}