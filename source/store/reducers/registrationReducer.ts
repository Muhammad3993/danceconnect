import {
  AUTHORIZATION_WITH_EMAIL,
  LOGOUT,
  REGISTRATION_WITH_EMAIL,
} from '../actionTypes/authorizationActionTypes';
import registrationInitialState from '../initialState/registrationInitialState';

export type registrationAction = {
  type: string;
  payload?: {
    email: string;
    password: string;
    errors: null;
    currentUser: undefined;
    name?: string;
    gender: string;
    country?: string;
    location?: string;
    role?: string;
    isRegistrationsSuccess: boolean;
  };
};

export default (
  state = registrationInitialState,
  action: registrationAction,
) => {
  switch (action.type) {
    case REGISTRATION_WITH_EMAIL.REQUEST:
      return {
        ...state,
        email: action.payload?.email,
        password: action.payload?.password,
        isLoading: true,
        isAuthorized: false,
      };
    case REGISTRATION_WITH_EMAIL.SUCCESS:
      return {
        ...state,
        email: action.payload?.currentUser?.email,
        // password: action.payload?.password,
        isLoading: false,
        isAuthorized: false,
        currentUser: action.payload?.currentUser,
      };
    case REGISTRATION_WITH_EMAIL.FAIL:
      return {
        ...state,
        email: action.payload?.email,
        password: '',
        errors: action.payload?.errors,
        isLoading: false,
        isAuthorized: false,
      };
    case AUTHORIZATION_WITH_EMAIL.REQUEST:
      return {
        ...state,
        email: action.payload?.email,
        password: action.payload?.password,
        isLoading: true,
        isAuthorized: false,
      };
    case AUTHORIZATION_WITH_EMAIL.SUCCESS:
      return {
        ...state,
        email: action.payload?.currentUser?.email,
        // password: action.payload?.password,
        isLoading: false,
        isAuthorized: true,
        currentUser: action.payload?.currentUser,
      };
    case AUTHORIZATION_WITH_EMAIL.FAIL:
      return {
        ...state,
        email: action.payload?.email,
        password: '',
        errors: action.payload?.errors,
        isLoading: false,
        isAuthorized: false,
      };
    case REGISTRATION_WITH_EMAIL.SET_DATA_REQUEST:
      return {
        ...state,
        name: action?.payload?.name,
        gender: action?.payload?.gender,
        country: action?.payload?.country,
        location: action?.payload?.location,
        role: action?.payload?.role,
      };
    case REGISTRATION_WITH_EMAIL.SET_DATA_SUCCESS:
      return {
        ...state,
        isRegistrationsSuccess: true,
        isAuthorized: true,
      };
    case REGISTRATION_WITH_EMAIL.SET_DATA_FAIL:
      return {
        ...state,
        isRegistrationsSuccess: false,
      };
    case LOGOUT.SUCCESS: {
      return {
        ...state,
        isAuthorized: false,
        ...registrationInitialState,
      };
    }
    case LOGOUT.FAIL: {
      return {
        ...state,
        errors: action?.payload?.errors,
      };
    }
    default:
      return state;
  }
};
