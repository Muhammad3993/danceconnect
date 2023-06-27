import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import useEvents from '../../../hooks/useEvents';
import sotrtBy from 'lodash.sortby';
import EventCard from '../../../components/eventCard';
import colors from '../../../utils/colors';
import {SCREEN_HEIGHT} from '../../../utils/constants';
import FiltersBottomForEvents from '../../../components/bottomFiltersEvents';
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import useAppStateHook from '../../../hooks/useAppState';
const moment = extendMoment(Moment);

type props = {
  eventsSearch: string[];
  searchValue: string;
};
const UpcommingTab = ({searchValue, eventsSearch}: props) => {
  const {upcomingEvents} = useEvents();
  const {currentCity} = useAppStateHook();
  const [events, setEvents] = useState(
    upcomingEvents
      ?.filter(i =>
        i?.location
          ?.toLowerCase()
          .includes(currentCity?.toLowerCase().substring(0, 5)),
      )
      .map(ev => ev),
  );
  const [openingFilters, setOpeningFilters] = useState(false);
  const [eventType, setEventType] = useState('All');
  const [eventDate, setEventDate] = useState();
  const [filtersBorderColor, setFiltersBorderColor] = useState(colors.gray);

  const [addedStyles, setAddedStyles] = useState<string[]>(
    new Array(0).fill(''),
  );
  const onPressFilters = () => {
    setOpeningFilters(true);
  };

  const renderEmpty = () => {
    return (
      <RN.View style={styles.emptyContainer}>
        <RN.Text style={styles.emptyText}>There is no events yet</RN.Text>
      </RN.View>
    );
  };
  useEffect(() => {
    if (searchValue?.length > 0 && eventsSearch) {
      setEvents(eventsSearch);
    }
  }, [eventsSearch, searchValue]);

  useEffect(() => {
    const locationData = upcomingEvents
      ?.filter(i =>
        i?.location
          ?.toLowerCase()
          .includes(currentCity?.toLowerCase().substring(0, 5)),
      )
      .map(ev => ev);
    setEvents(locationData);
  }, [currentCity]);

  const onClear = () => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setAddedStyles([]);
    setEventType('All');
    setFiltersBorderColor(colors.gray);
    setEvents(
      upcomingEvents
        ?.filter(i =>
          i?.location
            ?.toLowerCase()
            .includes(currentCity?.toLowerCase().substring(0, 5)),
        )
        .map(ev => ev),
    );
  };
  const onFilter = () => {
    if (addedStyles?.length > 0) {
      const data = events.filter((item: any) =>
        item?.categories?.some((ai: any) => addedStyles.includes(ai)),
      );
      setEvents(data);
      setFiltersBorderColor(colors.orange);
    } else if (eventType !== 'All') {
      const evData = upcomingEvents?.filter(
        i =>
          i?.location
            ?.toLowerCase()
            .includes(currentCity?.toLowerCase().substring(0, 5)) &&
          i?.typeEvent === eventType,
      );
      setEvents(evData);
      setFiltersBorderColor(colors.orange);
    } else if (
      eventDate !== null &&
      eventDate?.start !== null &&
      eventDate?.start?.start !== null
    ) {
      const range = moment().range(eventDate?.start, eventDate?.end);
      const days = Array.from(range.by('days'));
      const dayEntries = days.map((d, index) => {
        const date = d.format('YYYY-MM-DD');
        return date;
      });
      const findDate = events?.filter((it: any) =>
        dayEntries?.includes(it?.eventDate?.startDate),
      );
      setEvents(findDate);
      setFiltersBorderColor(colors.orange);
    } else {
      setEvents(
        upcomingEvents?.filter(i =>
          i?.location
            ?.toLowerCase()
            .includes(currentCity.toLowerCase().substring(0, 5)),
        ),
      );
      setFiltersBorderColor(colors.gray);
    }
  };
  const renderItem = (item: any) => {
    return <EventCard item={item?.item} key={item.index} />;
  };
  const renderFilters = () => {
    return (
      <RN.View style={styles.filterWrapper}>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Text
            style={
              styles.eventsLength
            }>{`${events.length} events found`}</RN.Text>
        </RN.View>
        <RN.TouchableOpacity
          style={[styles.filterBtn, {borderColor: filtersBorderColor}]}
          onPress={onPressFilters}>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Image
              source={{uri: 'filter'}}
              style={{height: 16, width: 16, marginRight: 8}}
            />
          </RN.View>
          <RN.Text style={styles.filterText}>Filters</RN.Text>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Image
              source={{uri: 'downlight'}}
              style={{height: 16, width: 16, marginLeft: 4, marginTop: 4}}
            />
          </RN.View>
        </RN.TouchableOpacity>
      </RN.View>
    );
  };
  return (
    <>
      <RN.FlatList
        showsVerticalScrollIndicator={false}
        data={sotrtBy(events, 'eventDate.startDate')}
        renderItem={renderItem}
        ListHeaderComponent={renderFilters()}
        keyExtractor={(item, _index) => `${item}${_index}`}
        ListEmptyComponent={renderEmpty()}
        ListFooterComponent={() => {
          return <RN.View style={{paddingBottom: SCREEN_HEIGHT / 10}} />;
        }}
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
      />
    </>
  );
};
const styles = RN.StyleSheet.create({
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  emptyText: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Mulish-Regular',
    textAlign: 'center',
    paddingVertical: 16,
  },
  filterWrapper: {
    paddingTop: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventsLength: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 22.4,
    fontWeight: '600',
  },
  filterBtn: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    padding: 8,
    borderRadius: 100,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  filterText: {
    fontSize: 16,
    lineHeight: 22.4,
    color: colors.darkGray,
    fontWeight: '500',
  },
});
export default UpcommingTab;
