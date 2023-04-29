import {all} from 'redux-saga/effects';
import registrationSaga from './registrationSaga';
import profileSaga from './profileSaga';
import communititesSaga from './communitiesSaga';

export default function* rootSaga() {
  yield all([registrationSaga(), profileSaga(), communititesSaga()]);
}
