import {useDispatch, useSelector} from 'react-redux';
import {
  changeInformationEventRequestAction,
  endAttendEventRequestAction,
  eventParams,
  followingParams,
  getEventByIdClearAction,
  getEventByIdCommunityRequestAction,
  getEventsRequestAction,
  getEventsSuccessAction,
  getManagingEventsRequestAction,
  setLimit,
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
        price,
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
    setSocketEvents,
    onClearEventDataById,
    setEventLimit,
    setDefaultEventLimit,
  };
};
export default useEvents;
