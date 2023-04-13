import {call, put, select, takeLatest} from 'redux-saga/effects';

import {
  AUTHORIZATION_WITH_EMAIL,
  LOGOUT,
  REGISTRATION_WITH_EMAIL,
} from '../actionTypes/authorizationActionTypes';
import {
  logInWithEmail,
  logout,
  setInitialDataUser,
  sinUpWithEmail,
} from '../../api/authSocial';
import {
  authorizationWithEmailSuccess,
  logoutFail,
  logoutSuccess,
  registrationWithEmailFail,
  registrationWithEmailSuccess,
  setRegistrationDataFailAction,
  setRegistrationDataSuccessAction,
} from '../actions/authorizationActions';

function* registrationEmail(action: any) {
  try {
    const {email, password} = action?.payload;
    const userCredentials = yield call(sinUpWithEmail, email, password);

    yield put(
      registrationWithEmailSuccess({currentUser: userCredentials._user}),
    );
  } catch (errors: any) {
    console.log('registrationWithEmailFail', errors);
    yield put(registrationWithEmailFail(errors));
  }
}
function* authorizationEmail(action: any) {
  try {
    const {email, password} = action?.payload;
    const userCredentials = yield call(logInWithEmail, email, password);

    yield put(
      authorizationWithEmailSuccess({currentUser: userCredentials._user}),
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
function* registrationSaga() {
  yield takeLatest(REGISTRATION_WITH_EMAIL.REQUEST, registrationEmail);
  yield takeLatest(AUTHORIZATION_WITH_EMAIL.REQUEST, authorizationEmail);
  yield takeLatest(
    REGISTRATION_WITH_EMAIL.SET_DATA_REQUEST,
    registrationSetData,
  );
  yield takeLatest(LOGOUT.REQUEST, logoutUser);
}

export default registrationSaga;
