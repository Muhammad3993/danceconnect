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
  state.registration?.currentUser?.uid ?? '';
export const selectEmailUser = (state: IRootState) =>
  state.registration?.email ?? '';

export const selectIsSuccessRegistration = (state: IRootState) =>
  state.registration?.isRegistrationsSuccess ?? false;
