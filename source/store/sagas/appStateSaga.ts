import {call, put, takeLatest} from 'redux-saga/effects';
import {
  setCountriesAction,
  setDanceStylesAction,
  setEventTypesAction,
  setRegionsAction,
  setStripeKeyAction,
  setTicketPercentAction,
} from '../actions/appStateActions';
import {APP_STATE} from '../actionTypes/appStateActionTypes';
import {getConstants, getPercentage} from '../../api/serverRequests';

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
    yield put(
      setStripeKeyAction({
        stripe_key: response[0].FRONT_STRIPE_KEY,
      }),
    );
    yield put(
      setRegionsAction({
        regions: response[0]?.regions ?? [],
      }),
    );
  } catch (error) {
    console.log('error dance styles', error);
  }
}

function* getStripeKeyRequest() {
  try {
    const response = yield call(getConstants);
    yield put(
      setStripeKeyAction({
        stripe_key: response[0].FRONT_STRIPE_KEY,
      }),
    );
  } catch (error) {
    console.log('error getStripeKeyRequest', error);
  }
}

function* getPricePercentRequest() {
  try {
    const response = yield call(getPercentage);
    yield put(
      setTicketPercentAction({
        ticket_percent: response?.percentage,
        ticket_fix_price: response?.fix,
      }),
    );
  } catch (error) {
    console.log('error getPricePercentRequest', error);
  }
}
// getPercentage
function* appStateSaga() {
  yield takeLatest(APP_STATE.GET_DANCE_STYLES, getDanceStylesRequest);
  yield takeLatest(APP_STATE.GET_STRIPE_KEY, getStripeKeyRequest);
  yield takeLatest(APP_STATE.GET_TICKET_PERCENT, getPricePercentRequest);
}
export default appStateSaga;