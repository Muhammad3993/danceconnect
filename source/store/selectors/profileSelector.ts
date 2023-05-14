import {IRootState} from '..';

export const selectProfileState = (state: IRootState) => state.profile ?? null;

export const selectUserName = (state: IRootState) =>
  state?.profile?.userData?.name ?? '';

export const selectUserImg = (state: IRootState) =>
  state.registration?.currentUser?.photoURL ?? null;

export const selectUserData = (state: IRootState) =>
  state.profile?.userData ?? null;

export const getUserByIdData = (state: IRootState) =>
  state?.profile?.userByIdData ?? null;
