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

const usePeople = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsersList);
  const differentUser = useSelector(selectDifferentUser);
  const isLoadingUsers = useSelector(selectLoadingUsersList);
  const isLoadingUser = useSelector(selectLoadingDifferentUser);

  const getDifferentUser = (id: string) => {
    dispatch(getDifferentUserRequestAction(id));
  };
  const getUsers = () => {
    dispatch(getUsersListRequestAction());
  };

  return {
    users,
    differentUser,
    getUsers,
    getDifferentUser,
    isLoadingUsers,
    isLoadingUser,
  };
};
export default usePeople;
