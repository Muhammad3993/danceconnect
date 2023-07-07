import axios from 'axios';
import {
  LOGOUT,
  REGISTRATION_WITH_EMAIL,
} from '../store/actionTypes/authorizationActionTypes';

const apiUrl = 'http://localhost:3000';
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
export const isUserExist = (email: string) => {
  axios
    .get(`${apiUrl}/userExist/${email}`)
    .then(result => result)
    .catch(er => console.log('error userexist', er));
};
export const login = async (email: string, password: string) => {
  try {
    const data_auth = {
      email: email,
      password: password,
    };
    const response = await axios.post(`${apiUrl}/auth/`, {
      data_auth: data_auth,
    });
    console.log('login', response);
    return response;
  } catch (er) {
    return console.log('er', er);
  }
};
export const createUser = async (data: user) => {
  try {
    const response = await axios.post(`${apiUrl}/users/`, {data: data});
    console.log('createUser', response);
    // const {email, password} = data;
    // login(email, password).then();
    return response;
  } catch (er) {
    return console.log('er', er);
  }
};

export const userExists = async (uid: string) => {
  try {
    const response = await axios.get(`${apiUrl}/users/${uid}`);
    console.log('userExists', response);
    return response?.data?.data;
  } catch (er) {
    return console.log('er', er);
  }
};
export const getCommunitiesWithMongo = async () => {
  try {
    const response = await axios.get(`${apiUrl}/communities/`);
    console.log('getCommunitiesWithMongo', response);
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
    const response = await axios.get(`${apiUrl}/communities/${id}`);
    return response.data;
  } catch (error) {
    return console.log('createCommunityWithMongo er', error);
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
export const createEventWithMongo = async (data: object) => {
  try {
    const response = await axios.post(`${apiUrl}/events`, {data: data});
    return response.data;
  } catch (error) {
    return console.log('createEventWithMongo er', error);
  }
};
export const getEventsWithMongo = async () => {
  try {
    const response = await axios.get(`${apiUrl}/events/`);
    console.log('getEventsWithMongo', response);
    return response?.data?.data;
  } catch (er) {
    return console.log('er', er);
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
