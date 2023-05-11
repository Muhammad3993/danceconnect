import {useDispatch, useSelector} from 'react-redux';
import {
  eventParams,
  followingParams,
  getEventByIdRequestAction,
  getEventsRequestAction,
  startAttendEventRequestAction,
} from '../store/actions/eventActions';
import {createEventRequestAction} from '../store/actions/eventActions';
import {
  selectEventByIdData,
  selectEventList,
  selectLoadingEvets,
  selectLoadingattendEvent,
} from '../store/selectors/eventsSelector';
import { selectUserUid } from '../store/selectors/registrationSelector';

const useEvents = () => {
  const dispatch = useDispatch();
  const eventList = useSelector(selectEventList);
  const eventsDataById = useSelector(selectEventByIdData);
  const loadingEvents = useSelector(selectLoadingEvets);
  const loadingAttend = useSelector(selectLoadingattendEvent);
  const userId = useSelector(selectUserUid);
  const attendingEvents =
    eventsDataById?.filter(
      (item: any) =>
        item?.attendedPeople?.length > 0 &&
        item?.attendedPeople?.find((user: any) => user.userUid === userId),
    ) ?? [];
  const getEvents = () => {
    dispatch(getEventsRequestAction());
  };

  const getEventById = (uid: string) => {
    dispatch(getEventByIdRequestAction({eventUid: uid}));
  };
  const createEvent = ({
    name,
    description,
    country,
    location,
    place,
    communityUid,
    // creatorUid,
    categories,
    images,
    eventDate,
  }: eventParams) => {
    dispatch(
      createEventRequestAction({
        name: name,
        description: description,
        country: country,
        location: location,
        place: place,
        communityUid: communityUid,
        // creatorUid: creatorUid,
        categories: categories,
        images: images,
        eventDate: eventDate,
      }),
    );
  };
  const attendEvent = ({communityUid, userUid, eventUid}: followingParams) => {
    dispatch(
      startAttendEventRequestAction({
        communityUid: communityUid,
        userUid: userUid,
        eventUid: eventUid,
      }),
    );
    // dispatch(getCommunityByIdRequestAction({communityUid: communityUid}));
  };
  return {
    createEvent,
    eventList,
    getEvents,
    getEventById,
    eventsDataById,
    loadingEvents,
    loadingAttend,
    attendEvent,
    attendingEvents,
  };
};
export default useEvents;
