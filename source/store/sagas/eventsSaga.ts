import {
  all,
  call,
  fork,
  put,
  race,
  select,
  takeLatest,
} from 'redux-saga/effects';

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
  removeEventFailAction,
  removeEventSuccessAction,
  startAttendEventFailAction,
  startAttendEventSuccessAction,
} from '../actions/eventActions';
import {
  createEventWithMongo,
  deleteEventById,
  getEventById,
  getEventsWithMongo,
  getManagingEventsRequest,
  getUsersImagesFromEvent,
  unSubscribeEvent,
  updateEventById,
} from '../../api/serverRequests';
import {setLoadingAction} from '../actions/appStateActions';
import {selectUserUid} from '../selectors/registrationSelector';
import socket from '../../api/sockets';
import {selectCurrentCity} from '../selectors/appStateSelector';

function* getEventsRequest(action: {payload: {limit: number; offset: number}}) {
  const {limit, offset} = action.payload;
  try {
    const location: string = yield select(selectCurrentCity);
    // const userImages = yield call(
    //   getUsersImagesFromEvent,
    //   '64e4778b7da3bc0028bc6c6b',
    // );
    // console.log('userImages', userImages);
    const {eventsList} = yield call(getEventsWithMongo);
    // const {eventsList} = yield call(getEventsWithMongo, location);

    // const data: string[] = yield call(getEventsWithMongo);
    // {
    //   eventsList: data,
    //   prevOffset: prevOffset,
    //   prevLimit: prevLimit,
    // }
    // yield put(
    //   getEventsSuccessAction(
    //     yield call(getEventsWithMongo, location, limit, offset),
    //   ),
    // );
    // const eventList: string[] = yield select(getEventsList);
    // const images: string[] = yield eventsList.map(event =>
    //   call(getUsersImagesFromEvent, event?.id),
    // );
    const data: string[] = yield all(
      eventsList.map(event =>
        (function* () {
          try {
            const imagesEv: string[] = yield call(
              getUsersImagesFromEvent,
              event.id,
            );
            const eventData = {
              ...event,
              userImages: Object.values(imagesEv),
            };
            return eventData;
          } catch (e) {
            return console.log('errro', e);
          }
        })(),
      ),
    );
    yield put(getEventsSuccessAction({eventsList: data}));
    // console.log('userImages', data);
  } catch (error: any) {
    console.log('er', error);
    yield put(getEventsFailAction());
  }
}

function* getEventForCommunity(action: any) {
  const {eventUid} = action.payload;

  const requests = eventUid.map((eventId: string) =>
    call(getEventById, eventId),
  );
  try {
    const events: string[] = yield all(requests);
    if (events[0] !== null) {
      yield put(
        getEventByIdCommunitySuccessAction({
          eventsByIdCommunity: events,
        }),
      );
    } else {
      yield put(getEventByIdCommunityFailAction());
    }
    // yield put(getEventsRequestAction({limit: 1, offset: 0}));
  } catch (error) {
    yield put(getEventByIdCommunityFailAction());
    console.log(error);
  }
}

function* attendEvent(action: any) {
  const {eventUid} = action?.payload;
  try {
    // const response = yield call(subscribeEvent, eventUid);
    const userUid: string = yield select(selectUserUid);
    // console.log('attendEvent saga', socket);
    socket.emit('follow_event', eventUid, userUid);
    const response = yield call(getEventById, eventUid);
    const imagesEv = yield call(getUsersImagesFromEvent, response.id);
    const eventData = {
      ...response,
      userImages: Object.values(imagesEv),
    };
    yield put(
      getEventByIdSuccessAction({
        eventById: eventData,
      }),
    );
    // socket.emit('updated_events');
    yield put(startAttendEventSuccessAction());
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
    price,
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
      price: price,
    };
    yield put(setLoadingAction({onLoading: true}));
    const response = yield call(createEventWithMongo, data);
    // console.log('createEventRequest', response);
    yield put(createEventSuccessAction());
    yield put(getEventsRequestAction({limit: 1, offset: 0}));
    navigationRef.current?.dispatch(
      CommonActions.navigate({
        name: 'EventScreen',
        params: {
          data: response,
          createEvent: true,
        },
      }),
    );
    // socket.emit('updated_events');
    yield put(getManagingEventsRequestAction());
    yield put(setLoadingAction({onLoading: false}));
    // yield put(getCommunitiesRequestAction());
  } catch (error) {
    yield put(setLoadingAction({onLoading: false}));
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
    // socket.emit('updated_events');
    yield put(
      getEventByIdSuccessAction({
        eventById: response,
      }),
    );
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
    const imagesEv = yield call(getUsersImagesFromEvent, response.id);
    const eventData = {
      ...response,
      userImages: Object.values(imagesEv),
    };
    yield put(
      getEventByIdSuccessAction({
        eventById: eventData,
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
    const eventsList = Object.values(response?.data);
    const data: string[] = yield all(
      eventsList.map(event =>
        (function* () {
          try {
            const imagesEv = yield call(getUsersImagesFromEvent, event.id);
            const eventData = {
              ...event,
              userImages: Object.values(imagesEv),
            };
            return eventData;
          } catch (e) {
            return console.log('errro', e);
          }
        })(),
      ),
    );
    yield put(
      getManagingEventsSuccessAction({
        managingEvents: data,
      }),
    );
  } catch (err) {
    yield put(getManagingEventsFailAction());
    console.log(err);
  }
}

function* removeEventRquest(action: any) {
  try {
    yield put(setLoadingAction({onLoading: true}));
    yield call(deleteEventById, action?.payload?.uid);
    // socket.emit('updated_events');
    yield put(getEventsRequestAction({limit: 1, offset: 0}));
    yield put(getManagingEventsRequestAction());
    yield put(removeEventSuccessAction());
    navigationRef.current?.dispatch(
      CommonActions.navigate({
        name: 'Events',
      }),
    );
    yield put(setLoadingAction({onLoading: false}));
  } catch (error) {
    yield put(setLoadingAction({onLoading: false}));
    yield put(removeEventFailAction());
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

  yield takeLatest(EVENT.REMOVE_EVENT_REQUEST, removeEventRquest);
  yield takeLatest(EVENT.GET_MANAGING_EVENTS_REQUEST, getManagingEvents);
  yield takeLatest(EVENT.SET_LIMIT, getEventsRequest);
  // yield debounce(1000, AUTHORIZATION_WITH_EMAIL.REQUEST, getEvents);
  // yield debounce(1000, AUTHORIZATION_WITH_GOOGLE.REQUEST, getEvents);
}
export default eventSaga;
