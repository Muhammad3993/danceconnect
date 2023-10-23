import {call, put, select, takeLatest, all} from 'redux-saga/effects';
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
  startFollowedCommunitySuccessAction,
} from '../actions/communityActions';
import {navigationRef} from '../../navigation/types';
import {CommonActions} from '@react-navigation/native';
import {getCommunitiesRequestAction} from '../actions/communityActions';
import {
  setLoadingAction,
  setNoticeMessage,
  setNoticeVisible,
} from '../actions/appStateActions';
import {
  createCommunityWithMongo,
  deleteCommunityById,
  getCommunitiesWithMongo,
  getCommunityById,
  getManagingCommunity,
  getUsersImagesFromCommunity,
  updateCommunityById,
} from '../../api/serverRequests';

import {selectCurrentCity} from '../selectors/appStateSelector';
// import {io} from 'socket.io-client';
import {selectUser, selectUserUid} from '../selectors/registrationSelector';
import socket from '../../api/sockets';
// const socket = io('http://localhost:3000', {autoConnect: true});
// socket.connect();

function* getCommunitiesRequest() {
  try {
    const location = yield select(selectCurrentCity);
    const communities = yield call(getCommunitiesWithMongo, location);
    // console.log('data', Object.values(communities));
    // const communities = response;
    // const data: string[] = yield all(
    //   communities.map(community =>
    //     (function* () {
    //       try {
    //         const imagesEv: string[] = yield call(
    //           getUsersImagesFromCommunity,
    //           community?.id,
    //         );
    //         const communityata = {
    //           ...community,
    //           userImages: Object.values(imagesEv),
    //         };
    //         return communityata;
    //       } catch (e) {
    //         return console.log('errro', e);
    //       }
    //     })(),
    //   ),
    // );
    yield put(
      getCommunitiesSuccessAction({
        dataCommunities: Object.values(communities),
      }),
    );
    yield put(getManagingCommunitiesRequestAction());
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
    console.log('createCommunityRequest', response);
    if (!response) {
      yield put(setNoticeVisible({isVisible: true}));
      yield put(
        setNoticeMessage({
          errorMessage: 'Server error',
        }),
      );
    } else {
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
      yield put(getManagingCommunitiesRequestAction());
    }

    yield put(setLoadingAction({onLoading: false}));
  } catch (error) {
    console.log('createCommunityRequest error', error);
    yield put(setLoadingAction({onLoading: false}));
    yield put(createCommunityFailAction(error));
  }
}

function* startFollowingCommunity(action: any) {
  const {communityUid} = action?.payload;
  try {
    const userUid: string = yield select(selectUserUid);
    // socket.connect();
    console.log('cosket', socket);
    socket.emit('follow_community', communityUid, userUid);
    // socket.disconnect();
    // yield put(
    //   getCommunitiesSuccessAction({
    //     dataCommunities: Object.values(data),
    //   }),
    // );
    // setTimeout(() => {
    //   socket.disconnect();
    // }, 1000);

    // socket.on('subscribed', ({community}) => {
    //   console.log('socket subscribed', community);
    // });

    // const response = yield call(subscribeCommunity, communityUid);
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
    // yield put(
    //   getCommunityByIdSuccessAction({
    //     communityByIdData: data,
    //   }),
    // );
    yield put(startFollowedCommunitySuccessAction());
    // socket.emit('joined_update', location);

    // yield put(getCommunitiesRequestAction());
    // yield put(getUserDataRequestAction());
    // yield put(getCommunityByIdRequestAction(communityUid));
  } catch (error) {
    console.log('startFollowingCommunity', error);
    yield put(startFollowedCommunityFailAction());
  }
}
function* cancelFollowingCommunity(action: any) {
  const {communityUid} = action?.paylod;
  try {
    const userUid = yield select(selectUserUid);
    // socket.connect();
    socket.emit('follow_community', communityUid, userUid);
    // socket.disconnect();

    // const response = yield call(unSubscribeCommunity, communityUid);
    // console.log('res', response);
    // // const creatorId = response?.creatorUid ?? response?.creator?.uid;
    // // const user = yield call(getUserById, creatorId);

    // // const data = {
    // //   ...response,
    // //   creator: {
    // //     uid: creatorId,
    // //     image: user?.image || user?.userImage,
    // //     name: user?.fullName || user?.userName || user?.name,
    // //   },
    // // };
    // yield put(
    //   getCommunityByIdSuccessAction({
    //     communityByIdData: response,
    //   }),
    // );
    // yield put(getCommunitiesRequestAction());
  } catch (error) {
    console.log('cancelFollowingCommunity', error);
    yield put(cancelFollowedCommunityFailAction());
  }
}

function* getCommunityByIdRequest(action: any) {
  const {communityUid} = action?.payload;
    // console.log('getCommunityByIdRequest', communityUid);
    const {community} = yield call(getCommunityById, communityUid);
    // console.log('getCommunityByIdRequest', community);

    try {
    // console.log('getCommunityByIdRequest', communityUid, community);
    // const response = yield call(getCommunityById, communityUid);
    // console.log('getCommunityById', response[0]);
    // const imagesEv = yield call(getUsersImagesFromCommunity, response.id);
    // const communityata = {
    //   ...response,
    //   userImages: Object.values(imagesEv),
    // };
    yield put(
      getCommunityByIdSuccessAction({
        communityByIdData: community,
      }),
    );
    if (!community) {
      yield put(setNoticeVisible({isVisible: true}));
      yield put(
        setNoticeMessage({
          errorMessage: 'Server error',
        }),
      );
      navigationRef.current?.dispatch(
        CommonActions.navigate({
          name: 'CommunitiesMain',
        }),
      );
    }
    // else {
    //   yield put(setNoticeVisible({isVisible: true}));
    //   yield put(
    //     setNoticeMessage({
    //       errorMessage: 'Server error',
    //     }),
    //   );
    //   navigationRef.current?.dispatch(
    //     CommonActions.navigate({
    //       name: 'CommunitiesMain',
    //     }),
    //   );
    // }
  } catch (error) {
    console.log('er', error);
    yield put(setNoticeVisible({isVisible: true}));
    yield put(
      setNoticeMessage({
        errorMessage: 'Server error',
      }),
    );
    navigationRef.current?.dispatch(
      CommonActions.navigate({
        name: 'CommunitiesMain',
      }),
    );
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
    // yield put(setLoadingAction({onLoading: true}));
    const response = yield call(updateCommunityById, communityUid, data);
    // const response = yield call(getCommunityById, communityUid);
    console.log('changeInformation', response);
    if (!response) {
      yield put(setNoticeVisible({isVisible: true}));
      yield put(
        setNoticeMessage({
          errorMessage: 'Server error',
        }),
      );
    } else {
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
      // yield put(changeInformationValueAction());
    }
    yield put(setLoadingAction({onLoading: false}));
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
        name: 'Communities',
        params: {
          removedCommunity: true,
        },
      }),
    );
    yield put(getManagingCommunitiesRequestAction());
    yield put(setLoadingAction({onLoading: false}));
  } catch (error) {
    yield put(setLoadingAction({onLoading: false}));
    yield put(removeCommunityFailAction());
  }
}
function* getManagingCommunities() {
  try {
    const response = yield call(getManagingCommunity);
    const communities = response;

    yield put(
      getManagingCommunitiesSuccessAction({
        managingCommunities: communities,
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
  // yield takeLatest(COMMUNITIES.GET_DATA_SUCCESS, getManagingCommunities);
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
