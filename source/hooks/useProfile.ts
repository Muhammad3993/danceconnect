import {useDispatch, useSelector} from 'react-redux';
import {
  changePasswordErrors,
  getUserByIdData,
  getUserCountry,
  getUserLocation,
  isSuccessResetPassword,
  selectUserData,
  selectUserImg,
  selectUserName,
  userDanceStyles,
} from '../store/selectors/profileSelector';
import {
  changePasswordRequestAction,
  changeUserDanceStylesRequestAction,
  changeUserInformationRequestAction,
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
  const isSuccessChangePassword = useSelector(isSuccessResetPassword);
  const errorsWithChangePassword = useSelector(changePasswordErrors);
  const userCommunities = user?.joinedCommunities;

  const getCurrentUser = () => {
    dispatch(getUserDataRequestAction());
  };
  const getUser = (uid: string) => {
    dispatch(getUserByIdRequestAction(uid));
  };
  const onChange = (name: string, gender: string, profileImg: object) => {
    dispatch(
      changeUserInformationRequestAction({
        name: name,
        gender: gender,
        profileImg: profileImg,
      }),
    );
  };
  const onChangeDanceStyles = (danceStyles: string[]) => {
    dispatch(
      changeUserDanceStylesRequestAction({
        danceStyles: danceStyles,
      }),
    );
  };
  const onChangePassword = (newPassword: string) => {
    dispatch(
      changePasswordRequestAction({
        newPassword: newPassword,
      }),
    );
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
    onChange,
    onChangeDanceStyles,
    isSuccessChangePassword,
    onChangePassword,
    errorsWithChangePassword,
    userCommunities,
  };
};
