import {useDispatch, useSelector} from 'react-redux';

import {
  getIsFollowEvent,
  selectEventById,
  selectLoadingEventById,
} from '../store/selectors/eventsSelector';
import {
  getEventByIdRequestAction,
  removeEventRequestAction,
} from '../store/actions/eventActions';

export const useEventById = (id: string) => {
  const dispatch = useDispatch();
  const eventData = useSelector(selectEventById);
  const loadingById = useSelector(selectLoadingEventById);

  const isFollowed = useSelector(getIsFollowEvent);

  const getEvent = () => {
    dispatch(getEventByIdRequestAction({eventUid: id}));
  };

  const remove = () => {
    // console.log('attendEvent', eventUid);
    dispatch(
      removeEventRequestAction({
        eventUid: id,
      }),
    );
  };

  return {
    getEvent,
    eventData,
    loadingById,
    remove,
    isFollowed,
  };
};
