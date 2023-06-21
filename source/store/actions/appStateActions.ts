import {APP_STATE} from '../actionTypes/appStateActionTypes';

type appStateParams = {
  onLoading: boolean;
};

export const setLoadingAction = ({onLoading}: appStateParams) => ({
  type: APP_STATE.SET_LOADING,
  payload: {
    onLoading: onLoading,
  },
});
