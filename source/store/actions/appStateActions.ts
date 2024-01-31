import {APP_STATE} from '../actionTypes/appStateActionTypes';

type appStateParams = {
  onLoading?: boolean;
  currentCity?: string;
  danceStyles?: string[];
  eventTypes?: string[];
  countries?: string[];
  currentCountry?: any;
  stripe_key?: string;
  regions?: string[];

  isVisible?: boolean;
  errorMessage?: string;

  language?: string;

  ticket_percent?: number;
  ticket_fix_price?: number;
};

export const setLoadingAction = ({onLoading}: appStateParams) => ({
  type: APP_STATE.SET_LOADING,
  payload: {
    onLoading: onLoading,
  },
});
export const choosedCityAction = ({currentCity}: appStateParams) => ({
  type: APP_STATE.SET_CITY,
  payload: {
    currentCity: currentCity,
  },
});
export const getDanceStylesAction = () => ({
  type: APP_STATE.GET_DANCE_STYLES,
});
export const setDanceStylesAction = ({danceStyles}: appStateParams) => ({
  type: APP_STATE.SET_DANCE_STYLES,
  payload: {
    danceStyles: danceStyles,
  },
});
export const getEventTypesAction = () => ({
  type: APP_STATE.GET_EVENT_TYPES,
});
export const setEventTypesAction = ({eventTypes}: appStateParams) => ({
  type: APP_STATE.SET_EVENT_TYPES,
  payload: {
    eventTypes: eventTypes,
  },
});
export const setCountriesAction = ({countries}: appStateParams) => ({
  type: APP_STATE.SET_COUNTRIES,
  payload: {
    countries: countries,
  },
});

export const setRegionsAction = ({regions}: appStateParams) => ({
  type: APP_STATE.SET_REGIONS,
  payload: {
    regions: regions,
  },
});
export const setNoticeVisible = ({isVisible}: appStateParams) => ({
  type: APP_STATE.SET_ERROR_NOTICE_VISIBLE,
  payload: {
    isVisible: isVisible,
  },
});
export const setNoticeMessage = ({errorMessage}: appStateParams) => ({
  type: APP_STATE.SET_ERROR_NOTICE_MESSAGE,
  payload: {
    errorMessage: errorMessage,
  },
});
export const setCurrentCountryAction = ({currentCountry}: appStateParams) => ({
  type: APP_STATE.SET_CURRENT_COUNTRY,
  payload: {
    currentCountry: currentCountry,
  },
});

export const getStripeKeyAction = () => ({
  type: APP_STATE.GET_STRIPE_KEY,
});
export const setStripeKeyAction = ({stripe_key}: appStateParams) => ({
  type: APP_STATE.SET_STRIPE_KEY,
  payload: {
    stripe_key: stripe_key,
  },
});

export const setLanguage = (language: appStateParams) => ({
  type: APP_STATE.SET_CURRENT_LANGUAGE,
  payload: language,
});

export const getTicketPercentAction = () => ({
  type: APP_STATE.GET_TICKET_PERCENT,
});
export const setTicketPercentAction = ({
  ticket_percent,
  ticket_fix_price,
}: appStateParams) => ({
  type: APP_STATE.SET_TICKET_PERCENT,
  payload: {
    ticket_percent: ticket_percent,
    ticket_fix_price: ticket_fix_price,
  },
});

export const sendNotificationRequestAction = (data: any) => ({
  type: APP_STATE.SEND_NOTIFICATION,
  payload: {
    data: data,
  },
});
