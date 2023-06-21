import {useDispatch, useSelector} from 'react-redux';
import {
  changeInformationEventRequestAction,
  eventParams,
  followingParams,
  getEventByIdRequestAction,
  getEventsRequestAction,
  startAttendEventRequestAction,
} from '../store/actions/eventActions';
import {createEventRequestAction} from '../store/actions/eventActions';
import {
  selectAttentingEvents,
  selectEventByIdData,
  selectEventList,
  selectIsSaveChanges,
  selectLoadingChangeInformationEvent,
  selectLoadingEvents,
  selectLoadingattendEvent,
  selectManagingEvents,
  selectPassedEvents,
  selectUpcomingEvents,
  selectUpcomingEventsWithUserUid,
  selectWithManagingEvents,
} from '../store/selectors/eventsSelector';
import {selectUserUid} from '../store/selectors/registrationSelector';
import {useProfile} from './useProfile';

const useEvents = () => {
  const dispatch = useDispatch();
  const eventList = useSelector(selectEventList) ?? [];
  const eventsDataById = useSelector(selectEventByIdData);
  const loadingEvents = useSelector(selectLoadingEvents);
  const loadingAttend = useSelector(selectLoadingattendEvent);
  const userId = useSelector(selectUserUid);
  const loadingWithChangeInformation = useSelector(
    selectLoadingChangeInformationEvent,
  );
  const isSaveChanges = useSelector(selectIsSaveChanges);

  const managingEvents = selectManagingEvents(userId);
  const attentingsEvents = selectAttentingEvents(userId);
  const attendEventWithUserUid = selectUpcomingEventsWithUserUid(userId);
  const upcomingEvents = selectUpcomingEvents();
  const passingEvents = selectPassedEvents();
  const managingEventsWithPassed = useSelector(selectWithManagingEvents);
  const {individualStyles} = useProfile();
  const maybeEvents = upcomingEvents?.filter(
    i =>
      i?.creatorUid !== userId &&
      i?.attendedPeople?.find((user: any) => user.userUid !== userId) &&
      i?.categories?.some(st => individualStyles?.includes(st)),
  );

  const attendingEventsForCommunity =
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
    typeEvent,
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
        typeEvent: typeEvent,
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
  };

  const changeInformation = ({
    name,
    description,
    // country,
    location,
    categories,
    images,
    eventDate,
    place,
    eventUid,
    typeEvent,
  }: eventParams) => {
    dispatch(
      changeInformationEventRequestAction({
        name,
        description,
        // country,
        location,
        categories,
        images,
        eventDate,
        place,
        eventUid,
        typeEvent,
      }),
    );
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
    attendingEventsForCommunity,
    changeInformation,
    loadingWithChangeInformation,
    isSaveChanges,
    managingEvents,
    attentingsEvents,
    upcomingEvents,
    passingEvents,
    attendEventWithUserUid,
    maybeEvents,
    managingEventsWithPassed
  };
};
export default useEvents;
