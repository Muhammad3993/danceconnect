import {call, debounce, put, select, takeLatest} from 'redux-saga/effects';
import {PROFILE} from '../actionTypes/profileActionTypes';
import {
  getUserByIdFailAction,
  getUserByIdSuccessAction,
  getUserDataFailAction,
  getuserDataSuccessAction,
} from '../actions/profileActions';
import {selectUserUid} from '../selectors/registrationSelector';
import {getUserData, getUserDataById} from '../../api/functions';
import {getCommunitiesRequestAction} from '../actions/communityActions';
import {getEventsRequestAction} from '../actions/eventActions';

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
    yield put(getEventsRequestAction());
  } catch (error: any) {
    yield put(getUserDataFailAction(error));
  }
}
function* getUserByIdRequest(action: any) {
  const {userUid} = action.payload;
  try {
    yield put(
      getUserByIdSuccessAction({
        userByIdData: yield call(getUserDataById, userUid),
      }),
    );
  } catch (error) {
    yield put(getUserByIdFailAction());
  }
}
function* profileSaga() {
  yield takeLatest(PROFILE.GET_DATA_REQUEST, getUserDataRequest);
  yield takeLatest(PROFILE.GET_USER_BY_ID_REQUEST, getUserByIdRequest);
}

export default profileSaga;
