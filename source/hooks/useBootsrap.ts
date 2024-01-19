import {useDispatch, useSelector} from 'react-redux';
import {appInitAction} from '../store/actions/bootstrapAction';
import {selectIsBootstraped} from '../store/selectors/bootsrapSelector';

const useBootsrap = () => {
  const dispatch = useDispatch();
  const isBootstraped = useSelector(selectIsBootstraped);

  const init = () => {
    dispatch(appInitAction());
  };

  return {isBootstraped, init};
};
export default useBootsrap;
