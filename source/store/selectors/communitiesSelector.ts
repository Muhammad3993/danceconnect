import {IRootState} from '..';

export const selectCommunities = (state: IRootState) =>
  state.communities?.dataCommunities ?? [];
export const selectLoadingInCreateCommunity = (state: IRootState) =>
  state.communities?.isLoading ?? false;
export const selectIsCreatedCreateCommunity = (state: IRootState) =>
  state.communities?.isCreated ?? false;
export const selectIsLoadingWithFollow = (state: IRootState) =>
  state?.communities?.following?.isLoadingFollow ?? false;

export const selectFollowingCommunities = (state: IRootState) =>
  state?.communities?.followingCommunities ?? [];
