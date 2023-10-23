import {call, put, takeLatest} from 'redux-saga/effects';

import {
  AUTHORIZATION_WITH_APPLE,
  AUTHORIZATION_WITH_EMAIL,
  AUTHORIZATION_WITH_GOOGLE,
  LOGOUT,
  REGISTRATION_WITH_EMAIL,
} from '../actionTypes/authorizationActionTypes';
import {
  logout,
  onAppleButtonPress,
  setInitialDataUser,
  signWithGoogle,
} from '../../api/authSocial';
import {
  authWithGoogleFail,
  authWithGoogleSuccess,
  authorizationWithEmailFail,
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
import {
  getEventsRequestAction,
  getPersonalEventsRequestAction,
} from '../actions/eventActions';
import {choosedCityAction, setLoadingAction} from '../actions/appStateActions';
import {
  createUser,
  loginByEmail,
  loginBySocial,
} from '../../api/serverRequests';
// import {firebase} from '@react-native-firebase/database';
import {io} from 'socket.io-client';
import {clearPurchasedTicketsValue} from '../actions/ticketActions';
const socket = io('http://localhost:3000', {autoConnect: true});
// socket.connect();

function* registrationEmail(action: any) {
  try {
    const {email, password} = action?.payload;
    const data = action.payload;
    const response = yield call(createUser, data);
    // console.log('registrationEmail', response, data);
    if (!response) {
      yield put(
        registrationWithEmailFail(setErrors('auth/network-request-failed')),
      );
    } else if (response && response?.status === 201) {
      const auth = yield call(loginBySocial, email, password);
      // console.log('loginBySocial', auth);
      yield put(
        registrationWithEmailSuccess({
          currentUser: response?.data,
          isUserExists: true,
          token: auth?.data?.accessToken,
          authProvider: 'email',
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
    const auth = yield call(loginByEmail, email, password);
    if (auth?.status === 200) {
      yield put(
        registrationWithEmailSuccess({
          currentUser: auth?.data?.user,
          isUserExists: true,
          authProvider: 'email',
          token: auth?.data?.accessToken,
        }),
      );
      yield put(getEventsRequestAction({limit: 1, offset: 0}));
      yield put(getPersonalEventsRequestAction());
    }

    if (auth?.response?.status === 401) {
      const message = auth?.response?.data?.message;
      yield put(authorizationWithEmailFail(setErrors(message)));
    }
    yield put(setLoadingAction({onLoading: false}));
  } catch (error: any) {
    console.log('authorizationEmail error', error?.response?.data?.message);
    yield put(
      authorizationWithEmailFail(setErrors(error?.response?.data?.message)),
    );
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
    // console.log('registrationSetData error', error);
    yield put(setLoadingAction({onLoading: false}));
    yield put(setRegistrationDataFailAction(error));
  }
}

function* logoutUser() {
  try {
    // const user = firebase.auth().currentUser?._user;
    // if (user) {
    //   yield call(logout);
    // }
    // logoutApple();
    yield put(logoutSuccess());
    yield put(clearChangePassData({changePasswordSuccess: false}));
    yield put(clearUserDataInStorage());
    yield put(clearCommunititesData());
    yield put(choosedCityAction({currentCity: ''}));
    yield put(clearPurchasedTicketsValue());
  } catch (error) {
    yield put(logoutFail(error));
  }
}
function* authWthGoogle() {
  try {
    const response = yield call(signWithGoogle);
    // console.log('authWthGoogle response', response);
    const auth = yield call(
      loginBySocial,
      response?._user?.email,
      response?._user?.uid,
    );
    console.log('authWthGoogle auth', auth);

    if (auth?.response?.status === 401) {
      yield put(
        registrationWithEmailSuccess({
          // currentUser: auth?.data?.user?.user,
          currentUser: {
            ...response._user,
            _id: response?._user?.uid,
          },
          isUserExists: false,
          // token: auth?.data?.accessToken,
          authProvider: 'google',
        }),
      );
    }
    if (auth?.status === 200) {
      yield put(
        authWithGoogleSuccess({
          currentUser: {
            ...auth?.data?.user,
            _id: auth?.data?.user?._id,
          },
          isUserExists: true,
          token: auth?.data?.accessToken,
          authProvider: 'google',
        }),
      );
      yield put(getEventsRequestAction({limit: 1, offset: 0}));
      yield put(getPersonalEventsRequestAction());
    }
  } catch (error: string | undefined | unknown) {
    // console.log('authWthGoogle error', error);

    yield put(authWithGoogleFail(setErrors(error?.toString())));
    yield put(setLoadingAction({onLoading: false}));
  }
}
function* authWthApple() {
  try {
    const response = yield call(onAppleButtonPress);
    const auth = yield call(loginBySocial, response?.email, response?.uid);
    // console.log('authWthApple auth', auth, email, uid);
    if (auth?.response?.status === 401) {
      yield put(
        registrationWithEmailSuccess({
          // currentUser: auth?.data?.user?.user,
          currentUser: {
            // ...response.user,
            email: response?.email,
            _id: response?.uid,
            userName: response?.userName,
          },
          isUserExists: false,
          // token: auth?.data?.accessToken,
          authProvider: 'apple',
        }),
      );
    }
    if (auth?.status === 200) {
      yield put(
        authWithGoogleSuccess({
          currentUser: {
            ...auth?.data?.user,
            _id: auth?.data?.user?._id,
            id: auth?.data?.user?._id,
          },
          isUserExists: true,
          token: auth?.data?.accessToken,
          authProvider: 'apple',
        }),
      );
      yield put(getEventsRequestAction({limit: 1, offset: 0}));
      yield put(getPersonalEventsRequestAction());
    }

    yield put(getEventsRequestAction({limit: 1, offset: 0}));
    yield put(setLoadingAction({onLoading: false}));
  } catch (error: string | undefined | unknown) {
    // console.log('authWthApple error', error);
    // yield put(authWithAppleFail(setErrors(error?.toString())));
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
