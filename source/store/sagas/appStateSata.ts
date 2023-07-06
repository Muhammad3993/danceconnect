import {call, put, takeLatest} from 'redux-saga/effects';
import {
  setDanceStylesAction,
  setEventTypesAction,
} from '../actions/appStateActions';
import {APP_STATE} from '../actionTypes/appStateActionTypes';
import {getConstants} from '../../api/serverRequests';

function* getDanceStylesRequest() {
  try {
    const response = yield call(getConstants);
    yield put(
      setDanceStylesAction({
        danceStyles: response.data[0].danceStyles[0],
      }),
    );
    yield put(
      setEventTypesAction({
        eventTypes: response.data[0].typesEvents,
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
