import {IRootState} from '..';

export const selectUsersList = (state: IRootState) => state.people?.users ?? [];
export const selectDifferentUser = (state: IRootState) =>
  state.people?.different_user ?? [];

export const selectLoadingDifferentUser = (state: IRootState) =>
  state.people?.loadingDifferentUser ?? false;

export const selectLoadingUsersList = (state: IRootState) =>
  state.people?.loadingUsers ?? false;
