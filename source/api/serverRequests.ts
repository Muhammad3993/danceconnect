import axios from 'axios';
import {
  AUTHORIZATION_WITH_GOOGLE,
  LOGOUT,
  REGISTRATION_WITH_EMAIL,
} from '../store/actionTypes/authorizationActionTypes';
// import {navigationRef} from '../navigation/types';
// import {CommonActions} from '@react-navigation/native';
import {isAndroid} from '../utils/constants';
import {axiosInstance} from '../utils/helpers';
// import {DeviceEventEmitter} from 'react-native';
// import socketIoClient from 'socket.io-client';
// const socket = socketIoClient('http://localhost:3000', {autoConnect: false});
// export const apiUrl = isAndroid
//   ? 'http://192.168.1.101:4000/'
//   : 'http://localhost:4000/';
// export const apiUrl = 'http://10.10.16.99:4000/';
export const apiUrl = 'https://api.danceconnect.online/';
// const apiUrl = 'https://dance-connect-528e8b559e89.herokuapp.com';

type user = {
  email: string;
  password: string;
  userName: string;
  userGender: string;
  userCountry: string;
  userRole: string[];
  individualStyles: string[];
};
axios.defaults.headers.common.Accept = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
// axiosInstance.defaults.headers.post['Content-Type'] = 'application/json';
// axiosInstance.defaults.headers.get['Content-Type'] = 'application/json';

export const isUserExist = (email: string) => {
  axiosInstance
    .get(`userExist/${email}`)
    .then(result => result)
    .catch(er => console.log('error userexist', er));
};
export const loginByEmail = async (email: string, password: string) => {
  const data_auth = {
    email: email,
    password: password,
  };
  try {
    const response = await axiosInstance.post('auth_email/', {
      data_auth: data_auth,
    });
    // console.log('loginByEmail', response);
    return response;
  } catch (error) {
    console.log('loginByEmailerror ', error);
    return error;
  }
};
export const loginBySocial = async (email: string, password: string) => {
  try {
    const data_auth = {
      email: email,
      password: password,
    };
    const response = await axiosInstance.post('auth_social/', {
      data_auth: data_auth,
    });
    // console.log('loginBySocial', response);
    return response;
  } catch (er) {
    console.log('er loginBySocial', er);
    return er;
  }
};
export const createUser = async (data: user) => {
  try {
    const response = await axiosInstance.post('users/', data);
    // console.log(`users/`, response, data);
    // const {email, password} = data;
    // login(email, password).then();
    return response;
  } catch (er) {
    console.log('createUser er', er, data);
    return er;
  }
};
export const deleteUser = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`users/${id}`);
    // console.log('delete user', response);
    // const {email, password} = data;
    // login(email, password).then();
    return response;
  } catch (er) {
    return console.log('er', er);
  }
};

export const userExists = async (email: string) => {
  try {
    const response = await axiosInstance.get(`user/${email}`);
    // console.log('userExists response', response);
    return response?.data?.user ?? null;
  } catch (er) {
    return console.log('er', er);
  }
};
export const getUserById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`users/${id}`);
    // console.log('getUserById response', response);
    return response?.data;
  } catch (er) {
    return console.log('er', er);
  }
};

export const updateUserById = async (data: object) => {
  try {
    const response = await axiosInstance.post('user/update', data);
    // console.log('updateUserById response', response);
    return response?.data;
  } catch (er) {
    return console.log('updateUserById er', er);
  }
};

export const updateUserCountry = async (data: object) => {
  try {
    const response = await axiosInstance.post('user/update_country', data);
    // console.log('updateUserCountry response', response);
    return response?.data;
  } catch (er) {
    return console.log('er', er);
  }
};

export const refreshPassword = async (data: object) => {
  try {
    const response = await axiosInstance.post('refresh', data);
    // console.log('refreshPassword response', response);
    return response;
  } catch (er) {
    return console.log('refreshPassword er', er);
  }
};
export const getCommunitiesWithMongo = async (location: string) => {
  try {
    const response = await axiosInstance.get(
      `communities?location=${location}`,
    );
    return response?.data;
  } catch (er) {
    return console.log('er', er);
  }
};

export const getCommunitiesWithMongoByArray = async (locations: string[]) => {
  try {
    const response = await axiosInstance.post('communitiesByLocation', {
      locations: locations,
    });
    console.log('getCommunitiesWithMongoByArray', response);
    return response.data;
  } catch (er) {
    return console.log('getCommunitiesWithMongoByArray er', er);
  }
};
export const getManagingCommunity = async (locations: string[]) => {
  try {
    const response = await axiosInstance.get('managing_communities', {
      params: {location: locations},
    });
    return response?.data.data;
  } catch (er) {
    return console.log('getManagingCommunity er', er);
  }
};
// const config = {
//   onUploadProgress: (progressEvent: any) => {
//     DeviceEventEmitter.emit(
//       'upload_progress',
//       Math.floor(100 * (progressEvent.loaded / progressEvent.total)),
//     );
//   },
// };
export const createCommunityWithMongo = async (data: object) => {
  try {
    const response = await axiosInstance.post(
      'communities',
      {data: data},
      // config,
    );
    return response.data;
  } catch (error) {
    return console.log('createCommunityWithMongo er', error);
  }
};
export const getCommunityById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`community/${id}`);
    // console.log('getCommunityById', response.data);
    return {
      community: response?.data,
    };
    // return response.data[0];
  } catch (error) {
    return console.log('getCommunityById er', error);
  }
};
export const updateCommunityById = async (id: string, data: object) => {
  try {
    const response = await axiosInstance.post(`communities/${id}/update`, data);
    return response.data;
  } catch (error) {
    return console.log('createCommunityWithMongo er', error);
  }
};

export const subscribeCommunity = async (id: string) => {
  try {
    const response = await axiosInstance.post(
      `communities/${id}/subscribe`,
      null,
    );
    return response.data;
  } catch (error) {
    return console.log('subscribeEvent er', error);
  }
};
export const unSubscribeCommunity = async (id: string) => {
  // console.log('unSubscribeCommunity id', id);
  try {
    const response = await axiosInstance.post(
      `communities/${id}/unsubscribe`,
      null,
    );
    // console.log('unSubscribeCommunity response', response);
    return response.data;
  } catch (error) {
    return console.log('subscribeEvent er', error);
  }
};

export const deleteCommunityById = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`communities/${id}`);
    return response.data;
  } catch (error) {
    return console.log('deleteCommunityById er', error);
  }
};

export const getUsersImagesFromCommunity = async (communityUid: string) => {
  try {
    const response = await axiosInstance.get(
      `$}community/${communityUid}/attended-people-images`,
    );
    // console.log('getUsersImagesFromEvent', response);
    return response.data;
  } catch (error) {
    console.log('get images error', error);
  }
};
export const createEventWithMongo = async (data: object) => {
  try {
    const response = await axiosInstance.post('events', data);
    // const response = await axiosInstance.post(`events`, {data: data});
    console.log('createEventWithMongo response', response);
    return response.data;
  } catch (error) {
    return console.log('createEventWithMongo er', error);
  }
};
export const getEventsWithMongo = async (
  location?: string,
  limit?: number,
  offset?: number,
) => {
  try {
    const response = await axiosInstance.get('events/');
    // const response = await axiosInstance.get(
    //   `events/${location}?limit=${limit}&offset=${offset}`,
    // );
    // console.log('getEventsWithMongo', response);
    return {
      eventsList: response.data,
      prevOffset: Number(response.data?.prevOffset),
      prevLimit: Number(response.data?.prevLimit),
    };
  } catch (er) {
    return console.log('er', er);
  }
};

export const getEventsWithMongoByArray = async (locations: string[]) => {
  try {
    const response = await axiosInstance.post('eventsByLocation', {
      locations: locations,
    });
    // console.log('getEventsWithMongoByArray', response);
    return {
      eventsList: response.data,
      prevOffset: Number(response.data?.prevOffset),
      prevLimit: Number(response.data?.prevLimit),
    };
  } catch (er) {
    return console.log('getEventsWithMongoByArray er', er);
  }
};
export const getUsersImagesFromEvent = async (eventUid: string) => {
  try {
    const response = await axiosInstance.get(
      `event/${eventUid}/attended-people-images`,
    );
    // console.log('getUsersImagesFromEvent', response);
    return response.data;
  } catch (error) {
    console.log('get images error', error);
  }
};
export const getManagingEventsRequest = async () => {
  try {
    const response = await axiosInstance.get('managing_events');
    // console.log('getManagingEventsRequest', response);
    return response?.data;
  } catch (er) {
    return console.log('er', er);
  }
};
export const getEventById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`event/${id}`);
    return response.data;
  } catch (error) {
    // console.log('getEventById er', error);
    return null;
  }
};
export const updateEventById = async (id: string, data: object) => {
  try {
    const response = await axiosInstance.post(`events/${id}/update`, data);
    // console.log('updateEventById', response);
    return response.data;
  } catch (error) {
    return console.log('updateEventById er', error);
  }
};
export const subscribeEvent = async (id: string) => {
  try {
    const response = await axiosInstance.post(`events/${id}/subscribe`, null);
    return response.data;
  } catch (error) {
    return console.log('subscribeEvent er', error);
  }
};
export const unSubscribeEvent = async (id: string) => {
  try {
    const response = await axiosInstance.post(`events/${id}/unsubscribe`, null);
    return response.data;
  } catch (error) {
    return console.log('subscribeEvent er', error);
  }
};

export const deleteEventById = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`event/${id}`);
    return response.data;
  } catch (error) {
    return console.log('deleteEventById er', error);
  }
};
export const saveAuthToken =
  (token: string) => (next: any) => (action: any) => {
    if (token?.length > 0) {
      console.log('saveAuthToken token?.length > 0', token);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    if (action.type === REGISTRATION_WITH_EMAIL.SUCCESS) {
      if (action.payload?.token?.length > 0) {
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${action.payload?.token}`;
      }
      // socket.emit('init', action?.payload?.currentUser?.id);
    }
    if (action.type === AUTHORIZATION_WITH_GOOGLE.SUCCESS) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${action.payload?.token}`;
      // socket.emit('init', action?.payload?.currentUser?.id);
    }
    if (
      action.type === 'persist/REHYDRATE' &&
      action?.payload?.registration?.token
    ) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${action.payload.registration.token}`;
    }
    if (action.type === LOGOUT.SUCCESS) {
      delete axiosInstance.defaults.headers.common.Authorization;
    }
    return next(action);
  };
export const getConstants = async () => {
  try {
    const response = await axiosInstance.get('constants');
    return response.data;
  } catch (error) {
    console.log('error', error);
  }
};

export const getPercentage = async () => {
  try {
    const response = await axiosInstance.get('priceConfig');
    return response.data;
  } catch (error) {
    console.log('getPercentage error', error);
  }
};
export const getLanguageSetting = async () => {
  try {
    const response = await axiosInstance.get('changeLanguage');
    return response;
  } catch (error) {
    console.log('getLanguageSetting error', error);
  }
};
export const getTypeCommunity = async () => {
  try {
    const response = await axiosInstance.get('typeCommunity');
    return response;
  } catch (error) {
    console.log('getTypeCommunity error', error);
  }
};
export const payEvent = async (id: string, amount: string) => {
  const data = {
    amount: amount,
  };
  const response = await axiosInstance.post(
    `event/${id}/create-payment-intent`,
    data,
  );
  // console.log('payEvent', response);
  return response.data;
};
export const diablePayEvent = async (id: string | undefined) => {
  const response = await axiosInstance.post(
    `event/${id}/disable-payment-intent`,
  );
  // console.log('diablePayEvent', response);
  return response.data;
};
export const refundPayEvent = async (id: string) => {
  const response = await axiosInstance.post(`event/${id}/refund-payment`);
  // console.log('refundPayEvent', response);
  return response.data;
};
export const getTickets = async (eventUid: string) => {
  const response = await axiosInstance.get(`v2/event/${eventUid}/tickets`);
  // console.log('tickets', response.data);
  return response.data;
};
export const getTicketById = async (id: string) => {
  const response = await axiosInstance.get(`tickets/${id}`);
  // console.log('getTicketById', response.data);
  return response.data?.paymentDetail;
};

export const makeTicket = async (data: object) => {
  const response = await axiosInstance.post('ticket', data);
  return response;
};

export const changeTicket = async (ticketUid: string, data: object) => {
  const response = await axiosInstance.put(`ticket/${ticketUid}`, data);
  return response;
};

export const removeTicket = async (ticket: any) => {
  const response = await axiosInstance.delete(`ticket/${ticket?.id}`);
  return response;
};

export const buyTicket = async (id: string, quantity: number) => {
  const response = await axiosInstance.post(
    `ticket/buy/${id}?quantity=${quantity}`,
  );
  // const {clientSecret, payIntent}: any = response?.data;
  return response?.data;
};

export const getTicketByEventUid = async (eventUid: string) => {
  const response = await axiosInstance.get(`tickets/myByEvent/${eventUid}`);
  // console.log('getTicketByEventUid', response);
  // const {clientSecret, payIntent}: any = response?.data;
  return response?.data;
};
export const getPurchasedTickets = async () => {
  const response = await axiosInstance.get('tickets/getAllMyTickets');
  return response.data;
};

export const addManagerToCommunity = async (
  communityUid: string,
  email: string,
) => {
  const response = await axiosInstance.post(
    `community/manager/${communityUid}?email=${email}`,
  );
  return response.data;
};
export const deleteManagerToCommunity = async (
  communityUid: string,
  email: string,
) => {
  const response = await axiosInstance.delete(
    `community/manager/${communityUid}?email=${email}`,
  );
  return response.data;
};
export const getManagersForCommunityUid = async (communityUid: string) => {
  const response = await axiosInstance.get(
    `community/managers/${communityUid}`,
  );
  return response.data;
};

export const getUsersList = async (locations: string[]) => {
  const response = await axiosInstance.get('users/list', {
    params: {location: locations},
  });
  return response.data;
};

export const setFcmTocken = async (fcmToken: string) => {
  const data = {
    fcmToken: fcmToken,
  };
  const response = await axiosInstance.post('user/fcm_token', data);
  return response.data;
};
export const sendNotification = async (data: any) => {
  const response = await axiosInstance.post('send-notification/', {data});
  return response.data;
};

export const getEventForUserId = async (user_id: string) => {
  const response = await axiosInstance.get(`events/${user_id}`);
  return response.data;
};

export const getCommunitiesForUserId = async (user_id: string) => {
  const response = await axiosInstance.get(`communities/${user_id}`);
  return response.data;
};

export const deleteReccurentEventsById = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`recurrentEvent/${id}`);
    return response.data;
  } catch (error) {
    return console.log('deleteEventById er', error);
  }
};
export const updateReccurentEventsById = async (id: string, data: object) => {
  try {
    const response = await axiosInstance.post(
      `recurrentEvent/${id}/update`,
      data,
    );
    console.log('updateReccurentEventsById', response);
    return response.data;
  } catch (error) {
    return console.log('updateEventById er', error);
  }
};

export const getRecurrentEventById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`recurrentEvent/${id}`);
    return response.data;
  } catch (error) {
    // console.log('getEventById er', error);
    return null;
  }
};

export const getEventsWithMongoByArrayPgn = async (
  locations: string[],
  page: number,
  pageSize: number,
) => {
  try {
    const response = await axiosInstance.post(
      `eventsByLocationPaginated?page=${Number(page)}&pageSize=${pageSize}`,
      {
        locations: locations,
      },
    );
    console.log('eventsByLocationPaginated', response, page, pageSize);
    return {
      eventsList: response.data?.data,
      page: Number(response.data?.meta?.page),
      pageSize: Number(response.data?.meta?.pageSize),
      totalCount: Number(response.data?.meta?.total),
    };
  } catch (er) {
    return console.log('getEventsWithMongoByArray er', er);
  }
};
