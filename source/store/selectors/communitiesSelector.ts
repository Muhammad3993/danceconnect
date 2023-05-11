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
export const selectCommunityById = (state: IRootState) =>
  state?.communities?.communityByIdData ?? null;
export const selectLoadingInCommunityById = (state: IRootState) =>
  state?.communities?.isLoadingById ?? false;
export const selectLoadingChangeInformationCommunity = (state: IRootState) =>
  state?.communities?.isLoadingChangeInformation ?? false;
export const selectIsSaveChanges = (state: IRootState) =>
  state?.communities?.saveChanges ?? false;
