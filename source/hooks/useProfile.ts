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
  changeUserCountryRequestAction,
  changeUserDanceStylesRequestAction,
  changeUserInformationRequestAction,
  getUserByIdRequestAction,
  getUserDataRequestAction,
} from '../store/actions/profileActions';
import {selectorSocialProvider} from '../store/selectors/registrationSelector';

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
  const authProdiver = useSelector(selectorSocialProvider);
  const isSocialAuth = authProdiver !== 'email';

  const getCurrentUser = () => {
    dispatch(getUserDataRequestAction());
  };
  const getUser = () => {
    dispatch(getUserByIdRequestAction());
  };
  const onChange = (name: string, gender: string, profileImg: object) => {
    const data = {
      name: name,
      gender: gender,
      profileImg: profileImg ?? null,
    };
    dispatch(changeUserInformationRequestAction(data));
  };
  const onChangeDanceStyles = (danceStyles: string[]) => {
    dispatch(
      changeUserDanceStylesRequestAction({
        danceStyles: danceStyles,
      }),
    );
  };
  const onChangeUserCountry = (country: string) => {
    dispatch(
      changeUserCountryRequestAction({
        userCountry: country,
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
    isSocialAuth,
    onChangeUserCountry,
  };
};
