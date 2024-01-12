import {call, put, select, takeLatest} from 'redux-saga/effects';
import {DIFFERENT_USER, PEOPLE} from '../actionTypes/peopleActionTypes';
import {
  getDifferentUserFailAction,
  getDifferentUserSuccessAction,
  getUsersListFailAction,
  getUsersListSuccessAction,
} from '../actions/peopleActions';
import {getUserById, getUsersList} from '../../api/serverRequests';
import {selectUserUid} from '../selectors/registrationSelector';
import {selectCurrentCity, selectRegions} from '../selectors/appStateSelector';

type user = {
  id: string;
};
function* getUsersListRequest() {
  try {
    const userUid: string = yield select(selectUserUid);
    const location: string = yield select(selectCurrentCity);
    const regions = yield select(selectRegions);

    const isRegionCountries = regions.find(
      (i: {name: string}) => i.name === location,
    );

    const response: user[] = yield call(
      getUsersList,
      isRegionCountries ? isRegionCountries?.countries : [location],
    );
    const users: user[] = response?.filter(
      (user: {id: string}) => user.id !== userUid,
    );
    yield put(getUsersListSuccessAction(users));
  } catch (error) {
    yield put(getUsersListFailAction());
  }
}
function* getDifferenetUserRequest(action: {payload: {id: string}}) {
  const {id} = action.payload;
  try {
    const user: Response = yield call(getUserById, id);
    yield put(getDifferentUserSuccessAction(user));
  } catch (error) {
    yield put(getDifferentUserFailAction());
  }
}
function* peopleSaga() {
  yield takeLatest(PEOPLE.REQUEST, getUsersListRequest);
  yield takeLatest(DIFFERENT_USER.REQUEST, getDifferenetUserRequest);
}

export default peopleSaga;
