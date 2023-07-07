import {IRootState} from '..';

export const selectRegistrationState = (state: IRootState) =>
  state.registration ?? '';
export const selectIsLoadingRegistration = (state: IRootState) =>
  state.registration?.isLoading ?? false;
export const selectIsAuthorizedRegistration = (state: IRootState) =>
  state.registration?.isAuthorized ?? false;
export const selectUser = (state: IRootState) =>
  state.registration?.currentUser ?? null;

export const selectUserUid = (state: IRootState) =>
  state.registration?.currentUser?._id ?? '';
export const selectEmailUser = (state: IRootState) =>
  state.registration?.currentUser?.email ?? '';
  export const selectPasswordUser = (state: IRootState) =>
    state.registration?.password ?? '';

export const selectIsSuccessRegistration = (state: IRootState) =>
  state.registration?.isRegistrationsSuccess ?? false;

export const selectUserName = (state: IRootState) =>
  state.registration?.name ?? '';

export const selectUserExist = (state: IRootState) =>
  state?.registration?.isUserExists ?? false;

export const selectorErrors = (state: IRootState) =>
  state?.registration?.errors ?? null;
