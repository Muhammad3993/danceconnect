import {all, call, put, select, take, takeLatest} from 'redux-saga/effects';
import {selectUserUid} from '../selectors/registrationSelector';
import {createEvent, getEventByUid, getEvents, joinEvent} from '../../api/functions';
import {navigationRef} from '../../navigation/types';
import {CommonActions} from '@react-navigation/native';
// import {getCommunitiesRequestAction} from '../actions/communityActions';
import {EVENT} from '../actionTypes/eventActionTypes';
import {
  createEventFailAction,
  createEventSuccessAction,
  getEventByIdFailAction,
  getEventByIdSuccessAction,
  getEventsFailAction,
  getEventsRequestAction,
  getEventsSuccessAction,
  startAttendEventFailAction,
  startAttendEventSuccessAction,
} from '../actions/eventActions';

function* getEventsRequest() {
  try {
    const data = yield call(getEvents);
    // console.log('getCommunitiesRequest', Object.values(data), data);
    yield put(
      getEventsSuccessAction({
        eventsList: Object.values(data),
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
      call(getEventByUid, eventId),
    );
    const events = yield all(requests);
    yield put(
      getEventByIdSuccessAction({
        eventsByIdData: events,
      }),
    );
    yield put(getEventsRequestAction());
    // console.log(events);
  } catch (error) {
    yield put(getEventByIdFailAction());
    console.log(error);
  }
}

function* attendEvent(action: any) {
  const {communityUid, eventUid, userUid} = action?.payload;
  try {
    yield call(joinEvent, communityUid, userUid, eventUid);
    yield put(startAttendEventSuccessAction());
    // yield put(getCommunitiesRequestAction());
    // yield put(getCommunityByIdRequestAction(communityUid));
  } catch (error) {
    console.log('startFollowingCommunity', error);
    yield put(startAttendEventFailAction());
  }
}
// function* getEventDateById(action: any) {
//   const {eventUid} = action.payload;

//   try {
//     yield put(
//       getEventByIdSuccessAction({
//         eventsByIdData: yield call(getEventByUid, eventUid),
//       }),
//     );
//   } catch (error) {
//     yield put(getEventByIdFailAction());
//   }
// }
function* createEventRequest(action: any) {
  const {
    name,
    description,
    country,
    location,
    categories,
    images,
    eventDate,
    place,
    communityUid,
  } = action?.payload;
  try {
    const creatorUid = yield select(selectUserUid);
    yield call(
      createEvent,
      name,
      description,
      country,
      location,
      creatorUid,
      categories,
      images,
      eventDate,
      place,
      communityUid,
    );
    yield put(createEventSuccessAction());
    // navigationRef.current?.dispatch(
    //   CommonActions.navigate({
    //     name: 'Events',
    //     params: {
    //       createdCommunity: true,
    //     },
    //   }),
    // );
    // yield put(getCommunitiesRequestAction());
  } catch (error) {
    console.log('createCommunityRequest error', error);
    yield put(createEventFailAction());
  }
}

// function* getEventByIdRequest(action: any) {
//   const {communityUid} = action?.payload;
//   try {
//     yield put(
//       getCommunityByIdSuccessAction({
//         communityByIdData: yield call(getCommunityByUid, communityUid),
//       }),
//     );
//   } catch (error) {
//     console.log('er', error);
//     yield put(getCommunityByIdFailAction(error));
//   }
// }

//   function* changeInformation(action: any) {
//     const {
//       name,
//       description,
//       country,
//       location,
//       communityUid,
//       categories,
//       images,
//       followers,
//     } = action?.payload;
//     try {
//       yield call(
//         changeInformationCommunity,
//         name,
//         description,
//         country,
//         location,
//         communityUid,
//         followers,
//         categories,
//         images,
//       );
//       // console.log('changeInformation', action.payload);
//       yield put(changeInformationCommunitySuccessAction());
//       yield put(getCommunitiesRequestAction());
//       // yield put(getCommunityByIdRequestAction({communityUid: communityUid}));
//       yield put(changeInformationValueAction());
//     } catch (error) {
//       yield put(cancelFollowedCommunityFailAction());
//     }
//   }

//   function* removeCommunityRequest(action: any) {
//     try {
//       yield call(removeCommunity, action?.payload?.uid);
//       yield put(removeCommunitySuccessAction());
//       yield put(getCommunitiesRequestAction());
//     } catch (error) {
//       yield put(removeCommunityFailAction());
//     }
//   }

function* eventSaga() {
  yield takeLatest(EVENT.EVENT_CREATE_REQUEST, createEventRequest);
  yield takeLatest(EVENT.GET_EVENTS_REQUEST, getEventsRequest);
  yield takeLatest(EVENT.GET_EVENT_BY_ID_REQUEST, getEventForCommunity);
  yield takeLatest(EVENT.START_ATTEND_EVENT_REQUEST, attendEvent);
  // yield takeLatest(COMMUNITIES.GET_DATA_REQUEST, getCommunitiesRequest);
  // yield takeLatest(COMMUNITIES.CREATE_REQUEST, createCommunityRequest);
  // yield debounce(2000, COMMUNITIES.CREATE_SUCCESS, getCommunitiesRequest);
  // yield takeLatest(
  //   COMMUNITIES.START_FOLLOWING_REQUEST,
  //   startFollowingCommunity,
  // );
  // yield takeLatest(
  //   COMMUNITIES.CANCEL_FOLLOWING_REQUEST,
  //   cancelFollowingCommunity,
  // );
  // yield takeLatest(
  //   COMMUNITIES.CHANGE_INFORMATION_COMMUNITY_REQUEST,
  //   changeInformation,
  // );
  // yield takeLatest(
  //   COMMUNITIES.REMOVE_COMMUNITY_REQUEST,
  //   removeCommunityRequest,
  // );
}

export default eventSaga;
