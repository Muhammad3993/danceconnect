import {useDispatch, useSelector} from 'react-redux';
import {
  changeInformationEventRequestAction,
  createEventChangeValue,
  endAttendEventRequestAction,
  eventParams,
  followingParams,
  getEventByIdClearAction,
  getEventByIdCommunityRequestAction,
  getEventsRequestAction,
  getEventsSuccessAction,
  getManagingEventsRequestAction,
  getPersonalEventsRequestAction,
  setLimit,
  startAttendEventRequestAction,
} from '../store/actions/eventActions';
import {createEventRequestAction} from '../store/actions/eventActions';
import {
  getPreCreateEvent,
  selectAttentingEvents,
  selectEventByIdCommunity,
  selectEventList,
  selectIsCreatedEvent,
  selectIsSaveChanges,
  selectLoadingChangeInformationEvent,
  selectLoadingEvents,
  selectLoadingManagingEvents,
  selectLoadingattendEvent,
  selectManagingEvents,
  selectManagingEventsAndPassed,
  selectPassedEvents,
  selectPersonalEvents,
  selectPrevLimit,
  selectPrevOffset,
  selectUpcomingEvents,
  selectUpcomingEventsWithUserUid,
  selectWithManagingEvents,
} from '../store/selectors/eventsSelector';
import {selectUserUid} from '../store/selectors/registrationSelector';
import {useProfile} from './useProfile';

const useEvents = () => {
  const dispatch = useDispatch();
  const personalEvents = useSelector(selectPersonalEvents);
  const eventList = useSelector(selectEventList) ?? [];
  const eventsDataByCommunityId = useSelector(selectEventByIdCommunity);
  const loadingEvents = useSelector(selectLoadingEvents);
  const loadingAttend = useSelector(selectLoadingattendEvent);
  const userId = useSelector(selectUserUid);
  const loadingWithChangeInformation = useSelector(
    selectLoadingChangeInformationEvent,
  );
  const isSaveChanges = useSelector(selectIsSaveChanges);
  const isCreatedEvent = useSelector(selectIsCreatedEvent);

  const managingEvents = useSelector(selectManagingEvents);
  const managingEventsAndPassed = useSelector(selectManagingEventsAndPassed);
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

  const prevLimit = useSelector(selectPrevLimit);
  const prevOffset = useSelector(selectPrevOffset);
  const getEvents = () => {
    dispatch(getEventsRequestAction({limit: prevLimit, offset: prevOffset}));
  };
  const setEventLimit = () => {
    dispatch(
      setLimit({limit: prevLimit + prevLimit, offset: prevOffset + prevLimit}),
    );
  };
  const setDefaultEventLimit = () => {
    dispatch(setLimit({limit: 2, offset: 0}));
  };
  const getEventByIdCommunity = (uid: string) => {
    dispatch(getEventByIdCommunityRequestAction({eventUid: uid}));
  };

  const preCreatedEvent = useSelector(getPreCreateEvent);
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
    price,
    type,
    inAppTickets,
    externalLink,
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
        price: price,
        type: type,
        inAppTickets: inAppTickets,
        externalLink: externalLink,
      }),
    );
  };

  const setSocketEvents = (data: string[]) => {
    dispatch(getEventsSuccessAction({eventsList: Object.values(data)}));
  };
  const attendEvent = (eventUid: string) => {
    // console.log('attendEvent', eventUid);
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

  const onClearEventDataById = () => {
    dispatch(getEventByIdClearAction());
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
    price,
    inAppTickets,
    externalLink,
  }: eventParams) => {
    dispatch(
      changeInformationEventRequestAction({
        name: name,
        description: description,
        // country,
        location: location,
        categories: categories,
        images: images,
        eventDate: eventDate,
        place: place,
        eventUid: eventUid,
        typeEvent: typeEvent,
        price: price,
        inAppTickets: inAppTickets,
        externalLink: externalLink,
      }),
    );
  };

  const getPersonalEvents = () => {
    dispatch(getPersonalEventsRequestAction());
  };
  const changeCreatedValue = () => {
    dispatch(createEventChangeValue());
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
    setSocketEvents,
    onClearEventDataById,
    setEventLimit,
    setDefaultEventLimit,
    preCreatedEvent,
    getPersonalEvents,
    personalEvents,
    isCreatedEvent,
    changeCreatedValue,
    managingEventsAndPassed,
  };
};
export default useEvents;
