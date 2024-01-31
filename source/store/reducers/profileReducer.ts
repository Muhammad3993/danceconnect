import {PROFILE} from '../actionTypes/profileActionTypes';
import profileInitialState from '../initialState/profileInitialState';

export type profileAction = {
  type: string;
  payload?: {
    userData: null | object;
    // name: string;
    // location: string;
    // role: string;
    // gender: string;
    // country: string;
    errors: null;
    isLoading: false;
    userUid?: '';
    userByIdData?: null;
    name?: string;
    gender?: string;
    profileImg?: object;
    newPassword?: string;
    changePasswordSuccess?: boolean;
    changePasswordErrors?: null;
    fcmToken: string;
  };
};

export default (state = profileInitialState, action: profileAction) => {
  switch (action.type) {
    case PROFILE.GET_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case PROFILE.GET_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userData: action.payload?.userData,
      };
    case PROFILE.GET_DATA_FAIL:
      return {
        ...state,
        errors: action.payload?.errors,
        isLoading: false,
      };
    case PROFILE.CLEAR_USER_DATA:
      return {
        ...state,
        ...profileInitialState,
      };
    case PROFILE.GET_USER_BY_ID_REQUEST:
      return {
        ...state,
        userByIdData: null,
      };
    case PROFILE.GET_USER_BY_ID_SUCCESS:
      return {
        ...state,
        userByIdData: action.payload?.userByIdData,
      };
    case PROFILE.GET_USER_BY_ID_FAIL:
      return {
        ...state,
        userByIdData: null,
      };
    case PROFILE.CHANGE_DATA_REQUEST:
      return {
        ...state,
        name: action.payload?.name,
        gender: action.payload?.gender,
        profileImg: action.payload?.profileImg,
      };
    case PROFILE.CHANGE_DATA_SUCCESS:
      return {
        ...state,
        name: '',
        gender: '',
        profileImg: {},
      };
    case PROFILE.CHANGE_DATA_FAIL:
      return {
        ...state,
        name: '',
        gender: '',
        profileImg: {},
      };
    case PROFILE.CHANGE_PASSWORD_REQUEST:
      return {
        ...state,
        newPassword: action.payload?.newPassword,
        changePasswordErrors: null,
      };
    case PROFILE.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        newPassword: '',
        changePasswordSuccess: action.payload?.changePasswordSuccess,
        changePasswordErrors: null,
      };
    case PROFILE.CHANGE_PASSWORD_FAIL:
      return {
        ...state,
        newPassword: '',
        changePasswordSuccess: action.payload?.changePasswordSuccess,
        changePasswordErrors: action.payload?.changePasswordErrors,
      };
    case PROFILE.SET_FCM_TOKEN:
      return {
        ...state,
        fcmToken: action.payload?.fcmToken,
      };
    default:
      return state;
  }
};
