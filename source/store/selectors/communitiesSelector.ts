import {createSelector} from 'reselect';
import {IRootState} from '..';
import {selectUserUid} from './registrationSelector';
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

export const selectManagingCommunities = (state: IRootState) =>
  state.communities?.managingCommunities ?? [];
export const selectLoadingManagingCommunities = (state: IRootState) =>
  state.communities?.isManagingLoading ?? false;

export const selectJoinedCommunities = createSelector(
  [selectCommunities, selectUserUid],
  (data, userUid) => {
    const communities = data?.dataCommunities ?? [];

    return communities?.filter(
      (item: any) =>
        item?.followers?.length > 0 &&
        item?.followers?.find((user: any) => user.userUid === userUid),
    );
  },
);
