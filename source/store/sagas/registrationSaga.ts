import {call, debounce, put, select, takeLatest} from 'redux-saga/effects';

import {
  AUTHORIZATION_WITH_APPLE,
  AUTHORIZATION_WITH_EMAIL,
  AUTHORIZATION_WITH_GOOGLE,
  LOGOUT,
  REGISTRATION_WITH_EMAIL,
} from '../actionTypes/authorizationActionTypes';
import {
  logInWithEmail,
  logout,
  onAppleButtonPress,
  setInitialDataUser,
  signWithGoogle,
  sinUpWithEmail,
} from '../../api/authSocial';
import {
  authWithAppleFail,
  authWithAppleSuccess,
  authWithGoogleFail,
  authWithGoogleSuccess,
  authorizationWithEmailFail,
  authorizationWithEmailSuccess,
  logoutFail,
  logoutSuccess,
  registrationWithEmailFail,
  registrationWithEmailSuccess,
  setRegistrationDataFailAction,
  setRegistrationDataSuccessAction,
} from '../actions/authorizationActions';
import {setErrors} from '../../utils/helpers';
import {
  clearChangePassData,
  clearUserDataInStorage,
  getUserDataRequestAction,
} from '../actions/profileActions';
import {
  clearCommunititesData,
  getCommunitiesRequestAction,
} from '../actions/communityActions';
import {getEventsRequestAction} from '../actions/eventActions';
import {choosedCityAction, setLoadingAction} from '../actions/appStateActions';
import {createUser, login} from '../../api/serverRequests';
import {firebase} from '@react-native-firebase/database';

function* registrationEmail(action: any) {
  try {
    const {email, password} = action?.payload;
    const data = action.payload;
    const response = yield call(createUser, data);
    console.log('registrationEmail', response);
    if (response.status === 200) {
      const auth = yield call(login, email, password);
      yield put(
        registrationWithEmailSuccess({
          currentUser: auth?.data?.user?.user ?? auth?.data?.user,
          isUserExists: true,
          token: auth?.data?.accessToken,
        }),
      );
    }
    // const userCredentials = yield call(sinUpWithEmail, email, password);
    // const {uid} = userCredentials?._user;
    // const exists = yield call(userExists, uid);

    yield put(setLoadingAction({onLoading: false}));
  } catch (error: string | undefined | unknown) {
    console.log('registrationWithEmailFail error', error);
    yield put(setLoadingAction({onLoading: false}));
    yield put(registrationWithEmailFail(setErrors(error?.toString())));
  }
}
function* authorizationEmail(action: any) {
  try {
    const {email, password} = action?.payload;
    const auth = yield call(login, email, password);
    if (auth?.response?.status !== 200) {
      yield put(
        authorizationWithEmailFail(setErrors(auth?.response?.data?.message)),
      );
    }
    if (auth?.status === 200) {
      yield put(
        registrationWithEmailSuccess({
          currentUser: auth?.data?.user,
          isUserExists: true,
          token: auth?.data?.accessToken,
        }),
      );
    }

    // const userCredentials = yield call(logInWithEmail, email, password);
    // const {uid} = userCredentials?._user;
    // yield put(getCommunitiesRequestAction());
    yield put(getEventsRequestAction());
    // const userData = yield call(getUserData, uid);
    // console.log('authorizationEmail', userData);
    // const exists = yield call(userExists, uid);
    // yield put(
    //   authorizationWithEmailSuccess({
    //     currentUser: userCredentials._user,
    //     isUserExists: exists,
    //   }),
    // );
    // yield put(getUserDataRequestAction());
    yield put(getCommunitiesRequestAction());
    yield put(setLoadingAction({onLoading: false}));
  } catch (error: string | undefined | unknown) {
    console.log('authorizationEmail error', error);
    yield put(authorizationWithEmailFail(setErrors(error?.toString())));
    yield put(setLoadingAction({onLoading: false}));
  }
}
function* registrationSetData(action: any) {
  try {
    const {uid, name, gender, country, location, role, individualStyles} =
      action?.payload;
    yield call(setInitialDataUser, {
      uid: uid,
      name: name,
      gender: gender,
      country: country,
      location: location,
      role: role,
      individualStyles: individualStyles,
    });
    // console.log('registrationSetData', response, action.payload);
    yield put(
      setRegistrationDataSuccessAction(
        uid,
        name,
        gender,
        country,
        location,
        role,
        individualStyles,
      ),
    );
    yield put(setLoadingAction({onLoading: false}));
  } catch (error) {
    console.log('registrationSetData error', error);
    yield put(setLoadingAction({onLoading: false}));
    yield put(setRegistrationDataFailAction(error));
  }
}

function* logoutUser() {
  try {
    const user = firebase.auth().currentUser?._user;
    if (user) {
      yield call(logout);
    }
    yield put(logoutSuccess());
    yield put(clearChangePassData({changePasswordSuccess: false}));
    yield put(clearUserDataInStorage());
    yield put(clearCommunititesData());
    yield put(choosedCityAction({currentCity: ''}));
  } catch (error) {
    yield put(logoutFail(error));
  }
}
function* authWthGoogle() {
  try {
    const response = yield call(signWithGoogle);
    console.log('authWthGoogle response', response);
    const {uid} = response?._user;
    const auth = yield call(login, response?._user?.email, uid);
    console.log('authWthGoogle auth', auth);
    // if (auth?.status === 200) {

    // yield put(
    //   registrationWithEmailSuccess({
    //     currentUser: auth?.data?.user,
    //     isUserExists: true,
    //     token: auth?.data?.accessToken,
    //   }),
    // );
    // }
    if (auth?.response?.status === 404 || auth?.response?.status === 400) {
      yield put(
        registrationWithEmailSuccess({
          // currentUser: auth?.data?.user?.user,
          currentUser: {...response._user, _id: response?._user?.uid},
          isUserExists: false,
          // token: auth?.data?.accessToken,
        }),
      );
    }
    if (auth?.status === 200) {
      yield put(
        authWithGoogleSuccess({
          currentUser: {...auth?.data?.user, _id: auth?.data?.id},
          isUserExists: true,
          token: auth?.data?.accessToken,
        }),
      );
    }

    // const exists = yield call(userExists, uid);
    // console.log('authWthGoogle saga', auth, response);

    // yield put(getUserDataRequestAction());
    // yield put(getCommunitiesRequestAction());
    // yield put(getEventsRequestAction());
    // yield put(setLoadingAction({onLoading: false}));
  } catch (error: string | undefined | unknown) {
    console.log('authWthGoogle error', error);

    yield put(authWithGoogleFail(setErrors(error?.toString())));
    yield put(setLoadingAction({onLoading: false}));
  }
}
function* authWthApple() {
  try {
    const response = yield call(onAppleButtonPress);
    console.log('authWthApple saga', response);
    let name = response?.user?.displayName;
    if (response?.user?.displayName === 'null null') {
      name = '';
    }
    const user = {
      uid: response?.user?._user?.uid,
      email: response?.additionalUserInfo?.profile?.email,
      username: name,
    };
    // const {uid} = response?._user;
    const exists = yield call(userExists, response?.user?._user.uid);
    yield put(
      authWithAppleSuccess({
        currentUser: user,
        isUserExists: exists,
      }),
    );
    yield put(getUserDataRequestAction());
    yield put(getCommunitiesRequestAction());
    yield put(getEventsRequestAction());
    yield put(setLoadingAction({onLoading: false}));
  } catch (error: string | undefined | unknown) {
    console.log('authWthApple error', error);
    yield put(authWithAppleFail(setErrors(error?.toString())));
    yield put(setLoadingAction({onLoading: false}));
  }
}
function* registrationSaga() {
  yield takeLatest(REGISTRATION_WITH_EMAIL.REQUEST, registrationEmail);
  yield takeLatest(AUTHORIZATION_WITH_EMAIL.REQUEST, authorizationEmail);
  yield takeLatest(
    REGISTRATION_WITH_EMAIL.SET_DATA_REQUEST,
    registrationSetData,
  );
  yield takeLatest(AUTHORIZATION_WITH_GOOGLE.REQUEST, authWthGoogle);
  yield takeLatest(AUTHORIZATION_WITH_APPLE.REQUEST, authWthApple);
  yield takeLatest(LOGOUT.REQUEST, logoutUser);
}

export default registrationSaga;
