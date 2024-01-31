import {APP_STATE} from '../actionTypes/appStateActionTypes';
import appStateInitialState from '../initialState/appStateInitialState';

export type appStateAction = {
  type: string;
  payload: {
    onLoading: boolean;
    currentCity: string;
    danceStyles: string[];
    eventTypes: string[];
    countries: string[];
    regions?: string[];
    currentCountry: any;
    stripe_key: string;

    isVisible?: boolean;
    errorMessage?: string;
    language?: string;
    ticket_percent?: number;
    ticket_fix_price?: number;
    data?: any;
  };
};

export default (state = appStateInitialState, action: appStateAction) => {
  switch (action.type) {
    case APP_STATE.SET_LOADING:
      return {
        ...state,
        onLoading: action.payload.onLoading,
      };
    case APP_STATE.SET_CITY:
      return {
        ...state,
        currentCity: action.payload.currentCity,
      };
    case APP_STATE.SET_DANCE_STYLES:
      return {
        ...state,
        danceStyles: action.payload.danceStyles,
      };
    case APP_STATE.SET_EVENT_TYPES:
      return {
        ...state,
        eventTypes: action.payload.eventTypes,
      };
    case APP_STATE.SET_COUNTRIES:
      return {
        ...state,
        countries: action.payload.countries,
      };
    case APP_STATE.SET_REGIONS:
      return {
        ...state,
        regions: action.payload.regions,
      };
    case APP_STATE.SET_ERROR_NOTICE_VISIBLE:
      return {
        ...state,
        isVisible: action?.payload.isVisible,
      };
    case APP_STATE.SET_ERROR_NOTICE_MESSAGE:
      return {
        ...state,
        errorMessage: action.payload?.errorMessage,
      };
    case APP_STATE.SET_CURRENT_COUNTRY:
      return {
        ...state,
        currentCountry: action.payload.currentCountry,
      };
    case APP_STATE.SET_STRIPE_KEY:
      return {
        ...state,
        stripe_key: action.payload.stripe_key,
      };

    case APP_STATE.SET_CURRENT_LANGUAGE:
      return {
        ...state,
        language: action.payload.language,
      };

    case APP_STATE.SET_TICKET_PERCENT:
      return {
        ...state,
        ticket_percent: action?.payload?.ticket_percent,
        ticket_fix_price: action?.payload?.ticket_fix_price,
      };

    case APP_STATE.SEND_NOTIFICATION:
      return {
        ...state,
        data: action.payload.data,
      };
    default:
      return state;
  }
};
