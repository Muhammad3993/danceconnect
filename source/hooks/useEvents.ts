import {useDispatch, useSelector} from 'react-redux';
import {
  changeInformationEventRequestAction,
  createEventChangeValue,
  endAttendEventRequestAction,
  eventParams,
  getEventByIdClearAction,
  getEventByIdCommunityRequestAction,
  getEventsRequestAction,
  getEventsSuccessAction,
  getMainEventsRequestAction,
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
  selectLoadingEventsPgn,
  selectLoadingManagingEvents,
  selectLoadingattendEvent,
  selectMainEvents,
  selectManagingEvents,
  selectManagingEventsAndPassed,
  selectPassedEvents,
  selectPersonalEvents,
  selectPrevLimit,
  selectPrevOffset,
  selectTotalCount,
  selectUpcomingEvents,
  selectUpcomingEventsWithUserUid,
  selectWithManagingEvents,
} from '../store/selectors/eventsSelector';
import {selectUserUid} from '../store/selectors/registrationSelector';

const useEvents = () => {
  const dispatch = useDispatch();
  const personalEvents = useSelector(selectPersonalEvents);
  const eventList = useSelector(selectEventList) ?? [];
  const eventsDataByCommunityId = useSelector(selectEventByIdCommunity);
  const loadingEvents = useSelector(selectLoadingEvents);
  const loadingEventsPagination = useSelector(selectLoadingEventsPgn);
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
  const upcomingEvents = useSelector(selectUpcomingEvents);
  const passingEvents = selectPassedEvents();
  const managingEventsWithPassed = selectWithManagingEvents(userId);
  const attendingEventsForCommunity =
    eventsDataByCommunityId?.filter(
      (item: any) =>
        item?.attendedPeople?.length > 0 &&
        item?.attendedPeople?.find((user: any) => user.userUid === userId),
    ) ?? [];

  const prevLimit = useSelector(selectPrevLimit);
  const prevOffset = useSelector(selectPrevOffset);
  const totalCount = useSelector(selectTotalCount);

  const getEvents = () => {
    dispatch(getEventsRequestAction({limit: prevLimit, offset: prevOffset}));
  };
  const setEventLimit = () => {
    if (totalCount <= prevLimit) {
      return;
    } else {
      dispatch(
        setLimit({
          limit: prevLimit + prevLimit,
          offset: 1,
        }),
      );
    }
  };
  const setDefaultEventLimit = () => {
    dispatch(setLimit({limit: 20, offset: 1}));
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
    isRecurrent,
    recurrentTemplate,
    recurrentEndDate,
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
        isRecurrent: isRecurrent,
        recurrentTemplate: recurrentTemplate,
        recurrentEndDate: recurrentEndDate,
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
  const changeInformation = (data: any) => {
    dispatch(changeInformationEventRequestAction(data));
  };

  const getPersonalEvents = () => {
    dispatch(getPersonalEventsRequestAction());
  };
  const changeCreatedValue = () => {
    dispatch(createEventChangeValue());
  };

  const mainEvents = useSelector(selectMainEvents);
  const getMainEvents = () => {
    dispatch(getMainEventsRequestAction());
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
    getMainEvents,
    mainEvents,
    prevLimit,
    loadingEventsPagination,
    totalCount,
  };
};
export default useEvents;

//TODO remove personal events and everything related to them
