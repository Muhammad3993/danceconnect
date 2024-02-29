export enum EVENT {
  EVENT_CREATE_REQUEST = 'EVENT/EVENT_CREATE_REQUEST',
  EVENT_CREATE_SUCCESS = 'EVENT/EVENT_CREATE_SUCCESS',
  EVENT_CREATE_FAIL = 'EVENT/EVENT_CREATE_FAIL',

  EVENT_CREATE_CHANGE_VALUE = 'EVENT/EVENT_CREATE_CHANGE_VALUE',

  GET_EVENT_BY_COMMUNITY_REQUEST = 'EVENT/GET_EVENT_BY_COMMUNITY_REQUEST',
  GET_EVENT_BY_COMMUNITY_SUCCESS = 'EVENT/GET_EVENT_BY_COMMUNITY_SUCCESS',
  GET_EVENT_BY_COMMUNITY_FAIL = 'EVENT/GET_EVENT_BY_COMMUNITY_FAIL',

  GET_MANAGING_EVENTS_REQUEST = 'EVENTS/GET_MANAGING_EVENTS_REQUEST',
  GET_MANAGING_EVENTS_SUCCESS = 'EVENTS/GET_MANAGING_EVENTS_SUCCESS',
  GET_MANAGING_EVENTS_FAIL = 'EVENTS/GET_MANAGING_EVENTS_FAIL',

  GET_EVENT_BY_ID_REQUEST = 'EVENT/GET_EVENT_BY_ID_REQUEST',
  GET_EVENT_BY_ID_SUCCESS = 'EVENT/GET_EVENT_BY_ID_SUCCESS',
  GET_EVENT_BY_ID_FAIL = 'EVENT/GET_EVENT_BY_ID_FAIL',
  GET_EVENT_BY_ID_CLEAR = 'EVENT/GET_EVENT_BY_ID_CLEAR',

  GET_EVENTS_REQUEST = 'EVENTS/GET_EVENTS_REQUEST',
  GET_EVENTS_SUCCESS = 'EVENT/GET_EVENTS_SUCCESS',
  GET_EVENTS_FAIL = 'EVENT/GET_EVENTS_FAIL',

  START_ATTEND_EVENT_REQUEST = 'EVENT/START_ATTEND_EVENT_REQUEST',
  START_ATTEND_EVENT_SUCCESS = 'EVENT/START_ATTEND_EVENT_SUCCESS',
  START_ATTEND_EVENT_FAIL = 'EVENT/START_ATTEND_EVENT_FAIL',

  END_ATTEND_EVENT_REQUEST = 'EVENT/END_ATTEND_EVENT_REQUEST',
  END_ATTEND_EVENT_SUCCESS = 'EVENT/END_ATTEND_EVENT_SUCCESS',
  END_ATTEND_EVENT_FAIL = 'EVENT/END_ATTEND_EVENT_FAIL',

  CHANGE_INFORMATION_EVENT_REQUEST = 'EVENT/CHANGE_INFORMATION_EVENT_REQUEST',
  CHANGE_INFORMATION_EVENT_SUCCESS = 'EVENT/CHANGE_INFORMATION_EVENT_SUCCESS',
  CHANGE_INFORMATION_EVENT_FAIL = 'EVENT/CHANGE_INFORMATION_EVENT_FAIL',
  CHANGE_INFORMATION_VALUE = 'EVENT/CHANGE_INFORMATION_VALUE',

  REMOVE_EVENT_REQUEST = 'EVENT/REMOVE_EVENT_REQUEST',
  REMOVE_EVENT_SUCCESS = 'EVENT/REMOVE_EVENT_SUCCESS',
  REMOVE_EVENTY_FAIL = 'EVENT/REMOVE_EVENT_FAIL',

  SET_OFFSET = 'EVENTS/SET_OFFSET',
  SET_LIMIT = 'EVENTS/SET_LIMIT',

  GET_PERSONAL_EVENTS_REQUEST = 'EVENTS/GET_PERSONAL_EVENTS_REQUEST',
  GET_PERSONAL_EVENTS_SUCCESS = 'EVENTS/GET_PERSONAL_EVENTS_SUCCESS',
  GET_PERSONAL_EVENTS_FAIL = 'EVENTS/GET_PERSONAL_EVENTS_FAIL',

  GET_EVENTS_BY_USER_ID_REQUEST = 'EVENTS/GET_EVENTS_BY_USER_ID_REQUEST',
  GET_EVENTS_BY_USER_ID_SUCCESS = 'EVENTS/GET_EVENTS_BY_USER_ID_SUCCESS',
  GET_EVENTS_BY_USER_ID_FAIL = 'EVENTS/GET_EVENTS_BY_USER_ID_FAIL',

  GET_MAIN_EVENTS_REQUEST = 'EVENTS/GET_MAIN_EVENTS_REQUEST',
  GET_MAIN_EVENTS_SUCCESS = 'EVENTS/GET_MAIN_EVENTS_SUCCESS',
  GET_MAIN_EVENTS_FAIL = 'EVENTS/GET_MAIN_EVENTS_FAIL',

  REMOVE_RECURRENT_EVENT_REQUEST = 'EVENT/REMOVE_RECURRENT_EVENT_REQUEST',
  REMOVE_RECURRENT_EVENT_SUCCESS = 'EVENT/REMOVE_RECURRENT_EVENT_SUCCESS',
  REMOVE_RECURRENT_EVENTY_FAIL = 'EVENT/REMOVE_RECURRENT_EVENT_FAIL',
}
