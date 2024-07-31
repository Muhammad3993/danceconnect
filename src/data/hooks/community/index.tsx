import { communityApi } from 'data/api/community';
import { useQuery } from 'react-query';

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
}