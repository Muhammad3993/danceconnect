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
    currentCountry: any;

    isVisible?: boolean;
    errorMessage?: string;
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
    default:
      return state;
  }
};
