import {useDispatch, useSelector} from 'react-redux';
import {
  selectCommunities,
  selectFollowingCommunities,
  selectIsLoadingWithFollow,
  selectLoadingInCreateCommunity,
} from '../store/selectors/communitiesSelector';
import {
  cancelFollowedCommunityRequestAction,
  communityParams,
  createCommunityRequestAction,
  followingParams,
  getCommunitiesRequestAction,
  startFollowedCommunityRequestAction,
} from '../store/actions/communityActions';
import {createCommunitySuccessAction} from '../store/actions/communityActions';
import {selectUserUid} from '../store/selectors/registrationSelector';

export const useCommunities = () => {
  const dispatch = useDispatch();
  const communitiesData = useSelector(selectCommunities);
  const isLoading = useSelector(selectLoadingInCreateCommunity);
  const isLoadingWithFollow = useSelector(selectIsLoadingWithFollow);
  const followingCommunities = useSelector(selectFollowingCommunities);
  const userId = useSelector(selectUserUid);
  const joinedCommunities =
    communitiesData?.filter(
      (item: any) =>
        item?.followers?.length > 0 &&
        item?.followers?.find((user: any) => user.userUid === userId),
    ) ?? [];

  const create = ({
    name,
    description,
    country,
    location,
    categories,
    images,
  }: communityParams) => {
    dispatch(
      createCommunityRequestAction({
        name,
        description,
        country,
        location,
        categories,
        images,
      }),
    );
    setTimeout(() => {
      dispatch(createCommunitySuccessAction());
    }, 3000);
  };
  const getCommunitites = () => {
    dispatch(getCommunitiesRequestAction());
  };
  const startFollowed = ({communityUid, userUid, userImg}: followingParams) => {
    dispatch(
      startFollowedCommunityRequestAction({
        communityUid: communityUid,
        userUid: userUid,
        userImg: userImg,
      }),
    );
  };
  const cancelFollowed = ({
    communityUid,
    userImg,
    userUid,
  }: followingParams) => {
    dispatch(
      cancelFollowedCommunityRequestAction({communityUid, userUid, userImg}),
    );
  };

  const isFollowedCurrentCommunity = (communityUid: string) => {
    return followingCommunities?.includes(communityUid);
  };

  return {
    communitiesData,
    isLoading,
    create,
    getCommunitites,
    startFollowed,
    cancelFollowed,
    isLoadingWithFollow,
    isFollowedCurrentCommunity,
    joinedCommunities,
    followingCommunities,
  };
};
