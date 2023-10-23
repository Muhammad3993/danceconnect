import {BASKET_TICKET, TICKET} from '../actionTypes/ticketActionTypes';

export const getTicketsRequestAction = (eventUid: string) => ({
  type: TICKET.GET_TICKETS_REQUEST,
  payload: {
    eventUid: eventUid,
  },
});
export const getTicketsSuccessAction = (tickets: any) => ({
  type: TICKET.GET_TICKETS_SUCCESS,
  payload: {
    tickets: tickets,
  },
});
export const createTicketRequestAction = (ticket: any) => ({
  type: TICKET.TICKET_CREATE_REQUEST,
  payload: {
    ticket: ticket,
  },
});
export const createTicketSuccessAction = (createdTicket: any) => ({
  type: TICKET.TICKET_CREATE_SUCCESS,
  payload: {
    createdTicket: createdTicket,
  },
});
export const createTicketFailAction = () => ({
  type: TICKET.TICKET_CREATE_FAIL,
});

export const removeTicketRequestAction = (ticket: any) => ({
  type: TICKET.REMOVE_TICKET_REQUEST,
  payload: {
    ticket: ticket,
  },
});
export const removeTicketSuccessAction = () => ({
  type: TICKET.REMOVE_TICKET_SUCCESS,
});
export const removeTicketFailAction = () => ({
  type: TICKET.REMOVE_TICKETY_FAIL,
});

export const changeTicketRequestAction = (ticket: any) => ({
  type: TICKET.CHANGE_INFORMATION_TICKET_REQUEST,
  payload: {
    ticket: ticket,
  },
});
export const changeTicketSuccessAction = () => ({
  type: TICKET.CHANGE_INFORMATION_TICKET_SUCCESS,
});
export const changeTicketFailtAction = () => ({
  type: TICKET.CHANGE_INFORMATION_TICKET_FAIL,
});

export const createTicketsAfterEventRequestAction = () => ({
  type: TICKET.CREATE_TICKET_AFTER_EVENT_REQUEST,
});
export const createTicketsAfterEventSuccessAction = () => ({
  type: TICKET.CREATE_TICKET_AFTER_EVENT_SUCCESS,
});
export const createTicketsAfterEventFailAction = () => ({
  type: TICKET.CREATE_TICKET_AFTER_EVENT_FAIL,
});

export const addToBasketAction = (ticket: any) => ({
  type: BASKET_TICKET.ADD_TO_BASKET_TICKET,
  payload: {
    ticket: ticket,
  },
});

export const resetQuantityAction = (ticket: any) => ({
  type: BASKET_TICKET.RESET_QUANTITY,
  payload: {
    ticket: ticket,
  },
});
export const clearBasketAction = () => ({
  type: BASKET_TICKET.CLEAR_BASKET,
});
export const getPurchasedTicketsRequestAction = () => ({
  type: TICKET.GET_PURCHASED_TICKETS_REQUEST,
});
export const getPurchasedTicketsSuccessAction = (purchasedTickets: any) => ({
  type: TICKET.GET_PURCHASED_TICKETS_SUCCESS,
  payload: {
    purchasedTickets: purchasedTickets,
  },
});
export const getPurchasedTicketsFailAction = () => ({
  type: TICKET.GET_PURCHASED_TICKETS_FAIL,
});
export const clearPurchasedTicketsValue = () => ({
  type: TICKET.CLEAR_PURCHASED_TICKETS_VALUE,
});
