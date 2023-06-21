import {useDispatch, useSelector} from 'react-redux';
import {
  getUserByIdData,
  getUserCountry,
  getUserLocation,
  selectUserData,
  selectUserImg,
  selectUserName,
  userDanceStyles,
} from '../store/selectors/profileSelector';
import {
  getUserByIdRequestAction,
  getUserDataRequestAction,
} from '../store/actions/profileActions';

export const useProfile = () => {
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);
  const userImgUrl = useSelector(selectUserImg);
  const user = useSelector(selectUserData);
  const userById = useSelector(getUserByIdData);
  const userCountry = useSelector(getUserCountry);
  const userLocation = useSelector(getUserLocation);
  const individualStyles = useSelector(userDanceStyles);

  const getCurrentUser = () => {
    dispatch(getUserDataRequestAction());
  };
  const getUser = (uid: string) => {
    dispatch(getUserByIdRequestAction(uid));
  };
  return {
    userName,
    userImgUrl,
    user,
    userById,
    getUser,
    userCountry,
    userLocation,
    getCurrentUser,
    individualStyles,
  };
};
