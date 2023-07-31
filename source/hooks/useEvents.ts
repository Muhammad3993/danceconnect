import {useDispatch, useSelector} from 'react-redux';
import {
  changeInformationEventRequestAction,
  endAttendEventRequestAction,
  eventParams,
  followingParams,
  getEventByIdCommunityRequestAction,
  getEventsRequestAction,
  getManagingEventsRequestAction,
  startAttendEventRequestAction,
} from '../store/actions/eventActions';
import {createEventRequestAction} from '../store/actions/eventActions';
import {
  selectAttentingEvents,
  selectEventByIdCommunity,
  selectEventList,
  selectIsSaveChanges,
  selectLoadingChangeInformationEvent,
  selectLoadingEvents,
  selectLoadingManagingEvents,
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
  const eventsDataByCommunityId = useSelector(selectEventByIdCommunity);
  const loadingEvents = useSelector(selectLoadingEvents);
  const loadingAttend = useSelector(selectLoadingattendEvent);
  const userId = useSelector(selectUserUid);
  const loadingWithChangeInformation = useSelector(
    selectLoadingChangeInformationEvent,
  );
  const isSaveChanges = useSelector(selectIsSaveChanges);

  const managingEvents = useSelector(selectManagingEvents);
  const isLoadManaging = useSelector(selectLoadingManagingEvents);
  const getManagingEvents = () => {
    dispatch(getManagingEventsRequestAction());
  };
  const attentingsEvents = selectAttentingEvents(userId);
  const attendEventWithUserUid = selectUpcomingEventsWithUserUid(userId);
  const upcomingEvents = selectUpcomingEvents();
  const passingEvents = selectPassedEvents();
  const managingEventsWithPassed = selectWithManagingEvents(userId);
  const {individualStyles} = useProfile();
  const maybeEvents = upcomingEvents?.filter(
    i =>
      i?.creatorUid !== userId &&
      i?.attendedPeople?.find((user: any) => user.userUid !== userId) &&
      i?.categories?.some(st => individualStyles?.includes(st)),
  );

  const attendingEventsForCommunity =
    eventsDataByCommunityId?.filter(
      (item: any) =>
        item?.attendedPeople?.length > 0 &&
        item?.attendedPeople?.find((user: any) => user.userUid === userId),
    ) ?? [];
  const getEvents = () => {
    dispatch(getEventsRequestAction());
  };

  const getEventByIdCommunity = (uid: string) => {
    dispatch(getEventByIdCommunityRequestAction({eventUid: uid}));
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
  const attendEvent = (eventUid: string) => {
    dispatch(
      startAttendEventRequestAction({
        eventUid: eventUid,
      }),
    );
  };
  const unAttendEvent = (eventUid: string) => {
    dispatch(
      endAttendEventRequestAction({
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
    getEventByIdCommunity,
    eventsDataByCommunityId,
    loadingEvents,
    loadingAttend,
    attendEvent,
    unAttendEvent,
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
    managingEventsWithPassed,
    isLoadManaging,
    getManagingEvents,
  };
};
export default useEvents;
