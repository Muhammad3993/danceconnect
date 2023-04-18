import {PROFILE} from '../actionTypes/profileActionTypes';

type userParams = {
  userData: null | object;
  //   name: string;
  //   location: string;
  //   role: string;
  //   gender: string;
  //   country: string;
  errors?: null;
};
export const getUserDataRequestAction = () => ({
  type: PROFILE.GET_DATA_REQUEST,
});
export const getuserDataSuccessAction = ({userData}: userParams) => ({
  type: PROFILE.GET_DATA_SUCCESS,
  payload: {
    userData: userData,
  },
});

export const getUserDataFailAction = ({errors}: userParams) => ({
  type: PROFILE.GET_DATA_FAIL,
  payload: errors,
});

export const clearUserDataInStorage = () => ({
  type: PROFILE.CLEAR_USER_DATA,
});
