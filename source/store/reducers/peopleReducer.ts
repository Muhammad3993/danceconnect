import {DIFFERENT_USER, PEOPLE} from '../actionTypes/peopleActionTypes';
import peopleInitialState from '../initialState/peopleInitialState';

export type peopleAction = {
  type: string;
  payload?: {
    users: string[] | null;
    different_user: {} | null;
    loadingUsers: boolean;
    loadingDifferentUser: boolean;
  };
};
export default (state = peopleInitialState, action: peopleAction) => {
  switch (action.type) {
    case PEOPLE.REQUEST:
      return {
        ...state,
        loadingUsers: true,
        users: [],
      };
    case PEOPLE.SUCCESS:
      return {
        ...state,
        loadingUsers: false,
        users: action.payload?.users,
      };
    case PEOPLE.FAIL:
      return {
        ...state,
        loadingUsers: false,
        users: [],
      };
    case DIFFERENT_USER.REQUEST:
      return {
        ...state,
        loadingDifferentUser: true,
        different_user: null,
      };
    case DIFFERENT_USER.SUCCESS:
      return {
        ...state,
        loadingDifferentUser: false,
        different_user: action.payload?.different_user,
      };
    case DIFFERENT_USER.FAIL:
      return {
        ...state,
        loadingDifferentUser: false,
        different_user: null,
      };
    default:
      return state;
  }
};
