import {call, put, select, takeLatest} from 'redux-saga/effects';

import {
  AUTHORIZATION_WITH_EMAIL,
  AUTHORIZATION_WITH_GOOGLE,
  LOGOUT,
  REGISTRATION_WITH_EMAIL,
} from '../actionTypes/authorizationActionTypes';
import {
  logInWithEmail,
  logout,
  setInitialDataUser,
  signWithGoogle,
  sinUpWithEmail,
} from '../../api/authSocial';
import {
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
import {getUserData, userExists} from '../../api/functions';
import {setErrors} from '../../utils/helpers';
import { clearUserDataInStorage, getUserDataRequestAction } from '../actions/profileActions';
import { clearCommunititesData } from '../actions/communityActions';

function* registrationEmail(action: any) {
  try {
    const {email, password} = action?.payload;
    const userCredentials = yield call(sinUpWithEmail, email, password);
    const {uid} = userCredentials?._user;
    const exists = yield call(userExists, uid);

    yield put(
      registrationWithEmailSuccess({
        currentUser: userCredentials._user,
        isUserExists: exists,
      }),
    );
  } catch (error: string | undefined | unknown) {
    console.log('registrationWithEmailFail error', error);
    yield put(registrationWithEmailFail(setErrors(error?.toString())));
  }
}
function* authorizationEmail(action: any) {
  try {
    const {email, password} = action?.payload;
    const userCredentials = yield call(logInWithEmail, email, password);
    const {uid} = userCredentials?._user;
    // const userData = yield call(getUserData, uid);
    // console.log('authorizationEmail', userData);
    const exists = yield call(userExists, uid);
    yield put(
      authorizationWithEmailSuccess({
        currentUser: userCredentials._user,
        isUserExists: exists,
      }),
    );
    yield put(getUserDataRequestAction());
  } catch (error: string | undefined | unknown) {
    console.log('authorizationEmail error', error);
    yield put(authorizationWithEmailFail(setErrors(error?.toString())));
  }
}
function* registrationSetData(action: any) {
  try {
    const {uid, name, gender, country, location, role} = action?.payload;
    const response = yield call(
      setInitialDataUser,
      uid,
      name,
      gender,
      country,
      location,
      role,
    );
    console.log('registrationSetData', response, action.payload);
    yield put(
      setRegistrationDataSuccessAction(
        uid,
        name,
        gender,
        country,
        location,
        role,
      ),
    );
  } catch (error) {
    console.log('registrationSetData error', error);
    yield put(setRegistrationDataFailAction(error));
  }
}

function* logoutUser() {
  try {
    yield call(logout);
    yield put(logoutSuccess());
    yield put(clearUserDataInStorage());
    yield put(clearCommunititesData());
  } catch (error) {
    yield put(logoutFail(error));
  }
}
function* authWthGoogle() {
  try {
    const response = yield call(signWithGoogle);
    console.log('authWthGoogle saga', response._user);
    const {uid} = response?._user;
    const exists = yield call(userExists, uid);
    yield put(
      authWithGoogleSuccess({
        currentUser: response._user,
        isUserExists: exists,
      }),
    );
    yield put(getUserDataRequestAction());
  } catch (error: string | undefined | unknown) {
    console.log('authWthGoogle error', error);
    yield put(authWithGoogleFail(setErrors(error?.toString())));
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
  yield takeLatest(LOGOUT.REQUEST, logoutUser);
}

export default registrationSaga;
