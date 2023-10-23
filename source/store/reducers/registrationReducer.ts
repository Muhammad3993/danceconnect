import {
  AUTHORIZATION_WITH_APPLE,
  AUTHORIZATION_WITH_EMAIL,
  AUTHORIZATION_WITH_GOOGLE,
  CLEAR,
  LOGOUT,
  REGISTRATION_WITH_EMAIL,
} from '../actionTypes/authorizationActionTypes';
import registrationInitialState from '../initialState/registrationInitialState';

export type registrationAction = {
  type: string;
  payload?: {
    email?: string;
    password?: string;
    errors: string | object;
    currentUser?: undefined;
    token?: string;
    name?: string;
    gender: string;
    country?: string;
    location?: string;
    role?: string;
    isRegistrationsSuccess?: boolean;
    isUserExists?: boolean;
    userName?: string;
    userGender?: string;
    userCountry?: string;
    userRole?: string[];
    individualStyles?: string[];
    authProvider?: string;
    userImage?: null;
    customer?: null;
    myCommunities?: [];
    joinedCommunities?: [];
    events?: [];
    goingEvent?: [];
    paidEvents?: [];
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
        userName: action.payload?.userName,
        userGender: action.payload?.userGender,
        userCountry: action.payload?.userCountry,
        userRole: action.payload?.userRole,
        individualStyles: action.payload?.individualStyles,
        userImage: action.payload?.userImage,
        customer: action.payload?.customer,
        myCommunities: action.payload?.myCommunities,
        joinedCommunities: action.payload?.joinedCommunities,
        events: action.payload?.events,
        goingEvent: action.payload?.goingEvent,
        paidEvents: action.payload?.paidEvents,
        isLoading: true,
        isAuthorized: false,
      };
    case REGISTRATION_WITH_EMAIL.SUCCESS:
      return {
        ...state,
        // email: action.payload?.currentUser?.email,
        // password: action.payload?.password,
        isLoading: false,
        isAuthorized: true,
        isRegistrationsSuccess: true,
        currentUser: action.payload?.currentUser,
        isUserExists: action.payload?.isUserExists,
        token: action.payload?.token,
        authProvider: action.payload?.authProvider,
      };
    case REGISTRATION_WITH_EMAIL.FAIL:
      return {
        ...state,
        // email: action.payload?.email,
        // password: '',
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
        name: action.payload?.currentUser?.displayName,
        // password: action.payload?.password,
        isLoading: false,
        isAuthorized: true,
        currentUser: action.payload?.currentUser,
        isUserExists: action.payload?.isUserExists,
        authProvider: action.payload?.authProvider,
        isRegistrationsSuccess: true,
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
        individualStyles: action?.payload?.individualStyles,
      };
    case REGISTRATION_WITH_EMAIL.SET_DATA_SUCCESS:
      return {
        ...state,
        isRegistrationsSuccess: true,
        // isUserExists: action.payload?.isUserExists,
        isAuthorized: true,
        isUserExists: true,
      };
    case REGISTRATION_WITH_EMAIL.SET_DATA_FAIL:
      return {
        ...state,
        isRegistrationsSuccess: false,
      };
    case AUTHORIZATION_WITH_GOOGLE.REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case AUTHORIZATION_WITH_GOOGLE.SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentUser: action.payload?.currentUser,
        email: action?.payload?.currentUser?.email,
        name: action.payload?.currentUser?.displayName,
        isAuthorized: false,
        isUserExists: action.payload?.isUserExists,
        token: action.payload?.token,
        authProvider: action.payload?.authProvider,
        errors: null,
      };
    case AUTHORIZATION_WITH_GOOGLE.FAIL:
      return {
        ...state,
        isLoading: false,
        errors: action.payload?.errors,
      };
    case AUTHORIZATION_WITH_APPLE.REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case AUTHORIZATION_WITH_APPLE.SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentUser: action.payload?.currentUser,
        email: action?.payload?.currentUser?.email,
        name: action.payload?.currentUser?.username,
        isAuthorized: false,
        isUserExists: action.payload?.isUserExists,
        errors: null,
      };
    case AUTHORIZATION_WITH_APPLE.FAIL:
      return {
        ...state,
        isLoading: false,
        errors: action.payload?.errors,
      };
    case LOGOUT.SUCCESS: {
      return {
        ...state,
        isAuthorized: false,
        isUserExists: false,
        ...registrationInitialState,
      };
    }
    case LOGOUT.FAIL: {
      return {
        ...state,
        errors: action?.payload?.errors,
      };
    }
    case CLEAR.ERRORS_REQUEST: {
      return {
        ...state,
        errors: null,
      };
    }
    default:
      return state;
  }
};
