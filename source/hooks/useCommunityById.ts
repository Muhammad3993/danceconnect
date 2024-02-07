import {useDispatch, useSelector} from 'react-redux';
import {
  changeInformationCommunityRequestAction,
  communityParams,
  getCommunityByIdRequestAction,
  removeCommunityRequestAction,
} from '../store/actions/communityActions';
import {
  selectCommunityById,
  selectLoadingChangeInformationCommunity,
  selectLoadingInCommunityById,
} from '../store/selectors/communitiesSelector';

export const useCommunityById = (id: string) => {
  const dispatch = useDispatch();
  const communityData = useSelector(selectCommunityById);
  const loadingById = useSelector(selectLoadingInCommunityById);
  const loadingWithChangeInformation = useSelector(
    selectLoadingChangeInformationCommunity,
  );

  const getCommunity = () => {
    dispatch(getCommunityByIdRequestAction({communityUid: id}));
  };
  const changeInformation = ({
    name,
    description,
    country,
    location,
    categories,
    followers,
    images,
    type,
    channelId,
  }: communityParams) => {
    dispatch(
      changeInformationCommunityRequestAction({
        name,
        description,
        country,
        location,
        communityUid: id,
        followers,
        categories,
        images,
        type,
        channelId,
      }),
    );
  };

  const remove = (screen: string) => {
    dispatch(removeCommunityRequestAction({communityUid: id, screen: screen}));
  };

  return {
    getCommunity,
    communityData,
    loadingById,
    loadingWithChangeInformation,
    changeInformation,
    remove,
  };
};
