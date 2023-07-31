import {call, put, select, takeLatest} from 'redux-saga/effects';
import {COMMUNITIES} from '../actionTypes/communityActionTypes';
import {
  cancelFollowedCommunityFailAction,
  changeInformationCommunitySuccessAction,
  changeInformationValueAction,
  createCommunityFailAction,
  createCommunitySuccessAction,
  getCommunitiesFailAction,
  getCommunitiesSuccessAction,
  getCommunityByIdFailAction,
  getCommunityByIdSuccessAction,
  getManagingCommunitiesFailAction,
  getManagingCommunitiesRequestAction,
  getManagingCommunitiesSuccessAction,
  removeCommunityFailAction,
  removeCommunitySuccessAction,
  startFollowedCommunityFailAction,
} from '../actions/communityActions';
import {navigationRef} from '../../navigation/types';
import {CommonActions} from '@react-navigation/native';
import {getCommunitiesRequestAction} from '../actions/communityActions';
import {setLoadingAction} from '../actions/appStateActions';
import {
  createCommunityWithMongo,
  deleteCommunityById,
  getCommunitiesWithMongo,
  getCommunityById,
  getManagingCommunity,
  getUserById,
  subscribeCommunity,
  unSubscribeCommunity,
  updateCommunityById,
} from '../../api/serverRequests';

import {selectCurrentCity} from '../selectors/appStateSelector';

function* getCommunitiesRequest() {
  try {
    const location = yield select(selectCurrentCity);
    // const data = yield call(getCommunitiesWithMongo, location);

    yield put(
      getCommunitiesSuccessAction({
        dataCommunities: yield call(getCommunitiesWithMongo, location),
      }),
    );
  } catch (error: any) {
    console.log('getCommunitites', error);
    yield put(getCommunitiesFailAction(error));
  }
}
function* createCommunityRequest(action: any) {
  const {name, description, location, categories, images} = action?.payload;
  try {
    // const creatorUid = yield select(selectUserUid);
    yield put(setLoadingAction({onLoading: true}));
    const data = {
      title: name,
      description: description,
      // country,
      location: location,
      // creatorUid,
      categories: categories,
      images: images,
    };
    const response = yield call(createCommunityWithMongo, data);
    // console.log('createCommunityRequest', response);
    yield put(createCommunitySuccessAction());
    yield put(getCommunitiesRequestAction());
    navigationRef.current?.dispatch(
      CommonActions.navigate({
        name: 'CommunityScreen',
        params: {
          data: response,
        },
      }),
    );
    yield put(setLoadingAction({onLoading: false}));
  } catch (error) {
    console.log('createCommunityRequest error', error);
    yield put(createCommunityFailAction(error));
  }
}

function* startFollowingCommunity(action: any) {
  const {communityUid} = action?.payload;
  try {
    const response = yield call(subscribeCommunity, communityUid);
    const creatorId = response?.creatorUid ?? response?.creator?.uid;
    const user = yield call(getUserById, creatorId);

    const data = {
      ...response,
      creator: {
        uid: creatorId,
        image: user?.image || user?.userImage,
        name: user?.fullName || user?.userName || user?.name,
      },
    };
    yield put(
      getCommunityByIdSuccessAction({
        communityByIdData: data,
      }),
    );
    yield put(getCommunitiesRequestAction());
    // yield put(getUserDataRequestAction());
    // yield put(getCommunityByIdRequestAction(communityUid));
  } catch (error) {
    console.log('startFollowingCommunity', error);
    yield put(startFollowedCommunityFailAction());
  }
}
function* cancelFollowingCommunity(action: any) {
  const {communityUid} = action?.paylod;
  console.log('cancelFollowingCommunity', action);
  try {
    const response = yield call(unSubscribeCommunity, communityUid);
    console.log("res", response);
    // const creatorId = response?.creatorUid ?? response?.creator?.uid;
    // const user = yield call(getUserById, creatorId);

    // const data = {
    //   ...response,
    //   creator: {
    //     uid: creatorId,
    //     image: user?.image || user?.userImage,
    //     name: user?.fullName || user?.userName || user?.name,
    //   },
    // };
    yield put(
      getCommunityByIdSuccessAction({
        communityByIdData: response,
      }),
    );
    yield put(getCommunitiesRequestAction());
  } catch (error) {
    console.log('cancelFollowingCommunity', error);
    yield put(cancelFollowedCommunityFailAction());
  }
}

function* getCommunityByIdRequest(action: any) {
  const {communityUid} = action?.payload;
  try {
    // const response = yield call(getCommunityById, communityUid);

    yield put(
      getCommunityByIdSuccessAction({
        communityByIdData: yield call(getCommunityById, communityUid),
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
  const data = {
    title: name,
    description: description,
    // country,
    location: location,
    // communityUid,
    followers: followers,
    categories: categories,
    images: images,
  };
  try {
    yield put(setLoadingAction({onLoading: true}));
    const response = yield call(updateCommunityById, communityUid, data);
    // const response = yield call(getCommunityById, communityUid);
    console.log('changeInformation', response);
    navigationRef.current?.dispatch(
      CommonActions.navigate({
        name: 'CommunityScreen',
        params: {
          data: response,
        },
      }),
    );
    yield put(changeInformationCommunitySuccessAction());
    yield put(getCommunitiesRequestAction());
    // yield put(getCommunityByIdRequestAction({communityUid: communityUid}));
    yield put(setLoadingAction({onLoading: false}));
    yield put(changeInformationValueAction());
  } catch (error) {
    yield put(cancelFollowedCommunityFailAction());
  }
}

function* removeCommunityRequest(action: any) {
  try {
    yield put(setLoadingAction({onLoading: true}));
    yield call(deleteCommunityById, action?.payload?.uid);
    yield put(removeCommunitySuccessAction());
    yield put(getCommunitiesRequestAction());
    yield put(getManagingCommunitiesRequestAction());
    navigationRef.current?.dispatch(
      CommonActions.navigate({
        name: 'CommunitiesMain',
        params: {
          removedCommunity: true,
        },
      }),
    );
    yield put(setLoadingAction({onLoading: false}));
  } catch (error) {
    yield put(setLoadingAction({onLoading: false}));
    yield put(removeCommunityFailAction());
  }
}
function* getManagingCommunities() {
  try {
    const response = yield call(getManagingCommunity);
    yield put(
      getManagingCommunitiesSuccessAction({
        managingCommunities: Object.values(response?.data),
      }),
    );
  } catch (err) {
    yield put(getManagingCommunitiesFailAction());
    console.log(err);
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
  yield takeLatest(
    COMMUNITIES.GET_MANAGING_COMMUNITIES_REQUEST,
    getManagingCommunities,
  );
}

export default communititesSaga;
