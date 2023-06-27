import {APP_STATE} from '../actionTypes/appStateActionTypes';
import appStateInitialState from '../initialState/appStateInitialState';

export type appStateAction = {
  type: string;
  payload: {
    onLoading: boolean;
    currentCity: string;
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
    default:
      return state;
  }
};
