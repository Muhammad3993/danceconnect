import {DIFFERENT_USER, PEOPLE} from '../actionTypes/peopleActionTypes';
type user = {
  id: string;
};
export const getUsersListRequestAction = () => ({
  type: PEOPLE.REQUEST,
});

export const getUsersListSuccessAction = (users: user[]) => ({
  type: PEOPLE.SUCCESS,
  payload: {
    users,
  },
});

export const getUsersListFailAction = () => ({
  type: PEOPLE.FAIL,
});

export const getDifferentUserRequestAction = (id: string) => ({
  type: DIFFERENT_USER.REQUEST,
  payload: {id},
});

export const getDifferentUserSuccessAction = (different_user: {} | null) => ({
  type: DIFFERENT_USER.SUCCESS,
  payload: {
    different_user,
  },
});

export const getDifferentUserFailAction = () => ({
  type: DIFFERENT_USER.FAIL,
});
