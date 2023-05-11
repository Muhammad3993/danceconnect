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
  eventsByIdData?: string[];
  loadingEvents?: boolean;
  eventUid?: string;
  eventDate?: {};
  place?: string;
  communityUid?: string;
};

export type followingParams = {
  isLoadingFollow?: boolean;
  communityUid: string;
  eventUid: string;
  userUid?: string;
};
export const createEventRequestAction = ({
  name,
  description,
  country,
  location,
  place,
  creatorUid,
  categories,
  images,
  eventDate,
  communityUid,
}: eventParams) => ({
  type: EVENT.EVENT_CREATE_REQUEST,
  payload: {
    name: name,
    description: description,
    country: country,
    location: location,
    place: place,
    creatorUid: creatorUid,
    categories: categories,
    images: images,
    eventDate: eventDate,
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

export const getEventByIdRequestAction = ({eventUid}: eventParams) => ({
  type: EVENT.GET_EVENT_BY_ID_REQUEST,
  payload: {
    eventUid: eventUid ?? null,
  },
});
export const getEventByIdSuccessAction = ({eventsByIdData}: eventParams) => ({
  type: EVENT.GET_EVENT_BY_ID_SUCCESS,
  payload: {
    eventsByIdData: eventsByIdData,
  },
});
export const getEventByIdFailAction = () => ({
  type: EVENT.GET_EVENT_BY_ID_FAIL,
});
export const startAttendEventRequestAction = ({
  communityUid,
  userUid,
  eventUid,
}: followingParams) => ({
  type: EVENT.START_ATTEND_EVENT_REQUEST,
  payload: {
    communityUid: communityUid,
    userUid: userUid,
    eventUid: eventUid,
  },
});
export const startAttendEventSuccessAction = () => ({
  type: EVENT.START_ATTEND_EVENT_SUCCESS,
});
export const startAttendEventFailAction = () => ({
  type: EVENT.START_ATTEND_EVENT_FAIL,
});
