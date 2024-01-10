import {call, put, select, takeLatest, all, debounce} from 'redux-saga/effects';
import {COMMUNITIES} from '../actionTypes/communityActionTypes';
import {
  cancelFollowedCommunityFailAction,
  changeInformationCommunitySuccessAction,
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
  getCommunitiesWithMongoByArray,
  getCommunityById,
  getEventById,
  getEventsWithMongo,
  getManagingCommunity,
  getTickets,
  updateCommunityById,
} from '../../api/serverRequests';

import {selectCurrentCity, selectRegions} from '../selectors/appStateSelector';
import {selectUserUid} from '../selectors/registrationSelector';
import socket from '../../api/sockets';
import {DeviceEventEmitter} from 'react-native';
import {getPersonalEventsSuccessAction} from '../actions/eventActions';
import moment from 'moment';
import {EVENT} from '../actionTypes/eventActionTypes';

function* getCommunitiesRequest() {
  try {
    const location = yield select(selectCurrentCity);
    const regions = yield select(selectRegions);

    const isRegionCountries = regions.find(
      (i: {name: string}) => i.name === location,
    );
    if (isRegionCountries) {
      const communities = yield call(
        getCommunitiesWithMongoByArray,
        isRegionCountries?.countries,
      );
      yield put(
        getCommunitiesSuccessAction({
          dataCommunities: Object.values(communities),
        }),
      );
      yield put(getManagingCommunitiesRequestAction());
    } else {
      const communities = yield call(getCommunitiesWithMongoByArray, [
        location,
      ]);
      yield put(
        getCommunitiesSuccessAction({
          dataCommunities: Object.values(communities),
        }),
      );
      yield put(getManagingCommunitiesRequestAction());
    }
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

    if (!response) {
      yield put(setNoticeVisible({isVisible: true}));
      yield put(
        setNoticeMessage({
          errorMessage: 'Server error',
        }),
      );
    }
    if (response) {
      DeviceEventEmitter.emit('upload_finished', response);
      yield put(createCommunitySuccessAction());
      yield put(getCommunitiesRequestAction());
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
    socket.emit('follow_community', communityUid, userUid);
    yield put(startFollowedCommunitySuccessAction());
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
  } catch (error) {
    console.log('cancelFollowingCommunity', error);
    yield put(cancelFollowedCommunityFailAction());
  }
}
function* getCommunitiesAndEventsAfterSubscribe() {
  const userUid = yield select(selectUserUid);
  const location = yield select(selectCurrentCity);
  const communities = yield call(getCommunitiesWithMongo, location);
  const {eventsList} = yield call(getEventsWithMongo);

  const followingCommunities = communities?.filter(
    (item: {followers: string[]}) =>
      item?.followers &&
      item?.followers?.find(user => user?.userUid === userUid),
  );
  const maybeEventsIds: string[] = followingCommunities
    ?.map((community: {eventsIds: string[]}) => community?.eventsIds)
    ?.flat(1);
  const requests = maybeEventsIds.map((eventId: string) =>
    call(getEventById, eventId),
  );
  const attendPersonalEvents =
    eventsList
      .filter(
        (event: {attendedPeople: string[]; eventDate: {startDate: Date}}) =>
          moment(event.eventDate?.startDate).format('YYYY-MM-DD') >=
            moment(new Date()).format('YYYY-MM-DD') &&
          event?.attendedPeople?.length > 0 &&
          event?.attendedPeople?.find(
            (user: {_id: string}) => user?._id === userUid,
          ),
      )
      .map((item: any) => item) ?? [];
  const events: string[] = yield all(requests);
  const data: string[] = yield all(
    events.map((event: any) =>
      (function* () {
        try {
          const tickets: string[] = yield call(getTickets, event.id);
          const prices = tickets?.map((ticket: any) => ticket?.price);
          const minPriceTickets = Math.min(...prices);
          // const maxPriceTickets = Math.max(...prices)
          const eventData = {
            ...event,
            minPriceTickets:
              minPriceTickets === Infinity ? null : minPriceTickets,
          };
          return eventData;
        } catch (e) {
          return console.log('error', e);
        }
      })(),
    ),
  );
  const ids = data.concat(attendPersonalEvents).map(({id}) => id);
  const filtered = data
    .concat(attendPersonalEvents)
    .filter(({id}, index) => !ids.includes(id, index + 1));
  yield put(
    getPersonalEventsSuccessAction({
      personalEvents: filtered,
    }),
  );
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
      navigationRef.current?.navigate('CommunitiesMain');

      // dispatch(
      //   CommonActions.navigate({
      //     name: 'CommunitiesMain',
      //   }),
      // );
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
    navigationRef.current?.navigate(
      'CommunitiesMain',
      // CommonActions.navigate({
      //   name: 'CommunitiesMain',
      // }),
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
    yield put(setLoadingAction({onLoading: true}));
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
      navigationRef.current?.navigate('CommunityScreen', {data: response});

      // .dispatch(
      //   CommonActions.navigate({
      //     name: 'CommunityScreen',
      //     params: {
      //       data: response,
      //     },
      //   }),
      // );
      yield put(changeInformationCommunitySuccessAction());
      yield put(getCommunitiesRequestAction());
      // yield put(getCommunityByIdRequestAction({communityUid: communityUid}));
      // yield put(changeInformationValueAction());
    }
    yield put(setLoadingAction({onLoading: false}));
  } catch (error) {
    yield put(cancelFollowedCommunityFailAction());
    yield put(setLoadingAction({onLoading: false}));
  }
}

function* removeCommunityRequest(action: any) {
  try {
    yield put(setLoadingAction({onLoading: true}));
    yield call(deleteCommunityById, action?.payload?.uid);
    yield put(removeCommunitySuccessAction());
    yield put(getCommunitiesRequestAction());
    yield put(getManagingCommunitiesRequestAction());
    if (action?.payload?.screen === 'Profile') {
      navigationRef.current?.goBack();
      // navigationRef.current?.dispatch(CommonActions.goBack());
    } else {
      navigationRef.current?.navigate(
        'CommunitiesMain',
        {removedCommunity: true},
        //     ,
        // CommonActions.navigate({
        //   name: 'CommunitiesMain',
        //   params: {
        //     removedCommunity: true,
        //   },
        // }),
      );
      // navigationRef.current?.dispatch(
      //   CommonActions.navigate({
      //     name: 'CommunitiesMain',
      //     params: {
      //       removedCommunity: true,
      //     },
      //   }),
      // );
    }
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
  yield debounce(
    500,
    // COMMUNITIES.GET_DATA_SUCCESS,
    EVENT.GET_MANAGING_EVENTS_SUCCESS,
    getCommunitiesAndEventsAfterSubscribe,
  );
  yield debounce(
    500,
    COMMUNITIES.START_FOLLOWING_SUCCESS,
    getCommunitiesAndEventsAfterSubscribe,
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
