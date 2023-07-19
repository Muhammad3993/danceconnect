import {useDispatch, useSelector} from 'react-redux';
import {
  selectCurrentCity,
  selectDanceStyles,
  selectEventTypes,
  selectLoading,
} from '../store/selectors/appStateSelector';
import {
  choosedCityAction,
  getDanceStylesAction,
  setLoadingAction,
} from '../store/actions/appStateActions';
import {useEffect} from 'react';
import {getUserCountry} from '../store/selectors/profileSelector';

const useAppStateHook = () => {
  const dispatch = useDispatch();
  const onLoading = useSelector(selectLoading);
  const currentCity = useSelector(selectCurrentCity);
  const userCountry = useSelector(getUserCountry);
  const danceStyles = useSelector(selectDanceStyles);
  const eventTypes = useSelector(selectEventTypes);

  useEffect(() => {
    if (!currentCity?.length) {
      dispatch(choosedCityAction({currentCity: userCountry}));
    }
  }, []);

  const onChoosedCity = (city: object) => {
    let cityStr = '';
    if (city?.structured_formatting) {
      cityStr =
        city?.structured_formatting?.main_text +
        ', ' +
        city?.terms[1]?.value;
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

  return {
    onLoading,
    setLoading,
    currentCity,
    onChoosedCity,
    danceStyles,
    eventTypes,
    getDanceStyles,
  };
};
export default useAppStateHook;
