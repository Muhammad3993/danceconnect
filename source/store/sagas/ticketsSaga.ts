import {call, put, takeLatest} from 'redux-saga/effects';
import {
  changeTicket,
  getPurchasedTickets,
  getTickets,
  makeTicket,
  removeTicket,
} from '../../api/serverRequests';
import {TICKET} from '../actionTypes/ticketActionTypes';
import {setLoadingAction} from '../actions/appStateActions';
import {
  createTicketFailAction,
  createTicketSuccessAction,
  getPurchasedTicketsFailAction,
  getPurchasedTicketsSuccessAction,
  getTicketsRequestAction,
  getTicketsSuccessAction,
} from '../actions/ticketActions';

function* createTicketRequest(action: any) {
  const {ticket} = action.payload;
  yield put(setLoadingAction({onLoading: true}));
  try {
    const ticketData = {
      ...ticket,
      initialPrice: ticket?.price,
    };
    const response = yield call(makeTicket, ticketData);
    // console.log('respo', response);
    if (response.status === 200 || response.status === 201) {
      yield put(createTicketSuccessAction(response?.data));
      yield put(getTicketsRequestAction(ticket?.eventUid));
      yield put(setLoadingAction({onLoading: false}));
    } else {
      console.log('respo', response);
    }
    // const event = yield call(getEventById, preCreatedEvent?.uid);
    // navigationRef.current?.dispatch(
    //   CommonActions.navigate({
    //     name: 'EventScreen',
    //     params: {
    //       data: event,
    //       createEvent: true,
    //     },
    //   }),
    // );
  } catch (error) {
    console.log('create ticket error', error);
    yield put(createTicketFailAction());
    yield put(setLoadingAction({onLoading: false}));
  }
}
function* changeTicketRequest(action: any) {
  const {ticket} = action.payload;
  try {
    yield put(setLoadingAction({onLoading: true}));
    const ticketData = {
      ...ticket,
      initialPrice: ticket?.price,
    };
    yield call(changeTicket, ticket.id, ticketData);
    yield put(setLoadingAction({onLoading: false}));
    // console.log('change respo', response);
    yield put(getTicketsRequestAction(ticket?.eventUid));
  } catch (error) {
    console.log('change ticket error', error);
    yield put(setLoadingAction({onLoading: false}));
  }
}
function* removeTicketRequest(action: any) {
  const {ticket} = action.payload;
  try {
    yield put(setLoadingAction({onLoading: true}));
    yield call(removeTicket, ticket);
    yield put(getTicketsRequestAction(ticket?.eventUid));
    yield put(setLoadingAction({onLoading: false}));
    // console.log('removeTicketRequest respo', response);
  } catch (error) {
    console.log('removeTicketRequest error', error);
    yield put(setLoadingAction({onLoading: false}));
  }
}
function* getTicketsRequest(action: any) {
  const {eventUid} = action.payload;
  try {
    const response = yield call(getTickets, eventUid);
    yield put(getTicketsSuccessAction(response));
    console.log('getTicketsRequest respo', response);
  } catch (error) {
    console.log('getTicketsRequest error', error);
  }
}
function* getPurchasedTicketsRequest() {
  try {
    const response: string[] = yield call(getPurchasedTickets);
    yield put(getPurchasedTicketsSuccessAction(response));
  } catch (error) {
    console.log('purchasedTickets error', error);
    yield put(getPurchasedTicketsFailAction());
  }
}
function* ticketsSaga() {
  yield takeLatest(TICKET.TICKET_CREATE_REQUEST, createTicketRequest);
  yield takeLatest(
    TICKET.CHANGE_INFORMATION_TICKET_REQUEST,
    changeTicketRequest,
  );
  yield takeLatest(TICKET.REMOVE_TICKET_REQUEST, removeTicketRequest);
  yield takeLatest(TICKET.GET_TICKETS_REQUEST, getTicketsRequest);
  yield takeLatest(
    TICKET.GET_PURCHASED_TICKETS_REQUEST,
    getPurchasedTicketsRequest,
  );
}
export default ticketsSaga;
