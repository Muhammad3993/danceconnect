import { communityApi } from 'data/api/community';
import { useQuery } from 'react-query';

export default function useGetCommunities() {
  return useQuery({
    queryKey: ['communites'],
    queryFn: communityApi.getCommunities,
  });
}
