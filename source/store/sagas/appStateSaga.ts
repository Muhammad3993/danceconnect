import {call, put, take, takeLatest} from 'redux-saga/effects';
import {getConstants, getLanguageSetting, getPercentage, getTypeCommunity, sendNotification} from '../../api/serverRequests';
import {APP_STATE} from '../actionTypes/appStateActionTypes';
import {
  setChangeLanguageAction,
  setCountriesAction,
  setDanceStylesAction,
  setDevelopmentModeAction,
  setEventTypesAction,
  setRegionsAction,
  setStripeKeyAction,
  setTicketPercentAction,
  setTypeCommunityAction,
} from '../actions/appStateActions';
import { logoutRequest } from '../actions/authorizationActions';

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

function* sendNotificationRequest(action: {payload: {data: any}}) {
  const {data} = action.payload;
  try {
    yield call(sendNotification, data);
  } catch (error) {
    console.log('error sendNotificationRequest', error);
  }
}
function* getTypeCommunityRequest() {
  try {
    const response = yield call(getTypeCommunity);
    yield put(setTypeCommunityAction({typeCommunity: response.data}));
  } catch (error) {
    console.log('getTypeCommunity error', error);
  }
}
function* getChangeLanguageRequest() {
  try {
    const response = yield call(getLanguageSetting);
    yield put(setChangeLanguageAction({isChangeLanguage: response.data}));
  } catch (error) {
    console.log('getTypeCommunity error', error);
  }
}
function* changeDevMode() {
  try {
    yield put(logoutRequest());
  } catch (error) {
    console.log(error);
  }
}
// getPercentage
function* appStateSaga() {
  yield takeLatest(APP_STATE.GET_DANCE_STYLES, getDanceStylesRequest);
  yield takeLatest(APP_STATE.GET_STRIPE_KEY, getStripeKeyRequest);
  yield takeLatest(APP_STATE.GET_TICKET_PERCENT, getPricePercentRequest);
  yield takeLatest(APP_STATE.SEND_NOTIFICATION, sendNotificationRequest);
  yield takeLatest(APP_STATE.GET_TYPE_COMMUNITY, getTypeCommunityRequest);
  yield takeLatest(APP_STATE.GET_IS_CHANGE_LANGUAGE, getChangeLanguageRequest);
  yield takeLatest(APP_STATE.SET_DEV_MODE, changeDevMode);
}
export default appStateSaga;
