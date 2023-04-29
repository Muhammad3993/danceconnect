import {call, debounce, put, select, takeLatest} from 'redux-saga/effects';
import {PROFILE} from '../actionTypes/profileActionTypes';
import {
  getUserDataFailAction,
  getuserDataSuccessAction,
} from '../actions/profileActions';
import {selectUserUid} from '../selectors/registrationSelector';
import {getUserData} from '../../api/functions';
import {getCommunitiesRequestAction} from '../actions/communityActions';

function* getUserDataRequest() {
  try {
    const uid = yield select(selectUserUid);
    const data = yield call(getUserData, uid);

    console.log('getUserDataRequest', data, '\n ------', uid);
    yield put(
      getuserDataSuccessAction({
        userData: data,
      }),
    );
    yield put(getCommunitiesRequestAction());
  } catch (error: any) {
    yield put(getUserDataFailAction(error));
  }
}
function* profileSaga() {
  yield takeLatest(PROFILE.GET_DATA_REQUEST, getUserDataRequest);
}

export default profileSaga;
