import {APP_STATE} from '../actionTypes/appStateActionTypes';
import appStateInitialState from '../initialState/appStateInitialState';

export type appStateAction = {
  type: string;
  payload: {
    onLoading: boolean;
    currentCity: string;
    danceStyles: string[];
    eventTypes: string[];
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
    default:
      return state;
  }
};
