import {useDispatch, useSelector} from 'react-redux';
import {
  authWithGoogleRequest,
  authorizationWithEmailRequest,
  clearSignErrorRequest,
  logoutRequest,
  registrationWithEmailRequest,
  setRegistrationDataRequestAction,
  setRegistrationDataSuccessAction,
} from '../store/actions/authorizationActions';
import {
  selectEmailUser,
  selectIsAuthorizedRegistration,
  selectIsLoadingRegistration,
  selectIsSuccessRegistration,
  selectUser,
  selectUserName,
  selectUserUid,
  selectorErrors,
} from '../store/selectors/registrationSelector';
import {selectUserExist} from '../store/selectors/registrationSelector';

const useRegistration = () => {
  const dispatch = useDispatch();
  const isAuthorized = useSelector(selectIsAuthorizedRegistration);
  const isLoading = useSelector(selectIsLoadingRegistration);
  const saveEmail = useSelector(selectEmailUser);
  const currentUser = useSelector(selectUser);
  const userUid = useSelector(selectUserUid);
  const isRegistrationsSuccess = useSelector(selectIsSuccessRegistration);
  const userName = useSelector(selectUserName);
  const isUserExists = useSelector(selectUserExist);
  const isErrors = useSelector(selectorErrors);

  const registration = (email: string, password: string) => {
    dispatch(registrationWithEmailRequest({email, password}));
  };
  const authorizaton = (email: string, password: string) => {
    dispatch(authorizationWithEmailRequest({email, password}));
  };
  const logout = () => {
    dispatch(logoutRequest());
  };
  const authorizationWithGoogle = () => {
    dispatch(authWithGoogleRequest());
  };

  const clearErrors = () => {
    dispatch(clearSignErrorRequest());
  };

  const setUserData = (
    name: string,
    gender: string,
    country: string,
    location: string,
    role: string,
  ) => {
    dispatch(
      setRegistrationDataRequestAction({
        uid: userUid,
        name: name,
        gender: gender,
        country: country,
        location: location,
        role: role,
      }),
    );
  };

  return {
    registration,
    isLoading,
    isAuthorized,
    authorizaton,
    saveEmail,
    currentUser,
    userUid,
    isRegistrationsSuccess,
    setUserData,
    logout,
    authorizationWithGoogle,
    userName,
    isUserExists,
    isErrors,
    clearErrors,
  };
};

export default useRegistration;
