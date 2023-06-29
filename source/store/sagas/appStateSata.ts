import {call, put, takeLatest} from 'redux-saga/effects';
import {getConstantsFromFirebase} from '../../api/functions';
import {
  setDanceStylesAction,
  setEventTypesAction,
} from '../actions/appStateActions';
import {APP_STATE} from '../actionTypes/appStateActionTypes';

function* getDanceStylesRequest() {
  try {
    const data = yield call(getConstantsFromFirebase);
    yield put(
      setDanceStylesAction({
        danceStyles: data.danceStyles,
      }),
    );
    yield put(
      setEventTypesAction({
        eventTypes: data.typesEvents,
      }),
    );
  } catch (error) {
    console.log('error dance styles', error);
  }
}
function* appStateSaga() {
  yield takeLatest(APP_STATE.GET_DANCE_STYLES, getDanceStylesRequest);
}
export default appStateSaga;
