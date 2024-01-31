import {
  all,
  call,
  debounce,
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
  getEventsByUserIdFailAction,
  getEventsByUserIdSuccessAction,
  getEventsFailAction,
  getEventsRequestAction,
  getEventsSuccessAction,
  getManagingEventsFailAction,
  getManagingEventsRequestAction,
  getManagingEventsSuccessAction,
  getPersonalEventsFailAction,
  getPersonalEventsRequestAction,
  getPersonalEventsSuccessAction,
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
  getTickets,
  getTicketByEventUid,
  unSubscribeEvent,
  updateEventById,
  subscribeEvent,
  getEventsWithMongoByArray,
  getEventForUserId,
} from '../../api/serverRequests';
import {
  setLoadingAction,
  setNoticeMessage,
  setNoticeVisible,
} from '../actions/appStateActions';
import {selectUserUid} from '../selectors/registrationSelector';
import socket from '../../api/sockets';
import {selectCurrentCity, selectRegions} from '../selectors/appStateSelector';
import {selectEventById, selectEventList} from '../selectors/eventsSelector';
import moment, {min} from 'moment';
import {Platform} from 'react-native';

function* getEventsRequest(action: {payload: {limit: number; offset: number}}) {
  const {limit, offset} = action.payload;
  try {
    const location = yield select(selectCurrentCity);
    const regions = yield select(selectRegions);
    const isRegionCountries = regions.find(
      (i: {name: string}) => i.name === location,
    );
    if (isRegionCountries) {
      const {eventsList} = yield call(
        getEventsWithMongoByArray,
        isRegionCountries?.countries,
      );
      const data: string[] = yield all(
        eventsList.map((event: any) =>
          (function* () {
            const tickets: string[] = yield call(getTickets, event.id);
            try {
              const prices = tickets?.map((ticket: any) => ticket?.price);
              const minPriceTickets = Math.min(...prices);
              const maxPriceTickets = Math.max(...prices);
              const eventData = {
                ...event,
                minPriceTickets:
                  minPriceTickets === Infinity
                    ? maxPriceTickets > 0
                      ? 0
                      : null
                    : minPriceTickets,
              };
              return eventData;
            } catch (e) {
              return console.log('error', e);
            }
          })(),
        ),
      );
      yield put(getEventsSuccessAction({eventsList: data}));
    } else {
      const {eventsList} = yield call(getEventsWithMongoByArray, [location]);
      const data: string[] = yield all(
        eventsList.map((event: any) =>
          (function* () {
            const tickets: string[] = yield call(getTickets, event.id);
            try {
              const prices = tickets?.map((ticket: any) => ticket?.price);
              const minPriceTickets = Math.min(...prices);
              const maxPriceTickets = Math.max(...prices);
              const eventData = {
                ...event,
                minPriceTickets:
                  minPriceTickets === Infinity
                    ? maxPriceTickets > 0
                      ? 0
                      : null
                    : minPriceTickets,
              };
              return eventData;
            } catch (e) {
              return console.log('error', e);
            }
          })(),
        ),
      );
      yield put(getEventsSuccessAction({eventsList: data}));
    }

    // console.log('userImages', data);
  } catch (error: any) {
    console.log('er', error);
    yield put(setNoticeVisible({isVisible: true}));
    // yield put(setNoticeMessage({errorMessage: error?.message}));
    // setNoticeMessage
    yield put(getEventsFailAction());
  }
}

function* getEventForCommunity(action: any) {
  const {eventUid} = action.payload;

  const requests = eventUid.map((eventId: string) =>
    call(getEventById, eventId),
  );
  try {
    if (eventUid?.length > 0) {
      const events: string[] = yield all(requests);
      if (events.length) {
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
        yield put(
          getEventByIdCommunitySuccessAction({
            eventsByIdCommunity: data,
          }),
        );
      } else {
        yield put(getEventByIdCommunityFailAction());
      }
    } else {
      yield put(
        getEventByIdCommunitySuccessAction({
          eventsByIdCommunity: [],
        }),
      );
    }

    // yield put(getEventsRequestAction({limit: 1, offset: 0}));
  } catch (error) {
    yield put(setNoticeVisible({isVisible: true}));
    yield put(getEventByIdCommunityFailAction());
    console.log(error);
  }
}

function* attendEvent(action: any) {
  const {eventUid} = action?.payload;
  try {
    yield put(setLoadingAction({onLoading: true}));
    // const response = yield call(getEventById, eventUid);
    const userUid: string = yield select(selectUserUid);
    socket.emit('follow_event', eventUid, userUid);
    // yield put(setLoadingAction({onLoading: false}));
    // const imagesEv = yield call(getUsersImagesFromEvent, response.id);
    // const eventData = {
    //   ...response,
    //   userImages: Object.values(imagesEv),
    // };
    // const isFollowed = response.attendedPeople?.findIndex(
    //   (i: {userUid: string}) => i.userUid === userUid,
    // );
    // yield put(
    //   getEventByIdSuccessAction({
    //     eventById: response,
    //   }),
    // );
    // socket.emit('updated_events');
    yield put(getEventsRequestAction({limit: 1, offset: 0}));
    yield put(startAttendEventSuccessAction());
    // yield put(getPersonalEventsRequestAction());
  } catch (error) {
    console.log('startFollowingCommunity', error);
    yield put(startAttendEventFailAction());
  }
}

function* getEventAfterSubscribe() {
  const event = yield select(selectEventById);
  const eventUid = event?.id;
  const response = yield call(getEventById, eventUid);
  const userUid: string = yield select(selectUserUid);
  const isFollowed = response.attendedPeople?.findIndex(
    (i: {userUid: string}) => i.userUid === userUid,
  );
  yield put(
    getEventByIdSuccessAction({
      eventById: response,
      isFollowed: isFollowed !== -1 ? true : false,
    }),
  );
  yield put(setLoadingAction({onLoading: false}));
}
function* unAttendEvent(action: any) {
  const {eventUid} = action?.payload;
  try {
    const userUid: string = yield select(selectUserUid);
    const response = yield call(unSubscribeEvent, eventUid);
    yield put(endAttendEventSuccessAction());

    const isFollowed = response.attendedPeople?.findIndex(
      (i: {userUid: string}) => i.userUid === userUid,
    );
    yield put(
      getEventByIdSuccessAction({
        eventById: response,
        isFollowed: isFollowed !== -1 ? true : false,
      }),
    );
    // yield put(getEventsRequestAction());
    yield put(getPersonalEventsRequestAction());
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
    type,
    inAppTickets,
    externalLink,
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
      type: type,
      inAppTickets: inAppTickets,
      link: externalLink,
    };
    yield put(setLoadingAction({onLoading: true}));
    const response = yield call(createEventWithMongo, data);
    console.log('createEventRequest', response, data);
    if (!response) {
      yield put(setNoticeVisible({isVisible: true}));
      yield put(
        setNoticeMessage({
          errorMessage: 'Server error',
        }),
      );
    } else {
      yield put(createEventSuccessAction({...response}));
      yield put(getEventsRequestAction({limit: 1, offset: 0}));
      // navigationRef.current?.dispatch(
      //   CommonActions.navigate({
      //   name: 'EventScreen',
      //   params: {
      //     data: response,
      //     createEvent: true,
      //   },
      // }),
      // );
    }

    // socket.emit('updated_events');
    yield put(getManagingEventsRequestAction());
    yield put(setLoadingAction({onLoading: false}));
    // yield put(getCommunitiesRequestAction());
  } catch (error) {
    // yield put(setNoticeVisible({isVisible: true}));
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
    type,
    inAppTickets,
    externalLink,
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
      type: type,
      inAppTickets: inAppTickets,
      link: externalLink,
    };
    // console.log('updateEventById', eventUid);
    yield put(setLoadingAction({onLoading: true}));
    yield call(updateEventById, eventUid, data);
    yield put(changeInformationEventSuccessAction());
    yield put(changeInformationValueAction());
    yield put(getEventsRequestAction({limit: 1, offset: 0}));
    const response = yield call(getEventById, eventUid);
    // socket.emit('updated_events');
    if (!response) {
      yield put(setNoticeVisible({isVisible: true}));
      yield put(
        setNoticeMessage({
          errorMessage: 'Server error',
        }),
      );
    } else {
      yield put(
        getEventByIdSuccessAction({
          eventById: response,
        }),
      );
      yield put(setLoadingAction({onLoading: false}));

      navigationRef.current?.navigate('EventScreen', {
        data: response,
      });
    }
  } catch (er) {
    yield put(changeInformationEventFailAction());
  }
}

function* getEventByIdRequest(action: any) {
  const {eventUid} = action?.payload;
  try {
    const response = yield call(getEventById, eventUid);
    // const imagesEv = yield call(getUsersImagesFromEvent, response.id);
    // const eventData = {
    //   ...response,
    //   userImages: Object.values(imagesEv),
    // };
    const userUid: string = yield select(selectUserUid);

    const isFollowed = response.attendedPeople?.findIndex(
      (i: {userUid: string}) => i.userUid === userUid,
    );
    if (!response) {
      yield put(setNoticeVisible({isVisible: true}));
      yield put(
        setNoticeMessage({
          errorMessage: 'Server error',
        }),
      );
      navigationRef.current?.navigate(
        'Events',
        // CommonActions.navigate({
        //   name: 'Events',
        // }),
      );
    } else {
      yield put(
        getEventByIdSuccessAction({
          eventById: response,
          isFollowed: isFollowed !== -1 ? true : false,
        }),
      );
    }
  } catch (error) {
    console.log('getEventByIdRequest er', error);
    yield put(getEventByIdFailAction(error));
  }
}

function* getManagingEvents() {
  try {
    const response = yield call(getManagingEventsRequest);
    const data: string[] = yield all(
      response.map((event: any) =>
        (function* () {
          const tickets: string[] = yield call(getTickets, event.id);
          try {
            const prices = tickets?.map((ticket: any) => ticket?.price);
            const minPriceTickets = Math.min(...prices);
            // const maxPriceTickets = Math.max(...prices);
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

    navigationRef.current?.navigate('Events', {
      createdEvent: true,
    });

    yield put(setLoadingAction({onLoading: false}));
    yield put(getPersonalEventsRequestAction());
  } catch (error) {
    yield put(setLoadingAction({onLoading: false}));
    yield put(removeEventFailAction());
  }
}
function* getPersonalEvents() {
  try {
    const userUid = yield select(selectUserUid);
    const {eventsList} = yield call(getEventsWithMongo);
    const personalEvents =
      eventsList.filter(
        (event: {attendedPeople: string[]; eventDate: {endDate: Date}}) =>
          moment(event.eventDate?.endDate).format('YYYY-MM-DD') >=
            moment(new Date()).format('YYYY-MM-DD') &&
          event?.attendedPeople?.length > 0 &&
          event?.attendedPeople?.find(
            (user: {_id: string}) => user?._id === userUid,
          ),
      ) ?? [];
    const data: string[] = yield all(
      personalEvents.map((event: any) =>
        (function* () {
          try {
            const tickets: string[] = yield call(getTickets, event.id);
            const prices = tickets?.map((ticket: any) => ticket?.price);
            const minPriceTickets = Math.min(...prices);
            // const maxPriceTickets = Math.max(...prices);
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
    yield put(
      getPersonalEventsSuccessAction({
        personalEvents: data,
      }),
    );
  } catch (error) {
    console.log('getPersonalEvents', error);
    yield put(getPersonalEventsFailAction());
  }
}

function* getEventsByUserId(action: {payload: {user_id: string}}) {
  const {user_id} = action.payload;
  try {
    const response = yield call(getEventForUserId, user_id);
    const events =
      response.filter((event: {eventDate: {endDate: Date; startDate: Date}}) =>
        event?.eventDate?.endDate !== null
          ? moment(event?.eventDate?.endDate).format('YYYY-MM-DD') >=
            moment(new Date()).format('YYYY-MM-DD')
          : moment(event?.eventDate?.startDate).format('YYYY-MM-DD') >=
            moment(new Date()).format('YYYY-MM-DD'),
      ) ?? [];
    const uniqueArray = events.filter((item, index, array) => {
      return array.map(mapItem => mapItem.id).indexOf(item.id) === index;
    });
    console.log('events', uniqueArray);
    yield put(getEventsByUserIdSuccessAction(uniqueArray));
  } catch (error) {
    yield put(getEventsByUserIdFailAction());
  }
}
function* eventSaga() {
  yield takeLatest(EVENT.EVENT_CREATE_REQUEST, createEventRequest);
  yield takeLatest(EVENT.GET_EVENTS_REQUEST, getEventsRequest);
  yield takeLatest(EVENT.GET_EVENT_BY_COMMUNITY_REQUEST, getEventForCommunity);
  yield takeLatest(EVENT.START_ATTEND_EVENT_REQUEST, attendEvent);
  yield debounce(100, EVENT.START_ATTEND_EVENT_SUCCESS, getEventAfterSubscribe);
  yield debounce(500, EVENT.START_ATTEND_EVENT_SUCCESS, getPersonalEvents);
  // yield takeLatest(EVENT.START_ATTEND_EVENT_SUCCESS, getEventAfterSubscribe);
  yield takeLatest(EVENT.END_ATTEND_EVENT_REQUEST, unAttendEvent);
  yield takeLatest(EVENT.CHANGE_INFORMATION_EVENT_REQUEST, changeInformation);
  yield takeLatest(EVENT.GET_EVENT_BY_ID_REQUEST, getEventByIdRequest);

  yield takeLatest(EVENT.REMOVE_EVENT_REQUEST, removeEventRquest);
  yield takeLatest(EVENT.GET_MANAGING_EVENTS_REQUEST, getManagingEvents);
  yield takeLatest(EVENT.SET_LIMIT, getEventsRequest);
  yield takeLatest(EVENT.GET_PERSONAL_EVENTS_REQUEST, getPersonalEvents);
  yield takeLatest(EVENT.GET_EVENTS_BY_USER_ID_REQUEST, getEventsByUserId);
  // yield debounce(1000, AUTHORIZATION_WITH_EMAIL.REQUEST, getEvents);
  // yield debounce(1000, AUTHORIZATION_WITH_GOOGLE.REQUEST, getEvents);
}
export default eventSaga;
