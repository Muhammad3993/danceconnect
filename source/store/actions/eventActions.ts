import {EVENT} from '../actionTypes/eventActionTypes';

export type eventParams = {
  isLoading?: boolean;
  name?: string;
  description?: string;
  country?: string;
  location?: string;
  creatorUid?: string;
  categories?: string[];
  followers?: string[];
  images?: string[];
  errors?: null;
  eventsList?: string[];
  eventsByIdCommunity?: string[];
  loadingEvents?: boolean;
  eventUid?: string;
  eventDate?: {};
  place?: string;
  communityUid?: string;
  typeEvent?: string;
  eventById?: null;
  errorsById?: null;
  managingEvents?: string[];
};

export type followingParams = {
  isLoadingFollow?: boolean;
  communityUid?: string;
  eventUid: string;
  userUid?: string;
};
export const createEventRequestAction = ({
  name,
  description,
  // country,
  location,
  place,
  creatorUid,
  categories,
  images,
  eventDate,
  typeEvent,
  communityUid,
}: eventParams) => ({
  type: EVENT.EVENT_CREATE_REQUEST,
  payload: {
    name: name,
    description: description,
    // country: country,
    location: location,
    place: place,
    creatorUid: creatorUid,
    categories: categories,
    images: images,
    eventDate: eventDate,
    typeEvent: typeEvent,
    communityUid: communityUid,
  },
});
export const createEventSuccessAction = () => ({
  type: EVENT.EVENT_CREATE_SUCCESS,
});
export const createEventFailAction = () => ({
  type: EVENT.EVENT_CREATE_FAIL,
});

export const getEventsRequestAction = () => ({
  type: EVENT.GET_EVENTS_REQUEST,
});
export const getEventsSuccessAction = ({eventsList}: eventParams) => ({
  type: EVENT.GET_EVENTS_SUCCESS,
  payload: {
    eventsList: eventsList,
  },
});
export const getEventsFailAction = () => ({
  type: EVENT.GET_EVENTS_FAIL,
});

export const getEventByIdCommunityRequestAction = ({
  eventUid,
}: eventParams) => ({
  type: EVENT.GET_EVENT_BY_COMMUNITY_REQUEST,
  payload: {
    eventUid: eventUid ?? null,
  },
});
export const getEventByIdCommunitySuccessAction = ({
  eventsByIdCommunity,
}: eventParams) => ({
  type: EVENT.GET_EVENT_BY_COMMUNITY_SUCCESS,
  payload: {
    eventsByIdCommunity: eventsByIdCommunity,
  },
});
export const getEventByIdCommunityFailAction = () => ({
  type: EVENT.GET_EVENT_BY_COMMUNITY_FAIL,
});
export const startAttendEventRequestAction = ({eventUid}: followingParams) => ({
  type: EVENT.START_ATTEND_EVENT_REQUEST,
  payload: {
    eventUid: eventUid,
  },
});
export const startAttendEventSuccessAction = () => ({
  type: EVENT.START_ATTEND_EVENT_SUCCESS,
});
export const startAttendEventFailAction = () => ({
  type: EVENT.START_ATTEND_EVENT_FAIL,
});
export const endAttendEventRequestAction = ({eventUid}: followingParams) => ({
  type: EVENT.END_ATTEND_EVENT_REQUEST,
  payload: {
    eventUid: eventUid,
  },
});
export const endAttendEventSuccessAction = () => ({
  type: EVENT.END_ATTEND_EVENT_SUCCESS,
});
export const endAttendEventFailAction = () => ({
  type: EVENT.END_ATTEND_EVENT_FAIL,
});
export const changeInformationEventRequestAction = ({
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
}: eventParams) => ({
  type: EVENT.CHANGE_INFORMATION_EVENT_REQUEST,
  payload: {
    name: name,
    description: description,
    // country: country,
    location: location,
    categories: categories,
    images: images,
    eventDate: eventDate,
    place: place,
    typeEvent: typeEvent,
    eventUid: eventUid,
  },
});
export const changeInformationEventSuccessAction = () => ({
  type: EVENT.CHANGE_INFORMATION_EVENT_SUCCESS,
});

export const changeInformationEventFailAction = () => ({
  type: EVENT.CHANGE_INFORMATION_EVENT_FAIL,
});

export const changeInformationValueAction = () => ({
  type: EVENT.CHANGE_INFORMATION_VALUE,
});

export const getEventByIdRequestAction = ({eventUid}: eventParams) => ({
  type: EVENT.GET_EVENT_BY_ID_REQUEST,
  payload: {
    eventUid: eventUid,
  },
});
export const getEventByIdSuccessAction = ({eventById}: eventParams) => ({
  type: EVENT.GET_EVENT_BY_ID_SUCCESS,
  payload: {
    eventById: eventById,
  },
});
export const getEventByIdFailAction = ({errorsById}: eventParams) => ({
  type: EVENT.GET_EVENT_BY_ID_FAIL,
  payload: {
    errorsById: errorsById,
  },
});

export const getManagingEventsFailAction = () => ({
  type: EVENT.GET_MANAGING_EVENTS_FAIL,
});
export const getManagingEventsRequestAction = () => ({
  type: EVENT.GET_MANAGING_EVENTS_REQUEST,
});
export const getManagingEventsSuccessAction = ({
  managingEvents,
}: eventParams) => ({
  type: EVENT.GET_MANAGING_EVENTS_SUCCESS,
  payload: {
    managingEvents: managingEvents,
  },
});
