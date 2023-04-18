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

    default:
      return state;
  }
};
