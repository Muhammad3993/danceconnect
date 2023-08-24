import axios from 'axios';
import {
  AUTHORIZATION_WITH_GOOGLE,
  LOGOUT,
  REGISTRATION_WITH_EMAIL,
} from '../store/actionTypes/authorizationActionTypes';
// import socketIoClient from 'socket.io-client';
// const socket = socketIoClient('http://localhost:3000', {autoConnect: false});

// const apiUrl = 'http://localhost:3000';
const apiUrl = 'http://165.22.126.209:3000';

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
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.get['Content-Type'] = 'application/json';

export const isUserExist = (email: string) => {
  axios
    .get(`${apiUrl}/userExist/${email}`)
    .then(result => result)
    .catch(er => console.log('error userexist', er));
};
export const loginByEmail = async (email: string, password: string) => {
  const data_auth = {
    email: email,
    password: password,
  };
  const response = await axios.post(`${apiUrl}/auth_email/`, {
    data_auth: data_auth,
  });
  // console.log('loginByEmail', response);
  return response;
};
export const loginBySocial = async (email: string, password: string) => {
  try {
    const data_auth = {
      email: email,
      password: password,
    };
    const response = await axios.post(`${apiUrl}/auth_social/`, {
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
    const response = await axios.post(`${apiUrl}/users/`, {data: data});
    // console.log('createUser', response);
    // const {email, password} = data;
    // login(email, password).then();
    return response;
  } catch (er) {
    return console.log('er', er);
  }
};
export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`${apiUrl}/users/${id}`);
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
    const response = await axios.get(`${apiUrl}/user/${email}`);
    // console.log('userExists response', response);
    return response?.data?.user ?? null;
  } catch (er) {
    return console.log('er', er);
  }
};
export const getUserById = async (id: string) => {
  try {
    const response = await axios.get(`${apiUrl}/users/${id}`);
    // console.log('getUserById response', response);
    return response?.data?.data ?? null;
  } catch (er) {
    return console.log('er', er);
  }
};

export const updateUserById = async (data: object) => {
  try {
    const response = await axios.post(`${apiUrl}/user/update`, data);
    // console.log('updateUserById response', response);
    return response?.data;
  } catch (er) {
    return console.log('er', er);
  }
};

export const updateUserCountry = async (data: object) => {
  try {
    const response = await axios.post(`${apiUrl}/user/update_county`, data);
    // console.log('updateUserCountry response', response);
    return response?.data;
  } catch (er) {
    return console.log('er', er);
  }
};

export const refreshPassword = async (data: object) => {
  try {
    const response = await axios.post(`${apiUrl}/refresh`, data);
    // console.log('refreshPassword response', response);
    return response?.data;
  } catch (er) {
    return console.log('refreshPassword er', er);
  }
};
export const getCommunitiesWithMongo = async (location: string) => {
  try {
    const response = await axios.get(`${apiUrl}/communities/${location}`);
    console.log('getCommunitiesWithMongo', response);
    return response?.data?.data;
  } catch (er) {
    return console.log('er', er);
  }
};
export const getManagingCommunity = async () => {
  try {
    const response = await axios.get(`${apiUrl}/managing_communities`);
    console.log('getManagingCommunity', response);
    return response?.data?.data;
  } catch (er) {
    return console.log('er', er);
  }
};
export const createCommunityWithMongo = async (data: object) => {
  try {
    const response = await axios.post(`${apiUrl}/communities`, {data: data});
    return response.data;
  } catch (error) {
    return console.log('createCommunityWithMongo er', error);
  }
};
export const getCommunityById = async (id: string) => {
  try {
    const response = await axios.get(`${apiUrl}/community/${id}`);
    // console.log('getCommunityById', response);
    return response.data;
  } catch (error) {
    return console.log('getCommunityById er', error);
  }
};
export const updateCommunityById = async (id: string, data: object) => {
  try {
    const response = await axios.post(`${apiUrl}/communities/${id}/update`, {
      data,
    });
    // console.log('updateCommunityById', response);
    return response.data;
  } catch (error) {
    return console.log('createCommunityWithMongo er', error);
  }
};

export const subscribeCommunity = async (id: string) => {
  try {
    const response = await axios.post(
      `${apiUrl}/communities/${id}/subscribe`,
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
    const response = await axios.post(
      `${apiUrl}/communities/${id}/unsubscribe`,
      null,
    );
    console.log('unSubscribeCommunity response', response);
    return response.data;
  } catch (error) {
    return console.log('subscribeEvent er', error);
  }
};

export const deleteCommunityById = async (id: string) => {
  try {
    const response = await axios.delete(`${apiUrl}/communities/${id}`);
    return response.data;
  } catch (error) {
    return console.log('createCommunityWithMongo er', error);
  }
};

export const getUsersImagesFromCommunity = async (communityUid: string) => {
  try {
    const response = await axios.get(
      `${apiUrl}/community/${communityUid}/attended-people-images`,
    );
    // console.log('getUsersImagesFromEvent', response);
    return response.data;
  } catch (error) {
    console.log('get images error', error);
  }
};
export const createEventWithMongo = async (data: object) => {
  try {
    const response = await axios.post(`${apiUrl}/events`, {data: data});
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
    const response = await axios.get(`${apiUrl}/events/`);
    // const response = await axios.get(
    //   `${apiUrl}/events/${location}?limit=${limit}&offset=${offset}`,
    // );
    console.log('getEventsWithMongo', response.data);
    return {
      eventsList: response.data?.data,
      prevOffset: Number(response.data?.prevOffset),
      prevLimit: Number(response.data?.prevLimit),
    };
  } catch (er) {
    return console.log('er', er);
  }
};
export const getUsersImagesFromEvent = async (eventUid: string) => {
  try {
    const response = await axios.get(
      `${apiUrl}/event/${eventUid}/attended-people-images`,
    );
    // console.log('getUsersImagesFromEvent', response);
    return response.data;
  } catch (error) {
    console.log('get images error', error);
  }
};
export const getManagingEventsRequest = async () => {
  try {
    const response = await axios.get(`${apiUrl}/managing_events`);
    // console.log('getManagingEventsRequest', response);
    return response?.data;
  } catch (er) {
    return console.log('er', er);
  }
};
export const getEventById = async (id: string) => {
  try {
    const response = await axios.get(`${apiUrl}/event/${id}`);
    return response.data;
  } catch (error) {
    // console.log('getEventById er', error);
    return null;
  }
};
export const updateEventById = async (id: string, data: object) => {
  try {
    const response = await axios.post(`${apiUrl}/events/${id}/update`, {
      data,
    });
    return response.data;
  } catch (error) {
    return console.log('updateEventById er', error);
  }
};
export const subscribeEvent = async (id: string) => {
  try {
    const response = await axios.post(`${apiUrl}/events/${id}/subscribe`, null);
    return response.data;
  } catch (error) {
    return console.log('subscribeEvent er', error);
  }
};
export const unSubscribeEvent = async (id: string) => {
  try {
    const response = await axios.post(
      `${apiUrl}/events/${id}/unsubscribe`,
      null,
    );
    return response.data;
  } catch (error) {
    return console.log('subscribeEvent er', error);
  }
};

export const deleteEventById = async (id: string) => {
  try {
    const response = await axios.delete(`${apiUrl}/events/${id}`);
    return response.data;
  } catch (error) {
    return console.log('deleteEventById er', error);
  }
};
export const saveAuthToken =
  (token: string) => (next: any) => (action: any) => {
    if (token?.length > 0) {
      console.log('saveAuthToken token?.length > 0', token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    if (action.type === REGISTRATION_WITH_EMAIL.SUCCESS) {
      axios.defaults.headers.common.Authorization = `Bearer ${action.payload?.token}`;
      // socket.emit('init', action?.payload?.currentUser?.id);
    }
    if (action.type === AUTHORIZATION_WITH_GOOGLE.SUCCESS) {
      axios.defaults.headers.common.Authorization = `Bearer ${action.payload?.token}`;
      // socket.emit('init', action?.payload?.currentUser?.id);
    }
    if (
      action.type === 'persist/REHYDRATE' &&
      action?.payload?.registration?.token
    ) {
      console.log('persist/REHYDRATE', action.payload);
      axios.defaults.headers.common.Authorization = `Bearer ${action.payload.registration.token}`;
    }
    if (action.type === LOGOUT.SUCCESS) {
      delete axios.defaults.headers.common.Authorization;
    }
    return next(action);
  };
export const getConstants = async () => {
  try {
    const response = await axios.get(`${apiUrl}/constants`);
    return response.data;
  } catch (error) {
    console.log('error', error);
  }
};

export const payEvent = async (id: string, amount: string) => {
  const data = {
    amount: amount,
  };
  const response = await axios.post(
    `${apiUrl}/event/${id}/create-payment-intent`,
    data,
  );
  // console.log('payEvent', response);
  return response.data;
};
export const diablePayEvent = async (id: string | undefined) => {
  const response = await axios.post(
    `${apiUrl}/event/${id}/disable-payment-intent`,
  );
  console.log('diablePayEvent', response);
  return response.data;
};
export const refundPayEvent = async (id: string) => {
  const response = await axios.post(`${apiUrl}/event/${id}/refund-payment`);
  // console.log('refundPayEvent', response);
  return response.data;
};
export const getTickets = async () => {
  const response = await axios.get(`${apiUrl}/tickets`);
  // console.log('tickets', response.data);
  return response.data;
};
export const getTicketById = async (id: string) => {
  const response = await axios.get(`${apiUrl}/tickets/${id}`);
  // console.log('getTicketById', response.data);
  return response.data?.paymentDetail;
};
