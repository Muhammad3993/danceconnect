import {IRootState} from '..';

export const selectTickets = (state: IRootState) =>
  state?.tickets?.tickets ?? [];
export const selectBasket = (state: IRootState) => state?.tickets?.basket ?? [];
export const selectPurchasedTickets = (state: IRootState) =>
  state.tickets.purchasedTickets ?? [];

export const selectLoadingTickets = (state: IRootState) =>
  state.tickets.onLoading ?? false;
