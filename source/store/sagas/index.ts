import {all} from 'redux-saga/effects';
import registrationSaga from './registrationSaga';

export default function* rootSaga() {
  yield all([registrationSaga()]);
}
