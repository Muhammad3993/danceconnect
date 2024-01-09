import {useDispatch, useSelector} from 'react-redux';
import {
  selectCommunities,
  selectFollowingCommunities,
  selectIsLoadingWithFollow,
  selectIsSaveChanges,
  selectJoinedCommunities,
  selectLoadingInCreateCommunity,
  selectLoadingManagingCommunities,
  selectManagingCommunities,
} from '../store/selectors/communitiesSelector';
import {
  cancelFollowedCommunityRequestAction,
  communityParams,
  createCommunityRequestAction,
  getCommunitiesRequestAction,
  getCommunitiesSuccessAction,
  getCommunityByIdClearAction,
  getManagingCommunitiesRequestAction,
  startFollowedCommunityRequestAction,
} from '../store/actions/communityActions';
import {createCommunitySuccessAction} from '../store/actions/communityActions';
// import {selectUserUid} from '../store/selectors/registrationSelector';

export const useCommunities = () => {
  const dispatch = useDispatch();
  const communitiesData = useSelector(selectCommunities);
  const isLoading = useSelector(selectLoadingInCreateCommunity);
  const isLoadingWithFollow = useSelector(selectIsLoadingWithFollow);
  const followingCommunities = useSelector(selectFollowingCommunities);
  // const userUid = useSelector(selectUserUid);
  const isSaveChanges = useSelector(selectIsSaveChanges);

  const managingCommunity = useSelector(selectManagingCommunities);
  const isLoadManaging = useSelector(selectLoadingManagingCommunities);
  // const managingCommunity = useSelector(state => {
  //   const initialData = state?.communities?.dataCommunities;
  //   const filter =
  //     initialData?.filter(
  //       (item: any) =>
  //         item?.creator?.uid === userId || item?.creatorUid === userId,
  //     ) ?? [];
  //   return filter;
  // });
  const joinedCommunities = useSelector(selectJoinedCommunities);

  const getManagingCommunities = () => {
    dispatch(getManagingCommunitiesRequestAction());
  };
  const setSocketCommunities = (data: string[]) => {
    dispatch(
      getCommunitiesSuccessAction({dataCommunities: Object.values(data)}),
    );
  };
  const create = ({
    name,
    description,
    // country,
    location,
    categories,
    images,
  }: communityParams) => {
    dispatch(
      createCommunityRequestAction({
        name,
        description,
        // country,
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
  const startFollowed = (communityUid: string) => {
    console.log('startFollowed', communityUid);
    dispatch(
      startFollowedCommunityRequestAction({
        communityUid: communityUid,
      }),
    );
    // dispatch(getCommunityByIdRequestAction({communityUid: communityUid}));
  };
  const cancelFollowed = (communityUid: string) => {
    console.log('cancelFollowed', communityUid);
    dispatch(
      cancelFollowedCommunityRequestAction({communityUid: communityUid}),
    );
  };

  const isFollowedCurrentCommunity = (communityUid: string) => {
    return followingCommunities?.includes(communityUid);
  };

  const onClearCommunityDataById = () => {
    dispatch(getCommunityByIdClearAction());
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
    managingCommunity,
    isSaveChanges,
    isLoadManaging,
    getManagingCommunities,
    setSocketCommunities,
    onClearCommunityDataById,
  };
};
