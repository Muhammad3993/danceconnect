import {all} from 'redux-saga/effects';
import registrationSaga from './registrationSaga';
import profileSaga from './profileSaga';
import communititesSaga from './communitiesSaga';
import eventSaga from './eventsSaga';
import appStateSaga from './appStateSata';

export default function* rootSaga() {
  yield all([
    registrationSaga(),
    profileSaga(),
    communititesSaga(),
    eventSaga(),
    appStateSaga(),
  ]);
}
