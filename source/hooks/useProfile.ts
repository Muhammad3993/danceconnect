import {useDispatch, useSelector} from 'react-redux';
import {
  getUserByIdData,
  selectUserData,
  selectUserImg,
  selectUserName,
} from '../store/selectors/profileSelector';
import {getUserByIdRequestAction} from '../store/actions/profileActions';

export const useProfile = () => {
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);
  const userImgUrl = useSelector(selectUserImg);
  const user = useSelector(selectUserData);
  const userById = useSelector(getUserByIdData);

  const getUser = (uid: string) => {
    dispatch(getUserByIdRequestAction(uid));
  };
  return {
    userName,
    userImgUrl,
    user,
    userById,
    getUser,
  };
};
