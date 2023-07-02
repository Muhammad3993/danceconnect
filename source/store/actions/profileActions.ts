import {PROFILE} from '../actionTypes/profileActionTypes';

type userParams = {
  userData?: null | object;
  //   name: string;
  //   location: string;
  //   role: string;
  //   gender: string;
  //   country: string;
  errors?: null;
  userUid?: '';
  userByIdData?: null | object;
  name?: string;
  gender?: string;
  profileImg?: object;
  danceStyles?: string[];
  newPassword?: string;
  changePasswordSuccess?: boolean;
  changePasswordErrors?: object | null;
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

export const changeUserInformationRequestAction = ({
  name,
  gender,
  profileImg,
}: userParams) => ({
  type: PROFILE.CHANGE_DATA_REQUEST,
  payload: {
    name: name,
    gender: gender,
    profileImg: profileImg,
  },
});

export const changeUserInformationSuccessAction = () => ({
  type: PROFILE.CHANGE_DATA_SUCCESS,
});
export const changeUserInformationFailAction = () => ({
  type: PROFILE.CHANGE_DATA_FAIL,
});

export const changeUserDanceStylesRequestAction = ({
  danceStyles,
}: userParams) => ({
  type: PROFILE.CHANGE_DANCE_STYLES_REQUEST,
  payload: {
    danceStyles: danceStyles,
  },
});

export const changeUserDanceStylesSuccessAction = () => ({
  type: PROFILE.CHANGE_DANCE_STYLES_SUCCESS,
});
export const changeUserDanceStylesFailAction = () => ({
  type: PROFILE.CHANGE_DANCE_STYLES_FAIL,
});
export const changePasswordRequestAction = ({newPassword}: userParams) => ({
  type: PROFILE.CHANGE_PASSWORD_REQUEST,
  payload: {
    newPassword: newPassword,
  },
});
export const changePasswordSuccessAction = ({
  changePasswordSuccess,
}: userParams) => ({
  type: PROFILE.CHANGE_PASSWORD_SUCCESS,
  payload: {
    changePasswordSuccess: changePasswordSuccess,
  },
});
export const changePasswordFailAction = ({
  changePasswordSuccess,
  changePasswordErrors,
}: userParams) => ({
  type: PROFILE.CHANGE_PASSWORD_FAIL,
  payload: {
    changePasswordSuccess: changePasswordSuccess,
    changePasswordErrors: changePasswordErrors,
  },
});
export const clearChangePassData = ({changePasswordSuccess}: userParams) => ({
  type: PROFILE.CHANGE_PASSWORD_CLEAR,
  payload: {
    changePasswordSuccess: changePasswordSuccess,
  },
});
