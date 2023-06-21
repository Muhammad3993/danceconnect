import {useDispatch, useSelector} from 'react-redux';
import {selectLoading} from '../store/selectors/appStateSelector';
import {setLoadingAction} from '../store/actions/appStateActions';

const useAppStateHook = () => {
  const dispatch = useDispatch();
  const onLoading = useSelector(selectLoading);
  const setLoading = (load: boolean) => {
    dispatch(setLoadingAction({onLoading: load}));
  };
  return {
    onLoading,
    setLoading,
  };
};
export default useAppStateHook;
