import {
  all,
  call,
  debounce,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {selectUserUid} from '../selectors/registrationSelector';
import {
  changeInformationEvent,
  createEvent,
  getEventByUid,
  getEvents,
  joinEvent,
} from '../../api/functions';
import {navigationRef} from '../../navigation/types';
import {CommonActions} from '@react-navigation/native';
// import {getCommunitiesRequestAction} from '../actions/communityActions';
import {EVENT} from '../actionTypes/eventActionTypes';
import {
  changeInformationEventFailAction,
  changeInformationEventSuccessAction,
  changeInformationValueAction,
  createEventFailAction,
  createEventSuccessAction,
  endAttendEventFailAction,
  endAttendEventSuccessAction,
  getEventByIdCommunityFailAction,
  getEventByIdCommunitySuccessAction,
  getEventByIdFailAction,
  getEventByIdSuccessAction,
  getEventsFailAction,
  getEventsRequestAction,
  getEventsSuccessAction,
  getManagingEventsFailAction,
  getManagingEventsRequestAction,
  getManagingEventsSuccessAction,
  startAttendEventFailAction,
  startAttendEventSuccessAction,
} from '../actions/eventActions';
import {
  createEventWithMongo,
  getEventById,
  getEventsWithMongo,
  getManagingEventsRequest,
  getUserById,
  subscribeEvent,
  unSubscribeEvent,
  updateEventById,
} from '../../api/serverRequests';
import {setLoadingAction} from '../actions/appStateActions';

function* getEventsRequest() {
  try {
    const data = yield call(getEventsWithMongo);
    // console.log('getCommunitiesRequest', Object.values(data), data);
    yield put(
      getEventsSuccessAction({
        eventsList: data,
      }),
    );
    // const userUid = yield select(selectUserUid);

    // const followingCommunities: string[] =
    //   Object.values(data)
    //     .map(item => item)
    //     ?.filter(
    //       item =>
    //         item?.followers?.length > 0 &&
    //         item?.followers?.find(item => item?.userUid === userUid),
    //     )
    //     ?.map(item => item.id) ?? [];

    // yield put(
    //   startFollowedCommunitySuccessAction({
    //     followingCommunities: followingCommunities,
    //   }),
    // );
  } catch (error: any) {
    yield put(getEventsFailAction());
  }
}

function* getEventForCommunity(action: any) {
  const {eventUid} = action.payload;
  try {
    const requests = eventUid.map((eventId: string) =>
      call(getEventById, eventId),
    );
    const events = yield all(requests);
    yield put(
      getEventByIdCommunitySuccessAction({
        eventsByIdCommunity: events,
      }),
    );
    yield put(getEventsRequestAction());
    // console.log(events);
  } catch (error) {
    yield put(getEventByIdCommunityFailAction());
    console.log(error);
  }
}

function* attendEvent(action: any) {
  const {eventUid} = action?.payload;
  try {
    const response = yield call(subscribeEvent, eventUid);
    yield put(startAttendEventSuccessAction());
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
      getEventByIdSuccessAction({
        eventById: response,
      }),
    );
    // yield put(getEventsRequestAction());
  } catch (error) {
    console.log('startFollowingCommunity', error);
    yield put(startAttendEventFailAction());
  }
}
function* unAttendEvent(action: any) {
  const {eventUid} = action?.payload;
  try {
    const response = yield call(unSubscribeEvent, eventUid);
    yield put(endAttendEventSuccessAction());
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
      getEventByIdSuccessAction({
        eventById: response,
      }),
    );
    // yield put(getEventsRequestAction());
  } catch (error) {
    console.log('startFollowingCommunity', error);
    yield put(endAttendEventFailAction());
  }
}
// function* getEventDateById(action: any) {
//   const {eventUid} = action.payload;

//   try {
//     yield put(
//       getEventByIdCommunitySuccessAction({
//         eventsByIdCommunity: yield call(getEventByUid, eventUid),
//       }),
//     );
//   } catch (error) {
//     yield put(getEventByIdCommunityFailAction());
//   }
// }
function* createEventRequest(action: any) {
  const {
    name,
    description,
    // country,
    location,
    categories,
    images,
    eventDate,
    place,
    typeEvent,
    communityUid,
  } = action?.payload;
  try {
    const data = {
      title: name,
      description: description,
      // country,
      location: location,
      // creatorUid,
      categories: categories,
      images: images,
      eventDate: eventDate,
      place: place,
      typeEvent: typeEvent,
      communityUid: communityUid,
    };
    yield put(setLoadingAction({onLoading: true}));
    const response = yield call(createEventWithMongo, data);
    // console.log('createEventRequest', response);
    yield put(createEventSuccessAction());
    yield put(getEventsRequestAction());
    navigationRef.current?.dispatch(
      CommonActions.navigate({
        name: 'EventScreen',
        params: {
          data: response,
        },
      }),
    );
    yield put(getManagingEventsRequestAction());
    yield put(setLoadingAction({onLoading: false}));
    // yield put(getCommunitiesRequestAction());
  } catch (error) {
    console.log('createCommunityRequest error', error);
    yield put(createEventFailAction());
  }
}

function* changeInformation(action: any) {
  const {
    name,
    description,
    // country,
    location,
    categories,
    images,
    eventDate,
    place,
    typeEvent,
    eventUid,
  } = action.payload;
  try {
    const data = {
      title: name,
      description: description,
      // country,
      location: location,
      categories: categories,
      images: images,
      eventDate: eventDate,
      place: place,
      typeEvent: typeEvent,
    };
    // console.log('updateEventById', eventUid);
    yield call(updateEventById, eventUid, data);
    yield put(changeInformationEventSuccessAction());
    yield put(changeInformationValueAction());
    const response = yield call(getEventById, eventUid);

    navigationRef.current?.dispatch(
      CommonActions.navigate({
        name: 'EventScreen',
        params: {
          data: response,
        },
      }),
    );
  } catch (er) {
    yield put(changeInformationEventFailAction());
  }
}

function* getEventByIdRequest(action: any) {
  const {eventUid} = action?.payload;
  try {
    const response = yield call(getEventById, eventUid);
    // console.log(data.data);
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
      getEventByIdSuccessAction({
        eventById: response,
      }),
    );
  } catch (error) {
    console.log('getEventByIdRequest er', error);
    yield put(getEventByIdFailAction(error));
  }
}

function* getManagingEvents() {
  try {
    const response = yield call(getManagingEventsRequest);
    yield put(
      getManagingEventsSuccessAction({
        managingEvents: Object.values(response?.data),
      }),
    );
  } catch (err) {
    yield put(getManagingEventsFailAction());
    console.log(err);
  }
}
function* eventSaga() {
  yield takeLatest(EVENT.EVENT_CREATE_REQUEST, createEventRequest);
  yield takeLatest(EVENT.GET_EVENTS_REQUEST, getEventsRequest);
  yield takeLatest(EVENT.GET_EVENT_BY_COMMUNITY_REQUEST, getEventForCommunity);
  yield takeLatest(EVENT.START_ATTEND_EVENT_REQUEST, attendEvent);
  yield takeLatest(EVENT.END_ATTEND_EVENT_REQUEST, unAttendEvent);
  yield takeLatest(EVENT.CHANGE_INFORMATION_EVENT_REQUEST, changeInformation);
  yield takeLatest(EVENT.GET_EVENT_BY_ID_REQUEST, getEventByIdRequest);

  yield takeLatest(EVENT.GET_MANAGING_EVENTS_REQUEST, getManagingEvents);
  // yield debounce(1000, AUTHORIZATION_WITH_EMAIL.REQUEST, getEvents);
  // yield debounce(1000, AUTHORIZATION_WITH_GOOGLE.REQUEST, getEvents);
}

export default eventSaga;
