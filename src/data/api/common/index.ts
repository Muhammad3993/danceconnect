import Config from 'react-native-config';
import {
  DCConstants,
  FileUploadRespoonse,
  PlaceAutocompleteResponse,
} from './interfaces';
import axios from 'axios';
import { apiClient } from '..';

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

  async uploadImage(data: FormData) {
    const res = await apiClient.post<FileUploadRespoonse>('/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
