import {
  AUTHORIZATION_WITH_APPLE,
  AUTHORIZATION_WITH_EMAIL,
  AUTHORIZATION_WITH_GOOGLE,
  CLEAR,
  LOGOUT,
  REGISTRATION_WITH_EMAIL,
} from '../actionTypes/authorizationActionTypes';

type registrationParams = {
  email?: string;
  password?: string;
  errors?: string | unknown | undefined | {};
  currentUser?: null;
  token?: string;
  name?: '';
  gender?: '';
  country?: '';
  location?: '';
  role?: '';
  uid?: '';
  isUserExists?: boolean;
  userName?: string;
  userGender?: string;
  userCountry?: string;
  userRole?: string[];
  individualStyles?: string[];
};
export const registrationWithEmailRequest = ({
  email,
  password,
  userName,
  userGender,
  userCountry,
  userRole,
  individualStyles,
}: registrationParams) => ({
  type: REGISTRATION_WITH_EMAIL.REQUEST,
  payload: {
    email: email,
    password: password,
    userName: userName,
    userGender: userGender,
    userCountry: userCountry,
    userRole: userRole,
    individualStyles: individualStyles,
  },
});

export const setRegistrationDataRequestAction = ({
  uid,
  name,
  gender,
  country,
  location,
  role,
  individualStyles,
}: registrationParams) => ({
  type: REGISTRATION_WITH_EMAIL.SET_DATA_REQUEST,
  payload: {
    uid: uid,
    name: name,
    gender: gender,
    country: country,
    location: location,
    role: role,
    individualStyles: individualStyles,
  },
});
export const setRegistrationDataSuccessAction = ({
  uid,
  name,
  gender,
  country,
  location,
  role,
  individualStyles,
}: registrationParams) => ({
  type: REGISTRATION_WITH_EMAIL.SET_DATA_SUCCESS,
  payload: {
    uid: uid,
    name: name,
    gender: gender,
    country: country,
    location: location,
    role: role,
    individualStyles: individualStyles,
  },
});
export const setRegistrationDataFailAction = {
  type: REGISTRATION_WITH_EMAIL.SET_DATA_FAIL,
};
export const registrationWithEmailSuccess = ({
  currentUser,
  isUserExists,
  token,
}: registrationParams) => ({
  type: REGISTRATION_WITH_EMAIL.SUCCESS,
  payload: {
    currentUser: currentUser,
    isUserExists: isUserExists,
    token: token,
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
  isUserExists,
}: registrationParams) => ({
  type: AUTHORIZATION_WITH_EMAIL.SUCCESS,
  payload: {
    currentUser: currentUser,
    isUserExists: isUserExists,
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

export const authWithGoogleRequest = () => ({
  type: AUTHORIZATION_WITH_GOOGLE.REQUEST,
});
export const authWithGoogleSuccess = ({
  currentUser,
  isUserExists,
  token,
}: registrationParams) => ({
  type: AUTHORIZATION_WITH_GOOGLE.SUCCESS,
  payload: {
    currentUser: currentUser,
    isUserExists: isUserExists,
    token: token,
  },
});
export const authWithGoogleFail = (error: registrationParams) => ({
  type: AUTHORIZATION_WITH_GOOGLE.FAIL,
  payload: {
    errors: error,
  },
});

export const authWithAppleRequest = () => ({
  type: AUTHORIZATION_WITH_APPLE.REQUEST,
});
export const authWithAppleSuccess = ({
  currentUser,
  isUserExists,
}: registrationParams) => ({
  type: AUTHORIZATION_WITH_APPLE.SUCCESS,
  payload: {
    currentUser: currentUser,
    isUserExists: isUserExists,
  },
});
export const authWithAppleFail = (error: registrationParams) => ({
  type: AUTHORIZATION_WITH_APPLE.FAIL,
  payload: {
    errors: error,
  },
});

export const clearSignErrorRequest = () => ({
  type: CLEAR.ERRORS_REQUEST,
});
