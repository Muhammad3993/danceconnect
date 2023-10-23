import {BASKET_TICKET, TICKET} from '../actionTypes/ticketActionTypes';
import ticketsINitialState from '../initialState/ticketsINitialState';

export type ticketStateAction = {
  type: string;
  payload: {
    onLoading: false;
    tickets: [];
    ticket: any;
    createdTicket: any;
    basket: [];
    eventUid: string;
    purchasedTickets: [];
  };
};

export default (state = ticketsINitialState, action: ticketStateAction) => {
  switch (action.type) {
    case TICKET.TICKET_CREATE_REQUEST:
      // const newArr: string[] = [];
      return {
        ...state,
        ticket: action.payload.ticket,
        // tickets: [...state.tickets, action.payload.ticket],
      };
    case TICKET.TICKET_CREATE_SUCCESS:
      return {
        ...state,
        ticket: {},
        createdTicket: action.payload.createdTicket,
      };
    case TICKET.CHANGE_INFORMATION_TICKET_REQUEST:
      return {
        ...state,
        ticket: action.payload.ticket,
      };
    case TICKET.CHANGE_INFORMATION_TICKET_SUCCESS:
      return {
        ...state,
        ticket: {},
        createdTicket: action.payload.createdTicket,
      };
    case TICKET.REMOVE_TICKET_REQUEST:
      // const items = state.tickets;
      // items.filter(item => item !== action.payload.ticket);
      // console.log('imte', state.tickets?.filter(item => item !== action.payload.ticket));
      return {
        ...state,
        ticket: action.payload.ticket,
        // tickets: state.tickets?.filter(item => item !== action.payload.ticket),
        // tickets: action.payload.tickets.filter(
        //   items => items !== action.payload.ticket,
        // ),
      };
    case TICKET.GET_TICKETS_REQUEST:
      return {
        ...state,
        onLoading: true,
        eventUid: action.payload.eventUid,
      };
    case TICKET.GET_TICKETS_SUCCESS:
      return {
        ...state,
        tickets: action.payload.tickets,
        onLoading: false,
      };
    case BASKET_TICKET.ADD_TO_BASKET_TICKET:
      const currentQuantity =
        state.basket?.find(
          (ticket: {id: string}) => ticket.id === action.payload.ticket.id,
        )?.quantityToBuy ?? 0;

      const newQuantity = currentQuantity + 1;
      const newItem = {
        ...action.payload.ticket,
        quantityToBuy: newQuantity,
      };
      const idx = state?.basket?.findIndex(
        (item: {id: string}) => item?.id === action.payload.ticket.id,
      );
      if (idx >= 0) {
        const newItemsArray: any[] = [...state?.basket];
        newItemsArray[idx] = newItem;

        return {
          ...state,
          basket: [...newItemsArray],
        };
      } else {
        return {
          ...state,
          basket: [...state?.basket, newItem],
        };
      }
    case BASKET_TICKET.RESET_QUANTITY:
      const currentQ =
        state.basket?.find(
          (ticket: {id: string}) => ticket.id === action.payload.ticket.id,
        )?.quantityToBuy ?? 0;
      const newQ = currentQ - 1;
      const itemIdx = state?.basket?.findIndex(
        (item: {id: string}) => item?.id === action.payload.ticket.id,
      );
      // console.log('qu', currentQ, newQ);
      // const item = {
      //   ...action.payload.ticket,
      //   quantityToBuy: newQ,
      // };

      if (newQ < 1) {
        const cleanedArray = state.basket?.filter(
          (ticket: {id: string}) => ticket.id !== action.payload.ticket.id,
        );
        // console.log('cleanedArray', cleanedArray);
        return {
          ...state,
          basket: cleanedArray,
        };
      }
      if (itemIdx >= 0) {
        const newItemsArray: any = [...state.basket];
        newItemsArray[itemIdx] = {
          ...newItemsArray[itemIdx],
          quantityToBuy: newQ,
        };
        return {
          ...state,
          basket: [...newItemsArray],
        };
      } else {
        return {...state};
      }
    case BASKET_TICKET.CLEAR_BASKET:
      return {
        ...state,
        basket: [],
      };
    case TICKET.GET_PURCHASED_TICKETS_REQUEST:
      return {
        ...state,
        purchasedTickets: [],
      };
    case TICKET.GET_PURCHASED_TICKETS_SUCCESS:
      return {
        ...state,
        purchasedTickets: action.payload.purchasedTickets,
      };
    case TICKET.GET_PURCHASED_TICKETS_FAIL:
      return {
        ...state,
        purchasedTickets: [],
      };
    case TICKET.CLEAR_PURCHASED_TICKETS_VALUE:
      return {
        ...state,
        purchasedTickets: [],
      };
    default:
      return state;
  }
};
