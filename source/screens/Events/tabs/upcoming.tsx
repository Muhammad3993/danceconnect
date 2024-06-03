import React, {useEffect, useMemo, useState} from 'react';
import * as RN from 'react-native';
import useEvents from '../../../hooks/useEvents';
import sortBy from 'lodash.sortby';
import EventCard from '../../../components/eventCard';
import colors from '../../../utils/colors';
import {SCREEN_HEIGHT, isAndroid} from '../../../utils/constants';
import FiltersBottomForEvents from '../../../components/bottomFiltersEvents';
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import useAppStateHook from '../../../hooks/useAppState';
import SkeletonEventCard from '../../../components/skeleton/eventCard-Skeleton';
import socket from '../../../api/sockets';
import {
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import Filters from '../../../components/filters';
const moment = extendMoment(Moment);

type props = {
  eventsSearch: string[];
  searchValue: string;
};
const UpcommingTab = ({searchValue, eventsSearch}: props) => {
  const {
    upcomingEvents,
    loadingEvents,
    loadingEventsPagination,
    getEvents,
    setSocketEvents,
    eventList,
    setEventLimit,
    setDefaultEventLimit,
    totalCount,
  } = useEvents();
  const {t} = useTranslation();
  const lengthEmptyEvents = new Array(3).fill('');
  const {currentCity} = useAppStateHook();
  const lastSymUserCountry = currentCity?.substr(currentCity?.length - 2);

  useEffect(() => {
    socket.once('subscribed_event', socket_data => {
      // console.log('subscribed_event socket_data.events?.length', socket_data.events?.length);
      if (socket_data?.events?.length) {
        setSocketEvents(socket_data?.events);
      }
    });
    // console.log('eventData.attendedPeople.length', eventData.attendedPeople.length);
  }, []);
  const [events, setEvents] = useState(upcomingEvents);
  const [openingFilters, setOpeningFilters] = useState(false);
  const [eventType, setEventType] = useState('All');
  const [eventDate, setEventDate] = useState({start: null, end: null});
  const [filtersBorderColor, setFiltersBorderColor] = useState(colors.gray);
  const [totalEvents, setTotalEvents] = useState<number>(totalCount);

  const [addedStyles, setAddedStyles] = useState<string[]>(
    new Array(0).fill(''),
  );
  const onPressFilters = () => {
    setOpeningFilters(true);
  };
  const renderEmpty = () => {
    return (
      <RN.View style={styles.emptyContainer}>
        {loadingEvents &&
          lengthEmptyEvents.map(() => {
            return (
              <>
                <RN.View style={{marginVertical: 8}}>
                  <SkeletonEventCard />
                </RN.View>
              </>
            );
          })}
        {!loadingEvents && !upcomingEvents.length && (
          <RN.Text style={styles.emptyText}>{t('no_events')}</RN.Text>
        )}
      </RN.View>
    );
  };
  useEffect(() => {
    if (searchValue?.length > 0 && eventsSearch) {
      setEvents(eventsSearch);
    }
    if (searchValue.length <= 0) {
      setEvents(events);
    }
  }, [eventsSearch, searchValue]);
  useEffect(() => {
    setEvents(upcomingEvents);
  }, [upcomingEvents, upcomingEvents.length]);

  useEffect(() => {
    onClear();
  }, [currentCity]);

  const onClear = () => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setAddedStyles([]);
    setEventDate({start: null, end: null});
    setEventType('All');
    setFiltersBorderColor(colors.gray);
    setEvents(upcomingEvents);
  };
  const onFilter = () => {
    if (addedStyles?.length > 0) {
      const data = events.filter((item: any) =>
        item?.categories?.some((ai: any) => addedStyles.includes(ai)),
      );
      setEvents(data);
      // setTotalEvents(data.length);
      setFiltersBorderColor(colors.orange);
    } else if (eventType !== 'All') {
      const evData = upcomingEvents?.filter(i => i?.typeEvent === eventType);
      // setTotalEvents(evData.length);
      setEvents(evData);
      setFiltersBorderColor(colors.orange);
    } else if (
      eventDate !== null &&
      eventDate?.start !== null &&
      eventDate?.start?.start !== null
    ) {
      const range = moment().range(eventDate?.start, eventDate?.end);
      if (!eventDate.end) {
        const day = moment(eventDate?.start).format('YYYY-MM-DD');
        const findDate = events?.filter(
          (it: any) => it?.eventDate?.startDate === day,
        );
        setEvents(findDate);
        // setTotalEvents(findDate.length);
      } else {
        const days = Array.from(range.by('days'));
        const dayEntries = days.map((d, index) => {
          const date = d.format('YYYY-MM-DD');
          return date;
        });
        const findDate = events?.filter((it: any) =>
          dayEntries?.includes(it?.eventDate?.startDate),
        );
        setEvents(findDate);
        // setTotalEvents(findDate.length);
      }
      setFiltersBorderColor(colors.orange);
    } else {
      setEvents(upcomingEvents);
      // setTotalEvents(upcomingEvents.length);
      setFiltersBorderColor(colors.gray);
    }
  };
  const renderItem = ({item}: any) => {
    return <EventCard item={item} key={item.id} />;
  };
  const renderFilters = () => {
    return (
      <Filters
        onPressFilters={onPressFilters}
        title={t('events_found', {count: totalEvents})}
      />
    );
  };
  const refreshControl = () => {
    return (
      <RefreshControl
        onRefresh={() => {
          onClear();
          // getEvents();
          setDefaultEventLimit();
        }}
        refreshing={loadingEvents}
      />
    );
  };
  const renderFooter = () => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    if (loadingEventsPagination) {
      return (
        <RN.View style={{marginBottom: 24}}>
          <RN.ActivityIndicator
            animating={loadingEventsPagination}
            color={colors.orange}
            size={'small'}
          />
        </RN.View>
      );
    }
    return <RN.View style={{paddingBottom: 24}} />;
  };
  return (
    <>
      <FlatList
        scrollEventThrottle={100}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl()}
        ListHeaderComponent={renderFilters}
        data={sortBy(events, 'eventDate.startDate')}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        keyExtractor={(_, index) => `key${index}`}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          setEventLimit();
          // loadMore();
        }}
        ListFooterComponent={renderFooter}
      />
      <FiltersBottomForEvents
        onOpening={openingFilters}
        onClose={() => setOpeningFilters(false)}
        selectedStyles={addedStyles}
        setSelectedStyles={setAddedStyles}
        onClear={onClear}
        onFilter={onFilter}
        eventType={eventType}
        setEventType={setEventType}
        eventDate={eventDate}
        setEventDate={setEventDate}
        currentCity={currentCity}
      />
    </>
  );
};
const styles = RN.StyleSheet.create({
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    paddingTop: 14,
    // alignItems: 'center',
  },
  emptyText: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    paddingVertical: 16,
  },
});
export default UpcommingTab;
