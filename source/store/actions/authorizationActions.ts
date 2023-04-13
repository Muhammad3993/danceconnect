import {
  AUTHORIZATION_WITH_EMAIL,
  LOGOUT,
  REGISTRATION_WITH_EMAIL,
} from '../actionTypes/authorizationActionTypes';

type registrationParams = {
  email: string;
  password: string;
  error?: null;
  currentUser?: null;
  name?: '';
  gender: '';
  country?: '';
  location?: '';
  role?: '';
  uid: '';
};
export const registrationWithEmailRequest = ({
  email,
  password,
}: registrationParams) => ({
  type: REGISTRATION_WITH_EMAIL.REQUEST,
  payload: {
    email: email,
    password: password,
  },
});

export const setRegistrationDataRequestAction = ({
  uid,
  name,
  gender,
  country,
  location,
  role,
}: registrationParams) => ({
  type: REGISTRATION_WITH_EMAIL.SET_DATA_REQUEST,
  payload: {
    uid: uid,
    name: name,
    gender: gender,
    country: country,
    location: location,
    role: role,
  },
});
export const setRegistrationDataSuccessAction = ({
  uid,
  name,
  gender,
  country,
  location,
  role,
}: registrationParams) => ({
  type: REGISTRATION_WITH_EMAIL.SET_DATA_SUCCESS,
  payload: {
    uid: uid,
    name: name,
    gender: gender,
    country: country,
    location: location,
    role: role,
  },
});
export const setRegistrationDataFailAction = {
  type: REGISTRATION_WITH_EMAIL.SET_DATA_FAIL,
};
export const registrationWithEmailSuccess = ({
  currentUser,
}: registrationParams) => ({
  type: REGISTRATION_WITH_EMAIL.SUCCESS,
  payload: {
    currentUser,
  },
});
export const registrationWithEmailFail = (error: registrationParams) => ({
  type: REGISTRATION_WITH_EMAIL.FAIL,
  payload: {
    errors: error,
  },
});

export const authorizationWithEmailRequest = ({
  email,
  password,
}: registrationParams) => ({
  type: AUTHORIZATION_WITH_EMAIL.REQUEST,
  payload: {
    email: email,
    password: password,
  },
});
export const authorizationWithEmailSuccess = ({
  currentUser,
}: registrationParams) => ({
  type: AUTHORIZATION_WITH_EMAIL.SUCCESS,
  payload: {
    currentUser: currentUser,
  },
});
export const authorizationWithEmailFail = (error: registrationParams) => ({
  type: AUTHORIZATION_WITH_EMAIL.FAIL,
  payload: {
    errors: error,
  },
});

export const logoutRequest = () => ({
  type: LOGOUT.REQUEST,
});

export const logoutSuccess = () => ({
  type: LOGOUT.SUCCESS,
});

export const logoutFail = (error: registrationParams) => ({
  type: LOGOUT.FAIL,
  payload: {
    errors: error,
  },
});
