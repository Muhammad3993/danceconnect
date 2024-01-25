import {BOOTSRAP_STATE} from '../actionTypes/boostrapActionTypes';

export type BootstrapStateReducer = {
  isBootstraped: boolean;
};

export default (state = {isBootstraped: false}, action: {type: string}) => {
  switch (action.type) {
    case BOOTSRAP_STATE.INIT:
      return state;
    case BOOTSRAP_STATE.INIT_SUCCESS:
      return {isBootstraped: true};
    case BOOTSRAP_STATE.INIT_FAILURE:
      return {isBootstraped: true};
    default:
      return state;
  }
};
