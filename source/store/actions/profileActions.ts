import {PROFILE} from '../actionTypes/profileActionTypes';

type userParams = {
  userData: null | object;
  //   name: string;
  //   location: string;
  //   role: string;
  //   gender: string;
  //   country: string;
  errors?: null;
  userUid?: '';
  userByIdData?: null | object;
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

export const getUserByIdRequestAction = (userUid: string) => ({
  type: PROFILE.GET_USER_BY_ID_REQUEST,
  payload: {
    userUid: userUid,
  },
});

export const getUserByIdSuccessAction = ({userByIdData}: userParams) => ({
  type: PROFILE.GET_USER_BY_ID_SUCCESS,
  payload: {
    userByIdData: userByIdData,
  },
});

export const getUserByIdFailAction = () => ({
  type: PROFILE.GET_USER_BY_ID_FAIL,
});
