import {APP_STATE} from '../actionTypes/appStateActionTypes';
import appStateInitialState from '../initialState/appStateInitialState';

export type appStateAction = {
  type: string;
  payload: {
    onLoading: boolean;
  };
};

export default (state = appStateInitialState, action: appStateAction) => {
  switch (action.type) {
    case APP_STATE.SET_LOADING:
      return {
        ...state,
        onLoading: action.payload.onLoading,
      };
    default:
      return state;
  }
};
