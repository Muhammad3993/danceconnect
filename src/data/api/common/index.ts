import Config from 'react-native-config';
import {
  DCConstants,
  PlaceAutocompleteResponse,
  ServerFile,
} from './interfaces';
import axios, { AxiosProgressEvent } from 'axios';
import { apiClient } from '../';

export const collectionsApi = {
  async getConstants() {
    const res = await apiClient.get<DCConstants>('/constants');

    return res.data;
  },

  async searchCity(
    searchString: string,
    countryCode: string,
    language: string,
  ) {
    const response = await axios.get<PlaceAutocompleteResponse>(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {
        params: {
          key: Config.GOOGLE_API_KEY,
          types: '(cities)',
          components: `country:${countryCode}`,
          input: searchString,
          language,
        },
      },
    );

    return response.data;
  },

  async uploadImage(
    { token, formData }: { token: string; formData: FormData },
    onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
  ) {
    const res = await apiClient.post<ServerFile>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress,
    });

    return res.data;
  },
};
