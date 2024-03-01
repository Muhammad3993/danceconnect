import {API_REGIONS, Client, enableCache} from '@amityco/ts-sdk';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import SplashScreen from 'react-native-splash-screen';
import {call, put, select, takeLatest} from 'redux-saga/effects';
import {initializeFB} from '../../api/authSocial';
import {AMITY_API_KEY} from '../../utils/constants';
import {selectUser} from '../selectors/registrationSelector';
import {BOOTSRAP_STATE} from '../actionTypes/boostrapActionTypes';
import {
  appInitFailureAction,
  appInitSuccessAction,
} from '../actions/bootstrapAction';

export const amitySessionHandler: Amity.SessionHandler = {
  sessionWillRenewAccessToken(renewal) {
    renewal.renew();
  },
};

function* init() {
  try {
    yield call(initializeFB);

    yield call(GoogleSignin.configure, {
      scopes: ['email'],
      webClientId:
        '510785169210-lf70g9qu4i2htf64g20emmqs2elosoal.apps.googleusercontent.com',
      offlineAccess: true,
    });

    yield call(Client.createClient, AMITY_API_KEY, API_REGIONS.SG);
    yield call(enableCache);

    const user: string = yield select(selectUser);

    if (user) {
      yield call(
        Client.login,
        {userId: user?.id, displayName: user?.userName},
        amitySessionHandler,
      );

      console.log('ActiveUser');
      console.log(Client.getActiveUser());
    }

    yield put(appInitSuccessAction());

    SplashScreen.hide();
  } catch (error) {
    yield put(appInitFailureAction());
    console.log('error init', error);
    yield call(SplashScreen.hide);
  }
}

// getPercentage
function* bootsrapSaga() {
  yield takeLatest(BOOTSRAP_STATE.INIT, init);
}
export default bootsrapSaga;
