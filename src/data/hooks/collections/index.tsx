import { collectionsApi } from 'data/api/collections';
import { DCCountry } from 'data/api/collections/interfaces';
import { useQuery } from 'react-query';

export const useSearchCities = (
  searchString: string,
  country: DCCountry | null,
) => {
  return useQuery({
    queryKey: ['cities', searchString, country?.countryCode],
    queryFn: () =>
      collectionsApi.searchCity(searchString, country?.countryCode ?? ''),
    enabled: searchString !== '' && Boolean(country?.availableSearchString),
  });
};
