import axios, { AxiosError } from 'axios';
import { sharedStorage } from 'common/libs/shared_storage';
import Config from 'react-native-config';
import { DCStore } from 'store';

export const apiClient = axios.create({
  baseURL: Config.API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  async function (config) {
    const token = await sharedStorage.getItem('token');
    // Do something before request is sent
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error: AxiosError) {
    console.log('error data', error.response?.data);

    if (error.response?.status === 401 || error.status === 401) {
      DCStore.getState().clearDCStoreAction({ endSession: false });
    }

    if (error.response?.data?.error) {
      error.message = error.response?.data?.error;
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);

export const getImgePath = (image?: string) => {
  if (!image) {
    return undefined;
  }

  return Config.API_URL + '/public/' + image;
};
