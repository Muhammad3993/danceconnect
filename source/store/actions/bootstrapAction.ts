import {BOOTSRAP_STATE} from '../actionTypes/boostrapActionTypes';

export const appInitAction = () => ({
  type: BOOTSRAP_STATE.INIT,
  payload: {},
});

export const appInitSuccessAction = () => ({
  type: BOOTSRAP_STATE.INIT_SUCCESS,
  payload: {},
});
export const appInitFailureAction = () => ({
  type: BOOTSRAP_STATE.INIT_FAILURE,
  payload: {},
});
