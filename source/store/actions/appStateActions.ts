import {APP_STATE} from '../actionTypes/appStateActionTypes';

type appStateParams = {
  onLoading?: boolean;
  currentCity?: string;
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
