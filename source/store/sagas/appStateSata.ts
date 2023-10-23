import {call, put, takeLatest} from 'redux-saga/effects';
import {
  setCountriesAction,
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
        danceStyles: response[0]?.danceStyles ?? [],
      }),
    );
    yield put(
      setEventTypesAction({
        eventTypes: response[0]?.typesEvents ?? [],
      }),
    );
    yield put(
      setCountriesAction({
        countries: response[0]?.countries ?? [],
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
