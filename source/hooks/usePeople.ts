import {useDispatch, useSelector} from 'react-redux';
import {
  selectDifferentUser,
  selectLoadingDifferentUser,
  selectLoadingUsersList,
  selectUsersList,
} from '../store/selectors/peopleSelector';
import {
  getDifferentUserRequestAction,
  getUsersListRequestAction,
} from '../store/actions/peopleActions';
import {getEventsByUserIdRequestAction} from '../store/actions/eventActions';
import {selectEventByUserId} from '../store/selectors/eventsSelector';
import {selectCommunitiesByUserId} from '../store/selectors/communitiesSelector';
import {getCommunitiesByUserIdRequestAction} from '../store/actions/communityActions';

const usePeople = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsersList);
  const differentUser = useSelector(selectDifferentUser);
  const isLoadingUsers = useSelector(selectLoadingUsersList);
  const isLoadingUser = useSelector(selectLoadingDifferentUser);
  const eventsByUser = useSelector(selectEventByUserId);
  const communitiesByUser = useSelector(selectCommunitiesByUserId);

  const getDifferentUser = (id: string) => {
    dispatch(getDifferentUserRequestAction(id));
  };
  const getUsers = () => {
    dispatch(getUsersListRequestAction());
  };

  const getEventsByUserId = (id: string) => {
    dispatch(getEventsByUserIdRequestAction(id));
  };
  const getCommunitiesByUserId = (id: string) => {
    dispatch(getCommunitiesByUserIdRequestAction(id));
  };

  return {
    users,
    differentUser,
    getUsers,
    getDifferentUser,
    isLoadingUsers,
    isLoadingUser,
    getEventsByUserId,
    eventsByUser,
    getCommunitiesByUserId,
    communitiesByUser,
  };
};
export default usePeople;
