import {APP_STATE} from '../actionTypes/appStateActionTypes';

type appStateParams = {
  onLoading?: boolean;
  currentCity?: string;
  danceStyles?: string[];
  eventTypes?: string[];
};

export const setLoadingAction = ({onLoading}: appStateParams) => ({
  type: APP_STATE.SET_LOADING,
  payload: {
    onLoading: onLoading,
  },
});
export const choosedCityAction = ({currentCity}: appStateParams) => ({
  type: APP_STATE.SET_CITY,
  payload: {
    currentCity: currentCity,
  },
});
export const getDanceStylesAction = () => ({
  type: APP_STATE.GET_DANCE_STYLES,
});
export const setDanceStylesAction = ({danceStyles}: appStateParams) => ({
  type: APP_STATE.SET_DANCE_STYLES,
  payload: {
    danceStyles: danceStyles,
  },
});
export const getEventTypesAction = () => ({
  type: APP_STATE.GET_EVENT_TYPES,
});
export const setEventTypesAction = ({eventTypes}: appStateParams) => ({
  type: APP_STATE.SET_EVENT_TYPES,
  payload: {
    eventTypes: eventTypes,
  },
});
