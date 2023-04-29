import {COMMUNITIES} from '../actionTypes/communityActionTypes';

export type communityParams = {
  isLoading?: boolean;
  name?: string;
  description?: string;
  country?: string;
  location?: string;
  creatorUid?: string;
  categories?: string[];
  images?: string[];
  errors?: null;
  isCreated?: false;
  dataCommunities?: string[];
  followingCommunities?: string[];
};
export type followingParams = {
  isLoadingFollow?: boolean;
  communityUid: string;
  userUid: string;
  userImg: string;
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

export const getCommunitiesFailAction = ({errors}: communityParams) => ({
  type: COMMUNITIES.GET_DATA_FAIL,
  payload: errors,
});

export const createCommunityRequestAction = ({
  name,
  description,
  country,
  location,
  creatorUid,
  categories,
  images,
}: communityParams) => ({
  type: COMMUNITIES.CREATE_REQUEST,
  payload: {
    name: name,
    description: description,
    country: country,
    location: location,
    creatorUid: creatorUid,
    categories: categories,
    images: images,
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
  userUid,
  userImg,
}: followingParams) => ({
  type: COMMUNITIES.START_FOLLOWING_REQUEST,
  payload: {
    communityUid: communityUid,
    userUid: userUid,
    userImg: userImg,
  },
});
export const startFollowedCommunitySuccessAction = ({
  followingCommunities,
}: communityParams) => ({
  type: COMMUNITIES.START_FOLLOWING_SUCCESS,
  payload: {
    followingCommunities: followingCommunities,
  },
});
export const startFollowedCommunityFailAction = () => ({
  type: COMMUNITIES.START_FOLLOWING_FAIL,
});
export const cancelFollowedCommunityRequestAction = ({
  communityUid,
  userUid,
  userImg,
}: followingParams) => ({
  type: COMMUNITIES.START_FOLLOWING_REQUEST,
  payload: {
    communityUid: communityUid,
    userUid: userUid,
    userImg: userImg,
  },
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
