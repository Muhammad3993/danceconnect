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
    eventsByIdData?: string[];
    loadingEvents?: boolean;
    eventUid?: string;
    eventDate?: null;
    place?: string;
    communityUid?: string;
    loadingAttend?: false;
    isLoadingChangeInformation?: false;
    saveChanges?: false;
    typeEvent: string;
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
      };
    case EVENT.GET_EVENTS_SUCCESS:
      return {
        ...state,
        eventsList: action.payload?.eventsList,
        loadingEvents: false,
      };
    case EVENT.GET_EVENTS_FAIL:
      return {
        ...state,
        eventsList: [],
        loadingEvents: false,
      };
    case EVENT.GET_EVENT_BY_ID_REQUEST:
      return {
        ...state,
        eventsByIdData: [],
        loadingEvents: true,
      };
    case EVENT.GET_EVENT_BY_ID_SUCCESS:
      return {
        ...state,
        eventsByIdData: action.payload?.eventsByIdData,
        loadingEvents: false,
      };
    case EVENT.GET_EVENT_BY_ID_FAIL:
      return {
        ...state,
        eventsByIdData: [],
        loadingEvents: false,
      };
    case EVENT.START_ATTEND_EVENT_REQUEST:
      return {
        ...state,
        loadingAttend: true,
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
    default:
      return state;
  }
};
