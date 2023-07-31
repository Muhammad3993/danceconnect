import {useDispatch, useSelector} from 'react-redux';

import {
  selectEventById,
  selectLoadingEventById,
} from '../store/selectors/eventsSelector';
import {getEventByIdRequestAction} from '../store/actions/eventActions';

export const useEventById = (id: string) => {
  const dispatch = useDispatch();
  const eventData = useSelector(selectEventById);
  const loadingById = useSelector(selectLoadingEventById);

  const getEvent = () => {
    dispatch(getEventByIdRequestAction({eventUid: id}));
  };

  //   const remove = () => {
  //     dispatch(removeCommunityRequestAction({communityUid: id}));
  //   };

  return {
    getEvent,
    eventData,
    loadingById,
  };
};
