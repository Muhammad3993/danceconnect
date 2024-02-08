import {COMMUNITIES} from '../actionTypes/communityActionTypes';

export type communityParams = {
  isLoading?: boolean;
  name?: string;
  description?: string;
  country?: string;
  location?: string;
  creatorUid?: string;
  categories?: string[];
  followers?: string[];
  images?: string[];
  errors?: null;
  isCreated?: false;
  dataCommunities?: string[];
  followingCommunities?: string[];
  communityByIdData?: null;
  communityUid?: string;
  managingCommunities?: string[];
  loadingManaging?: boolean;
  screen?: string;
  type: string;
  channelId: string;
};
export type followingParams = {
  isLoadingFollow?: boolean;
  communityUid: string;
  channelId: string;
  userUid?: string;
  userImg?: string;
};
export const getCommunitiesRequestAction = () => ({
  type: COMMUNITIES.GET_DATA_REQUEST,
});
export const getCommunitiesSuccessAction = ({
  dataCommunities,
}: communityParams) => ({
  type: COMMUNITIES.GET_DATA_SUCCESS,
  payload: {
    dataCommunities: dataCommunities,
  },
});

export const getManagingCommunitiesFailAction = () => ({
  type: COMMUNITIES.GET_MANAGING_COMMUNITIES_FAIL,
});
export const getManagingCommunitiesRequestAction = () => ({
  type: COMMUNITIES.GET_MANAGING_COMMUNITIES_REQUEST,
});
export const getManagingCommunitiesSuccessAction = ({
  managingCommunities,
}: communityParams) => ({
  type: COMMUNITIES.GET_MANAGING_COMMUNITIES_SUCCESS,
  payload: {
    managingCommunities: managingCommunities,
  },
});

export const getCommunitiesFailAction = ({errors}: communityParams) => ({
  type: COMMUNITIES.GET_DATA_FAIL,
  payload: errors,
});

export const createCommunityRequestAction = ({
  name,
  description,
  // country,
  location,
  creatorUid,
  categories,
  images,
  type,
}: communityParams) => ({
  type: COMMUNITIES.CREATE_REQUEST,
  payload: {
    name: name,
    description: description,
    // country: country,
    location: location,
    creatorUid: creatorUid,
    categories: categories,
    images: images,
    type: type,
  },
});

export const createCommunitySuccessAction = () => ({
  type: COMMUNITIES.CREATE_SUCCESS,
});

export const createCommunityFailAction = ({errors}: communityParams) => ({
  type: COMMUNITIES.CREATE_FAIL,
  payload: errors,
});

export const startFollowedCommunityRequestAction = ({
  communityUid,
  channelId,
}: followingParams) => ({
  type: COMMUNITIES.START_FOLLOWING_REQUEST,
  payload: {communityUid, channelId},
});
export const startFollowedCommunitySuccessAction = () => ({
  type: COMMUNITIES.START_FOLLOWING_SUCCESS,
});
export const startFollowedCommunityFailAction = () => ({
  type: COMMUNITIES.START_FOLLOWING_FAIL,
});
export const cancelFollowedCommunityRequestAction = ({
  communityUid,
  channelId,
}: communityParams) => ({
  type: COMMUNITIES.CANCEL_FOLLOWING_REQUEST,
  payload: {communityUid, channelId},
});

export const cancelFollowedCommunitySuccessAction = () => ({
  type: COMMUNITIES.CANCEL_FOLLOWING_SUCCESS,
});
export const cancelFollowedCommunityFailAction = () => ({
  type: COMMUNITIES.CANCEL_FOLLOWING_FAIL,
});

export const clearCommunititesData = () => ({
  type: COMMUNITIES.CLEAR_DATA,
});
export const getCommunityByIdRequestAction = ({
  communityUid,
}: communityParams) => ({
  type: COMMUNITIES.GET_COMMUNITY_BY_ID_REQUEST,
  payload: {
    communityUid: communityUid,
  },
});
export const getCommunityByIdSuccessAction = ({
  communityByIdData,
}: communityParams) => ({
  type: COMMUNITIES.GET_COMMUNITY_BY_ID_SUCCESS,
  payload: {
    communityByIdData: communityByIdData,
  },
});
export const getCommunityByIdFailAction = ({error}: any) => ({
  type: COMMUNITIES.GET_COMMUNITY_BY_ID_FAIL,
  payload: {
    error: error,
  },
});

export const getCommunityByIdClearAction = () => ({
  type: COMMUNITIES.GET_COMMUNITY_BY_ID_CLEAR,
});
export const changeInformationCommunityRequestAction = ({
  name,
  description,
  // country,
  location,
  communityUid,
  categories,
  followers,
  images,
  type,
  channelId,
}: communityParams) => ({
  type: COMMUNITIES.CHANGE_INFORMATION_COMMUNITY_REQUEST,
  payload: {
    name,
    description,
    channelId,
    // country: country,
    location,
    communityUid,
    followers,
    categories,
    images,
    type,
  },
});
export const changeInformationCommunitySuccessAction = () => ({
  type: COMMUNITIES.CHANGE_INFORMATION_COMMUNITY_SUCCESS,
});

export const changeInformationCommunityFailAction = () => ({
  type: COMMUNITIES.CHANGE_INFORMATION_COMMUNITY_FAIL,
});

export const changeInformationValueAction = () => ({
  type: COMMUNITIES.CHANGE_INFORMATION_VALUE,
});

export const removeCommunityRequestAction = ({
  communityUid,
  screen,
  channelId,
}: communityParams) => ({
  type: COMMUNITIES.REMOVE_COMMUNITY_REQUEST,
  payload: {uid: communityUid, screen, channelId},
});
export const removeCommunitySuccessAction = () => ({
  type: COMMUNITIES.REMOVE_COMMUNITY_SUCCESS,
});
export const removeCommunityFailAction = () => ({
  type: COMMUNITIES.REMOVE_COMMUNITY_FAIL,
});

export const getCommunitiesByUserIdRequestAction = (user_id: string) => ({
  type: COMMUNITIES.GET_COMMUNITIES_BY_USER_ID_REQUEST,
  payload: {
    user_id: user_id,
  },
});
export const getCommunitiesByUserIdSuccessAction = (
  communities_by_user_id: string[],
) => ({
  type: COMMUNITIES.GET_COMMUNITIES_BY_USER_ID_SUCCESS,
  payload: {
    communities_by_user_id: communities_by_user_id,
  },
});

export const getCommunitiesByUserIdFailAction = () => ({
  type: COMMUNITIES.GET_COMMUNITIES_BY_USER_ID_FAIL,
});
