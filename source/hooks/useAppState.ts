import {useDispatch, useSelector} from 'react-redux';
import {
  selectCountries,
  selectCurrentCity,
  selectCurrentCountry,
  selectCurrentLanguageCode,
  selectDanceStyles,
  selectEventTypes,
  selectIsChangeLanguage,
  selectIsDevMode,
  selectIsVisibleNoticeError,
  selectLoading,
  selectNoticeErrorMessage,
  selectRegions,
  selectStripeKey,
  selectTicketPriceFix,
  selectTicketPricePercent,
  selectTypeCommunity,
} from '../store/selectors/appStateSelector';
import {
  choosedCityAction,
  getChangeLanguageAction,
  getDanceStylesAction,
  getStripeKeyAction,
  getTicketPercentAction,
  getTypeCommunityAction,
  sendNotificationRequestAction,
  setCurrentCountryAction,
  setDevelopmentModeAction,
  setLanguage,
  setLoadingAction,
  setNoticeMessage,
  setNoticeVisible,
} from '../store/actions/appStateActions';
import {useEffect} from 'react';
import {getUserCountry} from '../store/selectors/profileSelector';
import i18n from '../i18n/i118n';
import {LayoutAnimation} from 'react-native';

const useAppStateHook = () => {
  const dispatch = useDispatch();
  const onLoading = useSelector(selectLoading);
  const currentCity = useSelector(selectCurrentCity);
  const userCountry = useSelector(getUserCountry);
  const currentCountry = useSelector(selectCurrentCountry);

  const STRIPE_PUBLIC_KEY = useSelector(selectStripeKey);

  const danceStyles = useSelector(selectDanceStyles);
  const countries = useSelector(selectCountries);
  const regions = useSelector(selectRegions);
  const eventTypes = useSelector(selectEventTypes);

  const errorMessage = useSelector(selectNoticeErrorMessage);
  const isVisible = useSelector(selectIsVisibleNoticeError);

  const crntLgCode = useSelector(selectCurrentLanguageCode);

  const priceFix = useSelector(selectTicketPriceFix);
  const pricePercent = useSelector(selectTicketPricePercent);

  const isChangeLanguage = useSelector(selectIsChangeLanguage);
  const typeCommunity = useSelector(selectTypeCommunity);

  const isDev = useSelector(selectIsDevMode);

  useEffect(() => {
    if (!currentCity?.length) {
      // const worldwide = regions.find(i => i.name === 'Worldwide');
      dispatch(choosedCityAction({currentCity: userCountry})); //TODO worldwide = worldwide.name
    }
  }, []);

  const getStripeKey = () => {
    dispatch(getStripeKeyAction());
  };
  const getTicketPricePercent = () => {
    dispatch(getTicketPercentAction());
  };

  const getCommunityType = () => {
    dispatch(getTypeCommunityAction());
  };
  const getIsChangeLanguage = () => {
    dispatch(getChangeLanguageAction());
  };

  const onChoosedCity = (city: object) => {
    let cityStr = '';
    if (city?.structured_formatting) {
      cityStr =
        city?.structured_formatting?.main_text + ', ' + city?.terms[1]?.value;
    } else {
      cityStr = city;
    }
    dispatch(choosedCityAction({currentCity: cityStr}));
  };
  const setLoading = (load: boolean) => {
    dispatch(setLoadingAction({onLoading: load}));
  };
  const getDanceStyles = () => {
    dispatch(getDanceStylesAction());
  };

  const setVisibleNotice = (isVisibleNotice: boolean) => {
    dispatch(setNoticeVisible({isVisible: isVisibleNotice}));
  };

  const setMessageNotice = (message: string) => {
    dispatch(setNoticeMessage({errorMessage: message}));
  };
  const setCurrentCountry = (country: any) => {
    dispatch(setCurrentCountryAction({currentCountry: country}));
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    dispatch(setLanguage({language: language}));
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  };

  const sendMessageAction = (data: any) => {
    dispatch(sendNotificationRequestAction(data));
  };

  const setDevMode = (isDevCheck: boolean) => {
    dispatch(setDevelopmentModeAction({isDev: !isDevCheck}));
  };
  return {
    onLoading,
    setLoading,
    currentCity,
    onChoosedCity,
    danceStyles,
    eventTypes,
    getDanceStyles,
    countries,
    errorMessage,
    isVisible,
    setVisibleNotice,
    setMessageNotice,
    setCurrentCountry,
    currentCountry,
    userCountry,
    STRIPE_PUBLIC_KEY,
    getStripeKey,
    changeLanguage,
    crntLgCode,
    priceFix,
    pricePercent,
    getTicketPricePercent,
    regions,
    sendMessageAction,
    getCommunityType,
    getIsChangeLanguage,
    isChangeLanguage,
    typeCommunity,
    isDev,
    setDevMode,
  };
};
export default useAppStateHook;
