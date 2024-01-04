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
  isFollowed?: boolean;
  errorsById?: null;
  managingEvents?: string[];
  price?: number;
  limit?: number;
  offset?: number;
  prevLimit?: number;
  prevOffset?: number;
  type?: string;
  personalEvents?: string[];
  inAppTickets?: boolean;
  externalLink?: string;
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
  price,
  type,
  inAppTickets,
  externalLink,
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
    price: price,
    type: type,
    inAppTickets: inAppTickets,
    externalLink: externalLink,
  },
});
export const createEventSuccessAction = (event: any) => ({
  type: EVENT.EVENT_CREATE_SUCCESS,
  payload: {
    event: event,
  },
});
export const createEventFailAction = () => ({
  type: EVENT.EVENT_CREATE_FAIL,
});

export const createEventChangeValue = () => ({
  type: EVENT.EVENT_CREATE_CHANGE_VALUE,
});

export const getEventsRequestAction = ({offset, limit}: eventParams) => ({
  type: EVENT.GET_EVENTS_REQUEST,
  payload: {
    limit: limit,
    offset: offset,
  },
});
export const getEventsSuccessAction = ({
  eventsList,
  prevOffset,
  prevLimit,
}: eventParams) => ({
  type: EVENT.GET_EVENTS_SUCCESS,
  payload: {
    eventsList: eventsList,
    prevOffset: prevOffset,
    prevLimit: prevLimit,
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
export const startAttendEventRequestAction = ({eventUid}: eventParams) => ({
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
  price,
  type,
  inAppTickets,
  externalLink,
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
    price: price,
    type: type,
    inAppTickets: inAppTickets,
    externalLink: externalLink,
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
export const getEventByIdSuccessAction = ({
  eventById,
  isFollowed,
}: eventParams) => ({
  type: EVENT.GET_EVENT_BY_ID_SUCCESS,
  payload: {
    eventById: eventById,
    isFollowed: isFollowed,
  },
});
export const getEventByIdFailAction = ({errorsById}: eventParams) => ({
  type: EVENT.GET_EVENT_BY_ID_FAIL,
  payload: {
    errorsById: errorsById,
  },
});

export const getEventByIdClearAction = () => ({
  type: EVENT.GET_EVENT_BY_ID_CLEAR,
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
export const removeEventSuccessAction = () => ({
  type: EVENT.REMOVE_EVENT_SUCCESS,
});
export const removeEventFailAction = () => ({
  type: EVENT.REMOVE_EVENTY_FAIL,
});
export const removeEventRequestAction = ({eventUid}: eventParams) => ({
  type: EVENT.REMOVE_EVENT_REQUEST,
  payload: {
    uid: eventUid,
  },
});

export const setLimit = ({limit, offset}: eventParams) => ({
  type: EVENT.SET_LIMIT,
  payload: {
    limit: limit,
    offset: offset,
  },
});

export const getPersonalEventsRequestAction = () => ({
  type: EVENT.GET_PERSONAL_EVENTS_REQUEST,
});

export const getPersonalEventsSuccessAction = ({
  personalEvents,
}: eventParams) => ({
  type: EVENT.GET_PERSONAL_EVENTS_SUCCESS,
  payload: {
    personalEvents: personalEvents,
  },
});

export const getPersonalEventsFailAction = () => ({
  type: EVENT.GET_PERSONAL_EVENTS_FAIL,
});
