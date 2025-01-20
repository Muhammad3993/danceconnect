import { collectionsApi } from 'data/api/common';
import { DCCountry } from 'data/api/common/interfaces';
import { useMutation, useQuery } from '@tanstack/react-query';
import i18n from 'i18n';
import { useDebounceValue } from 'common/hooks/useDebounceValue';
import { showErrorToast } from 'common/libs/toast';
import { useState } from 'react';
import { sharedStorage } from 'common/libs/shared_storage';

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
  const [progress, setProgress] = useState(0);
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = await sharedStorage.getItem('token');
      if (!token) {
        throw new Error('User not found');
      }

      return collectionsApi.uploadImage({ formData, token }, progressEvent => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setProgress(percentCompleted);
        }
      });
    },
    onSuccess() {
      setProgress(0);
    },
    onError(err) {
      const error = err as Error;
      showErrorToast(error.message);
    },
  });

  return { mutate, progress, isPending };
};
