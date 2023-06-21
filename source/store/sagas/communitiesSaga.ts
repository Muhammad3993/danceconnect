import {
  call,
  debounce,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {selectUserUid} from '../selectors/registrationSelector';
import {
  changeInformationCommunity,
  createCommunity,
  getCommunities,
  getCommunityByUid,
  joinCommunity,
  removeCommunity,
} from '../../api/functions';
import {COMMUNITIES} from '../actionTypes/communityActionTypes';
import {
  cancelFollowedCommunityFailAction,
  cancelFollowedCommunitySuccessAction,
  changeInformationCommunitySuccessAction,
  changeInformationValueAction,
  createCommunityFailAction,
  createCommunitySuccessAction,
  getCommunitiesFailAction,
  getCommunitiesSuccessAction,
  getCommunityByIdFailAction,
  getCommunityByIdSuccessAction,
  removeCommunityFailAction,
  removeCommunitySuccessAction,
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
      // country,
      location,
      creatorUid,
      categories,
      images,
    );
    yield put(createCommunitySuccessAction());
    setTimeout(() => {
      navigationRef.current?.dispatch(
        CommonActions.navigate({
          name: 'CommunitiesMain',
          params: {
            createdCommunity: true,
          },
        }),
      );
    }, 500);

    yield put(getCommunitiesRequestAction());
  } catch (error) {
    console.log('createCommunityRequest error', error);
    yield put(createCommunityFailAction(error));
  }
}

function* startFollowingCommunity(action: any) {
  const {communityUid, userUid, userImg} = action?.payload;
  try {
    yield call(joinCommunity, communityUid, userUid, userImg);
    yield put(getCommunitiesRequestAction());
    // yield put(getCommunityByIdRequestAction(communityUid));
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
  } catch (error) {
    console.log('cancelFollowingCommunity', error);
    yield put(cancelFollowedCommunityFailAction());
  }
}

function* getCommunityByIdRequest(action: any) {
  const {communityUid} = action?.payload;
  try {
    yield put(
      getCommunityByIdSuccessAction({
        communityByIdData: yield call(getCommunityByUid, communityUid),
      }),
    );
  } catch (error) {
    console.log('er', error);
    yield put(getCommunityByIdFailAction(error));
  }
}
function* changeInformation(action: any) {
  const {
    name,
    description,
    // country,
    location,
    communityUid,
    categories,
    images,
    followers,
  } = action?.payload;
  try {
    yield call(
      changeInformationCommunity,
      name,
      description,
      // country,
      location,
      communityUid,
      followers,
      categories,
      images,
    );
    // console.log('changeInformation', action.payload);
    yield put(changeInformationCommunitySuccessAction());
    yield put(getCommunitiesRequestAction());
    // yield put(getCommunityByIdRequestAction({communityUid: communityUid}));
    yield put(changeInformationValueAction());
  } catch (error) {
    yield put(cancelFollowedCommunityFailAction());
  }
}

function* removeCommunityRequest(action: any) {
  try {
    yield call(removeCommunity, action?.payload?.uid);
    yield put(removeCommunitySuccessAction());
    yield put(getCommunitiesRequestAction());
    setTimeout(() => {
      navigationRef.current?.dispatch(
        CommonActions.navigate({
          name: 'CommunitiesMain',
          params: {
            removedCommunity: true,
          },
        }),
      );
    }, 500);
  } catch (error) {
    yield put(removeCommunityFailAction());
  }
}

function* communititesSaga() {
  yield takeLatest(
    COMMUNITIES.GET_COMMUNITY_BY_ID_REQUEST,
    getCommunityByIdRequest,
  );
  yield takeLatest(COMMUNITIES.GET_DATA_REQUEST, getCommunitiesRequest);
  yield takeLatest(COMMUNITIES.CREATE_REQUEST, createCommunityRequest);
  // yield debounce(2000, COMMUNITIES.CREATE_SUCCESS, getCommunitiesRequest);
  yield takeLatest(
    COMMUNITIES.START_FOLLOWING_REQUEST,
    startFollowingCommunity,
  );
  yield takeLatest(
    COMMUNITIES.CANCEL_FOLLOWING_REQUEST,
    cancelFollowingCommunity,
  );
  yield takeLatest(
    COMMUNITIES.CHANGE_INFORMATION_COMMUNITY_REQUEST,
    changeInformation,
  );
  yield takeLatest(
    COMMUNITIES.REMOVE_COMMUNITY_REQUEST,
    removeCommunityRequest,
  );
}

export default communititesSaga;
