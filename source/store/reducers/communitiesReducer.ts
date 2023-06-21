import {COMMUNITIES} from '../actionTypes/communityActionTypes';
import {followingParams} from '../actions/communityActions';
import communitiesInitialState from '../initialState/communitiesInitialState';

export type communititesAction = {
  type: string;
  payload?: {
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
    following?: followingParams;
    followingCommunities?: string[];
    communityByIdData?: null;
    isLoadingById?: false;
    communityUid?: string;
    isLoadingChangeInformation?: boolean;
    saveChanges?: boolean;
  };
};

export default (
  state = communitiesInitialState,
  action: communititesAction,
) => {
  switch (action.type) {
    case COMMUNITIES.GET_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
        errors: null,
      };
    case COMMUNITIES.GET_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        dataCommunities: action?.payload?.dataCommunities,
        errors: null,
      };
    case COMMUNITIES.GET_DATA_FAIL:
      return {
        ...state,
        errors: action.payload?.errors,
        isLoading: false,
        dataCommunities: null,
      };
    case COMMUNITIES.CREATE_REQUEST:
      return {
        ...state,
        isLoading: true,
        name: action?.payload?.name,
        description: action?.payload?.description,
        // country: action?.payload?.country,
        location: action?.payload?.location,
        creatorUid: action?.payload?.creatorUid,
        categories: action?.payload?.categories,
        images: action?.payload?.images,
        errors: null,
      };
    case COMMUNITIES.CREATE_SUCCESS:
      return {
        ...state,
        isCreated: true,
        errors: null,
        name: '',
        description: '',
        // country: '',
        location: '',
        creatorUid: '',
        categories: [],
        images: [],
      };
    case COMMUNITIES.CREATE_FAIL:
      return {
        ...state,
        isCreated: false,
        errors: action?.payload?.errors,
      };
    case COMMUNITIES.START_FOLLOWING_REQUEST:
      return {
        ...state,
        following: {
          isLoadingFollow: true,
          userUid: action.payload?.following?.userUid,
          userImg: action.payload?.following?.userImg,
          communityUid: action.payload?.following?.communityUid,
        },
      };
    case COMMUNITIES.START_FOLLOWING_SUCCESS:
      return {
        ...state,
        dataCommunities: state.dataCommunities,
        following: {
          isLoadingFollow: false,
          userUid: '',
          userImg: '',
          communityUid: '',
        },
        followingCommunities: action.payload?.followingCommunities,
      };
    case COMMUNITIES.START_FOLLOWING_FAIL:
      return {
        ...state,
        following: {
          isLoadingFollow: false,
          userUid: '',
          userImg: '',
          communityUid: '',
        },
      };

    case COMMUNITIES.CANCEL_FOLLOWING_REQUEST:
      return {
        ...state,
        following: {
          isLoadingFollow: true,
          userUid: action.payload?.following?.userUid,
          userImg: action.payload?.following?.userImg,
          communityUid: action.payload?.following?.communityUid,
        },
      };
    case COMMUNITIES.CANCEL_FOLLOWING_SUCCESS:
      return {
        ...state,
        following: {
          isLoadingFollow: false,
          userUid: '',
          userImg: '',
          communityUid: '',
        },
      };
    case COMMUNITIES.CANCEL_FOLLOWING_FAIL:
      return {
        ...state,
        following: {
          isLoadingFollow: false,
          userUid: '',
          userImg: '',
          communityUid: '',
        },
      };
    case COMMUNITIES.GET_COMMUNITY_BY_ID_REQUEST:
      return {
        ...state,
        communityByIdData: null,
        isLoadingById: true,
        communityUid: action.payload?.communityUid,
      };
    case COMMUNITIES.GET_COMMUNITY_BY_ID_SUCCESS:
      return {
        ...state,
        isLoadingById: false,
        communityByIdData: action.payload?.communityByIdData,
        communityUid: '',
      };
    case COMMUNITIES.GET_COMMUNITY_BY_ID_FAIL:
      return {
        ...state,
        communityByIdData: null,
        isLoadingById: false,
        communityUid: '',
      };
    case COMMUNITIES.CHANGE_INFORMATION_COMMUNITY_REQUEST:
      return {
        ...state,
        isLoadingChangeInformation: true,
        name: action?.payload?.name,
        description: action?.payload?.description,
        // country: action?.payload?.country,
        location: action?.payload?.location,
        categories: action?.payload?.categories,
        followers: action?.payload?.followers,
        images: action?.payload?.images,
        saveChanges: false,
      };
    case COMMUNITIES.CHANGE_INFORMATION_COMMUNITY_SUCCESS:
      return {
        ...state,
        isLoadingChangeInformation: false,
        saveChanges: true,
      };
    case COMMUNITIES.CHANGE_INFORMATION_COMMUNITY_FAIL:
      return {
        ...state,
        isLoadingChangeInformation: false,
        saveChanges: false,
      };
    case COMMUNITIES.CHANGE_INFORMATION_VALUE:
      return {
        ...state,
        saveChanges: false,
      };
    case COMMUNITIES.CLEAR_DATA:
      return {
        ...state,
        ...communitiesInitialState,
      };
    default:
      return state;
  }
};
