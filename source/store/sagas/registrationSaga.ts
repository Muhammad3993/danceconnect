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
  authorizationWithEmailSuccess,
  logoutFail,
  logoutSuccess,
  registrationWithEmailFail,
  registrationWithEmailSuccess,
  setRegistrationDataFailAction,
  setRegistrationDataSuccessAction,
} from '../actions/authorizationActions';
import {userExists} from '../../api/functions';

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
  } catch (error: any) {
    console.log('registrationWithEmailFail', error);
    //auth/email-already-in-use
    //The email address is already in use by another account.
    if (error.toString()?.includes('auth/email-already-in-use')) {
      yield put(
        registrationWithEmailFail({
          errors: 'The email address is already in use by another account.',
        }),
      );
    } else {
      yield put(registrationWithEmailFail(error));
    }
  }
}
function* authorizationEmail(action: any) {
  try {
    const {email, password} = action?.payload;
    const userCredentials = yield call(logInWithEmail, email, password);
    const {uid} = userCredentials?._user;
    const exists = yield call(userExists, uid);
    yield put(
      authorizationWithEmailSuccess({
        currentUser: userCredentials._user,
        isUserExists: exists,
      }),
    );
  } catch (errors: any) {
    console.log('registrationWithEmailFail', errors);
    yield put(registrationWithEmailFail(errors));
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
  } catch (error) {
    console.log('authWthGoogle error', error);
    yield put(authWithGoogleFail(error));
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
