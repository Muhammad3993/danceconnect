import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import useEvents from '../../../hooks/useEvents';
import sortBy from 'lodash.sortby';
import EventCard from '../../../components/eventCard';
import colors from '../../../utils/colors';
import FiltersBottomForEvents from '../../../components/bottomFiltersEvents';
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import useAppStateHook from '../../../hooks/useAppState';
import SkeletonEventCard from '../../../components/skeleton/eventCard-Skeleton';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import Filters from '../../../components/filters';
const moment = extendMoment(Moment);

type props = {
  eventsSearch: string[];
  searchValue: string;
};
const ManagingTab = ({searchValue, eventsSearch}: props) => {
  const {managingEvents, isLoadManaging, getManagingEvents} = useEvents();
  const lengthEmptyEvents = new Array(3).fill('');
  const {currentCity} = useAppStateHook();
  const lastSymUserCountry = currentCity?.substr(currentCity?.length - 2);
  const {t} = useTranslation();

  useEffect(() => {
    getManagingEvents();
  }, []);
  const [events, setEvents] = useState(managingEvents);
  const [openingFilters, setOpeningFilters] = useState(false);
  const [eventType, setEventType] = useState('All');
  const [eventDate, setEventDate] = useState();

  const [addedStyles, setAddedStyles] = useState<string[]>(
    new Array(0).fill(''),
  );
  const renderEmpty = () => {
    return (
      <RN.View style={styles.emptyContainer}>
        {isLoadManaging &&
          lengthEmptyEvents.map(() => {
            return (
              <>
                <RN.View style={{marginVertical: 8}}>
                  <SkeletonEventCard />
                </RN.View>
              </>
            );
          })}
        {!isLoadManaging && (
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
      setEvents(managingEvents);
    }
  }, [eventsSearch, searchValue]);

  useEffect(() => {
    setEvents(managingEvents);
  }, [currentCity]);

  const onClear = () => {
    // RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setAddedStyles([]);
    setEventType('All');
    setEventDate({start: null, end: null});
    setEvents(managingEvents);
  };
  const onFilter = () => {
    if (addedStyles?.length > 0) {
      const data = events.filter((item: any) =>
        item?.categories?.some((ai: any) => addedStyles.includes(ai)),
      );
      return setEvents(data);
    } else if (eventType !== 'All') {
      const evData = managingEvents?.filter(i => i?.typeEvent === eventType);
      setEvents(evData);
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
      }
    } else {
      setEvents(managingEvents);
    }
  };
  const renderItem = (item: any) => {
    return <EventCard item={item} key={item.id} />;
  };
  const renderFilters = () => {
    return (
      <Filters
        onPressFilters={() => setOpeningFilters(true)}
        title={t('events_found', {count: events.length})}
      />
    );
  };
  const refreshControl = () => {
    return (
      <RefreshControl
        onRefresh={() => {
          onClear();
          getManagingEvents();
        }}
        refreshing={isLoadManaging}
      />
    );
  };
  return (
    <>
      <ScrollView
        refreshControl={refreshControl()}
        showsVerticalScrollIndicator={false}>
        {renderFilters()}
        {events?.length > 0 &&
          sortBy(events, 'eventDate.startDate')?.map((item: any) => {
            return <RN.View>{renderItem(item)}</RN.View>;
          })}
        {!events?.length && renderEmpty()}
        <RN.View style={{paddingBottom: 24}} />
      </ScrollView>
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
export default ManagingTab;
