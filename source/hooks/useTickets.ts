import {useDispatch, useSelector} from 'react-redux';
import {
  addToBasketAction,
  changeTicketRequestAction,
  clearBasketAction,
  createTicketRequestAction,
  getPurchasedTicketsRequestAction,
  getTicketsRequestAction,
  removeTicketRequestAction,
  resetQuantityAction,
} from '../store/actions/ticketActions';
import {
  selectBasket,
  selectLoadingTickets,
  selectPurchasedTickets,
  selectTickets,
} from '../store/selectors/ticketsSelector';

const useTickets = () => {
  const dispatch = useDispatch();
  const ticketsList = useSelector(selectTickets);
  const purchasedTickets = useSelector(selectPurchasedTickets);
  const basket = useSelector(selectBasket);
  const onLoading = useSelector(selectLoadingTickets);

  const items = basket?.map((item: any) => item);
  const totalToBuy = items
    .map((item: any) => item.quantityToBuy * item.price)
    .reduce((total: any, idx: any) => total + idx, 0);
  const createTicket = (ticket: any) => {
    dispatch(createTicketRequestAction(ticket));
  };
  const changeTicket = (ticket: any) => {
    dispatch(changeTicketRequestAction(ticket));
  };
  const removeTicket = (ticket: any) => {
    dispatch(removeTicketRequestAction(ticket));
  };
  const addToBasket = (ticket: any) => {
    dispatch(addToBasketAction(ticket));
  };
  const resetQuantity = (ticket: any) => {
    dispatch(resetQuantityAction(ticket));
  };
  const currentQuantity = (ticket: any) => {
    const count = basket.find(
      (item: any) => item.id === ticket.id,
    )?.quantityToBuy;
    return count ?? 0;
  };
  const clearBasket = () => {
    dispatch(clearBasketAction());
  };
  const getTickets = (eventUid: string) => {
    dispatch(getTicketsRequestAction(eventUid));
  };
  const getPurchasedTickets = () => {
    dispatch(getPurchasedTicketsRequestAction());
  };
  return {
    createTicket,
    changeTicket,
    removeTicket,
    ticketsList,
    addToBasket,
    currentQuantity,
    resetQuantity,
    clearBasket,
    totalToBuy,
    getTickets,
    items,
    getPurchasedTickets,
    purchasedTickets,
    onLoading,
  };
};
export default useTickets;
