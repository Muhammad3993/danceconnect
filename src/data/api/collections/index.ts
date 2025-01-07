import Config from 'react-native-config';
import {
  DCConstants,
  FileUploadRespoonse,
  PlaceAutocompleteResponse,
} from './interfaces';
import axios from 'axios';
import { apiClient } from '../';

const googleUrl =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json?';

export const collectionsApi = {
  async getConstants() {
    const res = await apiClient.get<DCConstants>('/constants');

    return res.data;
  },

  async searchCity(searchString: string, countryCode: string) {
    const response = await axios.get<PlaceAutocompleteResponse>(
      `${googleUrl}key=${Config.GOOGLE_API_KEY}&types=(cities)&components=country:${countryCode}&input=${searchString}&language=en`,
    );
    console.log(response);

    return response.data;
  },

  async uploadImage(data: FormData) {
    const res = await apiClient.post<FileUploadRespoonse>('/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
