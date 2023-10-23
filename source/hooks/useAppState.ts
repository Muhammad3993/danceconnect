import {useDispatch, useSelector} from 'react-redux';
import {
  selectCountries,
  selectCurrentCity,
  selectCurrentCountry,
  selectDanceStyles,
  selectEventTypes,
  selectIsVisibleNoticeError,
  selectLoading,
  selectNoticeErrorMessage,
} from '../store/selectors/appStateSelector';
import {
  choosedCityAction,
  getDanceStylesAction,
  setCurrentCountryAction,
  setLoadingAction,
  setNoticeMessage,
  setNoticeVisible,
} from '../store/actions/appStateActions';
import {useEffect} from 'react';
import {getUserCountry} from '../store/selectors/profileSelector';

const useAppStateHook = () => {
  const dispatch = useDispatch();
  const onLoading = useSelector(selectLoading);
  const currentCity = useSelector(selectCurrentCity);
  const userCountry = useSelector(getUserCountry);
  const currentCountry = useSelector(selectCurrentCountry);

  const danceStyles = useSelector(selectDanceStyles);
  const countries = useSelector(selectCountries);
  const eventTypes = useSelector(selectEventTypes);

  const errorMessage = useSelector(selectNoticeErrorMessage);
  const isVisible = useSelector(selectIsVisibleNoticeError);

  useEffect(() => {
    if (!currentCity?.length) {
      dispatch(choosedCityAction({currentCity: userCountry}));
    }
  }, []);

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
  };
};
export default useAppStateHook;
