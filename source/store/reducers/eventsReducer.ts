import {EVENT} from '../actionTypes/eventActionTypes';
import eventsInitialState from '../initialState/eventsInitialState';
export type eventAction = {
  type: string;
  payload?: {
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
    eventDate?: null;
    place?: string;
    communityUid?: string;
    loadingAttend?: false;
    isLoadingChangeInformation?: false;
    saveChanges?: false;
    typeEvent?: string;
    eventById?: null;
    loadingById?: null;
    errorsById?: null;
    loadingManaging?: boolean;
    managingEvents?: string[];
    price?: string;
    offset: number;
    limit: number;
    prevLimit: number;
    prevOffset: number;
  };
};

export default (state = eventsInitialState, action: eventAction) => {
  switch (action.type) {
    case EVENT.EVENT_CREATE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case EVENT.EVENT_CREATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ...action.payload,
      };
    case EVENT.EVENT_CREATE_FAIL:
      return {
        ...state,
        errors: action.payload?.errors,
        isLoading: false,
      };

    case EVENT.GET_EVENTS_REQUEST:
      return {
        ...state,
        eventsList: [],
        loadingEvents: true,
        limit: action.payload?.limit,
        offset: action.payload?.offset,
      };
    case EVENT.GET_EVENTS_SUCCESS:
      return {
        ...state,
        eventsList: action.payload?.eventsList,
        loadingEvents: false,
        prevLimit: action.payload?.prevLimit,
        prevOffset: action.payload?.prevOffset,
      };
    case EVENT.GET_EVENTS_FAIL:
      return {
        ...state,
        eventsList: [],
        loadingEvents: false,
      };
    case EVENT.SET_LIMIT:
      return {
        ...state,
        limit: action?.payload?.limit,
        offset: action.payload?.offset,
      };
    case EVENT.GET_EVENT_BY_COMMUNITY_REQUEST:
      return {
        ...state,
        eventsByIdCommunity: [],
        loadingEvents: true,
      };
    case EVENT.GET_EVENT_BY_COMMUNITY_SUCCESS:
      return {
        ...state,
        eventsByIdCommunity: action.payload?.eventsByIdCommunity,
        loadingEvents: false,
      };
    case EVENT.GET_EVENT_BY_COMMUNITY_FAIL:
      return {
        ...state,
        eventsByIdCommunity: [],
        loadingEvents: false,
      };
    case EVENT.START_ATTEND_EVENT_REQUEST:
      return {
        ...state,
        loadingAttend: true,
        eventUid: action.payload?.eventUid,
      };
    case EVENT.START_ATTEND_EVENT_SUCCESS:
      return {
        ...state,
        loadingAttend: false,
      };

    case EVENT.START_ATTEND_EVENT_FAIL:
      return {
        ...state,
        loadingAttend: false,
      };
    case EVENT.END_ATTEND_EVENT_REQUEST:
      return {
        ...state,
        loadingAttend: true,
        eventUid: action.payload?.eventUid,
      };
    case EVENT.END_ATTEND_EVENT_SUCCESS:
      return {
        ...state,
        loadingAttend: false,
      };

    case EVENT.END_ATTEND_EVENT_FAIL:
      return {
        ...state,
        loadingAttend: false,
      };
    case EVENT.CHANGE_INFORMATION_EVENT_REQUEST:
      return {
        ...state,
        isLoadingChangeInformation: true,
        name: action?.payload?.name,
        description: action?.payload?.description,
        // country: action?.payload?.country,
        location: action?.payload?.location,
        categories: action?.payload?.categories,
        followers: action?.payload?.followers,
        images: action?.payload?.images,
        eventDate: action?.payload?.eventDate,
        place: action?.payload?.place,
        typeEvent: action?.payload?.typeEvent,
        price: action?.payload?.price,
        saveChanges: false,
      };
    case EVENT.CHANGE_INFORMATION_EVENT_SUCCESS:
      return {
        ...state,
        isLoadingChangeInformation: false,
        saveChanges: true,
      };

    case EVENT.CHANGE_INFORMATION_EVENT_SUCCESS:
      return {
        ...state,
        isLoadingChangeInformation: false,
        saveChanges: false,
      };

    case EVENT.CHANGE_INFORMATION_VALUE:
      return {
        ...state,
        saveChanges: false,
      };
    case EVENT.GET_EVENT_BY_ID_REQUEST:
      return {
        ...state,
        eventById: null,
        loadingById: true,
      };
    case EVENT.GET_EVENT_BY_ID_SUCCESS:
      return {
        ...state,
        eventById: action.payload?.eventById,
        loadingById: false,
      };
    case EVENT.GET_EVENT_BY_ID_FAIL:
      return {
        ...state,
        eventById: null,
        loadingById: false,
        errorsById: action.payload?.errorsById,
      };
    case EVENT.GET_EVENT_BY_ID_CLEAR:
      return {
        ...state,
        eventById: null,
      };
    case EVENT.GET_MANAGING_EVENTS_REQUEST:
      return {
        ...state,
        loadingManaging: true,
        managingEvents: [],
      };
    case EVENT.GET_MANAGING_EVENTS_SUCCESS:
      return {
        ...state,
        loadingManaging: false,
        managingEvents: action.payload?.managingEvents,
      };
    case EVENT.GET_MANAGING_EVENTS_FAIL:
      return {
        ...state,
        loadingManaging: false,
        managingEvents: [],
      };
    default:
      return state;
  }
};
