import {all} from 'redux-saga/effects';
import registrationSaga from './registrationSaga';
import profileSaga from './profileSaga';

export default function* rootSaga() {
  yield all([registrationSaga(), profileSaga()]);
}
