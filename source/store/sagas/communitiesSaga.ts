import {call, debounce, put, select, takeLatest} from 'redux-saga/effects';
import {selectUserUid} from '../selectors/registrationSelector';
import {
  createCommunity,
  getCommunities,
  joinCommunity,
} from '../../api/functions';
import {COMMUNITIES} from '../actionTypes/communityActionTypes';
import {
  cancelFollowedCommunityFailAction,
  cancelFollowedCommunitySuccessAction,
  createCommunityFailAction,
  createCommunitySuccessAction,
  getCommunitiesFailAction,
  getCommunitiesSuccessAction,
  startFollowedCommunityFailAction,
  startFollowedCommunitySuccessAction,
} from '../actions/communityActions';
import {navigationRef} from '../../navigation/types';
import {CommonActions} from '@react-navigation/native';
import {getCommunitiesRequestAction} from '../actions/communityActions';

function* getCommunitiesRequest() {
  try {
    const data = yield call(getCommunities);
    // console.log('getCommunitiesRequest', Object.values(data), data);
    yield put(
      getCommunitiesSuccessAction({
        dataCommunities: Object.values(data),
      }),
    );
    const userUid = yield select(selectUserUid);

    const followingCommunities: string[] =
      Object.values(data)
        .map(item => item)
        ?.filter(
          item =>
            item?.followers?.length > 0 &&
            item?.followers?.find(item => item?.userUid === userUid),
        )
        ?.map(item => item.id) ?? [];

    yield put(
      startFollowedCommunitySuccessAction({
        followingCommunities: followingCommunities,
      }),
    );
  } catch (error: any) {
    yield put(getCommunitiesFailAction(error));
  }
}
function* createCommunityRequest(action: any) {
  const {name, description, country, location, categories, images} =
    action?.payload;
  try {
    const creatorUid = yield select(selectUserUid);
    yield call(
      createCommunity,
      name,
      description,
      country,
      location,
      creatorUid,
      categories,
      images,
    );
    // console.log('createCommunityRequest', response);
    yield put(createCommunitySuccessAction());
    navigationRef.current?.dispatch(
      CommonActions.navigate({
        name: 'CommunitiesMain',
      }),
    );
  } catch (error) {
    console.log('createCommunityRequest error', error);
    yield put(createCommunityFailAction(error));
  }
}

function* startFollowingCommunity(action: any) {
  const {communityUid, userUid, userImg} = action?.payload;
  try {
    yield call(joinCommunity, communityUid, userUid, userImg);
    // yield put(
    //   startFollowedCommunitySuccessAction({
    //     followingCommunities: followingCommunities,
    //   }),
    // );
    // console.log('followingCommunities', followingCommunities);
    yield put(getCommunitiesRequestAction());
  } catch (error) {
    console.log('startFollowingCommunity', error);
    yield put(startFollowedCommunityFailAction());
  }
}
function* cancelFollowingCommunity(action: any) {
  const {communityUid, userUid, userImg} = action?.paylod;
  try {
    yield call(joinCommunity, communityUid, userUid, userImg);
    yield put(cancelFollowedCommunitySuccessAction());
    // yield put(getCommunitiesRequestAction());
  } catch (error) {
    console.log('cancelFollowingCommunity', error);
    yield put(cancelFollowedCommunityFailAction());
  }
}
function* communititesSaga() {
  yield takeLatest(COMMUNITIES.GET_DATA_REQUEST, getCommunitiesRequest);
  yield takeLatest(COMMUNITIES.CREATE_REQUEST, createCommunityRequest);
  yield debounce(2000, COMMUNITIES.CREATE_SUCCESS, getCommunitiesRequest);
  yield takeLatest(
    COMMUNITIES.START_FOLLOWING_REQUEST,
    startFollowingCommunity,
  );
  yield takeLatest(
    COMMUNITIES.CANCEL_FOLLOWING_REQUEST,
    cancelFollowingCommunity,
  );
}

export default communititesSaga;
