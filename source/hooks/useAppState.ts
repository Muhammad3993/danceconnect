import {useDispatch, useSelector} from 'react-redux';
import {
  selectCurrentCity,
  selectLoading,
} from '../store/selectors/appStateSelector';
import {
  choosedCityAction,
  setLoadingAction,
} from '../store/actions/appStateActions';
import {useEffect} from 'react';
import {getUserCountry} from '../store/selectors/profileSelector';

const useAppStateHook = () => {
  const dispatch = useDispatch();
  const onLoading = useSelector(selectLoading);
  const currentCity = useSelector(selectCurrentCity);
  const userCountry = useSelector(getUserCountry);

  useEffect(() => {
    if (!currentCity?.length) {
      dispatch(choosedCityAction({currentCity: userCountry}));
    }
  }, []);

  const onChoosedCity = (city: object) => {
    const cityStr =
      city?.structured_formatting?.main_text + ', ' + city?.terms[1]?.value;
    dispatch(choosedCityAction({currentCity: cityStr}));
  };
  const setLoading = (load: boolean) => {
    dispatch(setLoadingAction({onLoading: load}));
  };
  return {
    onLoading,
    setLoading,
    currentCity,
    onChoosedCity,
  };
};
export default useAppStateHook;
