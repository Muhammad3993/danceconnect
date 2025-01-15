import { collectionsApi } from 'data/api/common';
import { DCCountry } from 'data/api/common/interfaces';
import { useMutation, useQuery } from '@tanstack/react-query';
import i18n from 'i18n';
import { useDebounceValue } from 'common/hooks/useDebounceValue';

export const useSearchCities = (
  searchString: string,
  country: DCCountry | null,
) => {
  const [debounceText] = useDebounceValue(searchString);

  return useQuery({
    queryKey: ['cities', debounceText, country?.countryCode],
    queryFn: () => {
      return collectionsApi.searchCity(
        debounceText,
        country?.countryCode ?? '',
        i18n.language,
      );
    },
    enabled: debounceText !== '',
  });
};

export const useUploadImage = () => {
  return useMutation({ mutationFn: collectionsApi.uploadImage });
};
