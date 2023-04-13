import {useDispatch, useSelector} from 'react-redux';
import {
  authorizationWithEmailRequest,
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
  selectUserUid,
} from '../store/selectors/registrationSelector';

const useRegistration = () => {
  const dispatch = useDispatch();
  const isAuthorized = useSelector(selectIsAuthorizedRegistration);
  const isLoading = useSelector(selectIsLoadingRegistration);
  const saveEmail = useSelector(selectEmailUser);
  const currentUser = useSelector(selectUser);
  const userUid = useSelector(selectUserUid);
  const isRegistrationsSuccess = useSelector(selectIsSuccessRegistration);

  const registration = (email: string, password: string) => {
    dispatch(registrationWithEmailRequest({email, password}));
  };
  const authorizaton = (email: string, password: string) => {
    dispatch(authorizationWithEmailRequest({email, password}));
  };
  const logout = () => {
    dispatch(logoutRequest());
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
  };
};

export default useRegistration;
