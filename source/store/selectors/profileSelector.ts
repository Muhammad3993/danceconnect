import {IRootState} from '..';

export const selectProfileState = (state: IRootState) => state.profile ?? null;

export const selectUserName = (state: IRootState) =>
  state?.profile?.userData?.name ?? state?.registration?.name;

export const selectUserImg = (state: IRootState) =>
  state.profile?.userData?.profileImg ?? null;

export const selectUserData = (state: IRootState) =>
  state.profile?.userData ?? null;

export const getUserByIdData = (state: IRootState) =>
  state?.profile?.userByIdData ?? null;

export const getUserCountry = (state: IRootState) =>
  state?.profile?.userData?.country ?? state?.registration?.country;

export const getUserLocation = (state: IRootState) =>
  state?.profile?.userData?.location ?? state?.registration?.location;

export const userDanceStyles = (state: IRootState) =>
  state?.registration?.individualStyles?.length > 0
    ? state?.registration?.individualStyles
    : state?.profile?.userData?.individualStyles;
export const isSuccessResetPassword = (state: IRootState) =>
  state.profile?.changePasswordSuccess ?? false;
export const changePasswordErrors = (state: IRootState) =>
  state.profile?.changePasswordErrors ?? null;
