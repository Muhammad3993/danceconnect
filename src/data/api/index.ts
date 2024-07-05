import axios, { AxiosError } from 'axios';
import { localstorage } from 'common/libs/mmkv';
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
  function (config) {
    const token = localstorage.getItem('token');
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
  function (error: AxiosError) {
    if (error.response?.status === 401 || error.status === 401) {
      DCStore.getState().clearDCStoreAction();
      localstorage.clearAll();
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);
