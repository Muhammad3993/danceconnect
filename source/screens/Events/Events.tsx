import React, {useEffect, useMemo, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import useEvents from '../../hooks/useEvents';
import EventCard from '../../components/eventCard';
import sotrtBy from 'lodash.sortby';
import Search from '../../components/search';
import moment from 'moment';
import useRegistration from '../../hooks/useRegistration';
import {isAndroid} from '../../utils/constants';
import FiltersBottom from '../../components/bottomFilters';

const TABS = ['Upcoming', 'Attending', 'Managing', 'Passed'];

const EventsScreen = () => {
  const {getEvents, eventList, loadingEvents, loadingAttend} = useEvents();

  const [currentTab, setCurrentTab] = useState(TABS[0]);
  const [displayedData, setDisplayedData] = useState(eventList);
  const [openingFilters, setOpeningFilters] = useState(false);
  const [addedStyles, setAddedStyles] = useState<string[]>(
    new Array(0).fill(''),
  );
  const [eventsCountValue, setEventsCountValue] = useState(
    displayedData?.length ?? 0,
  );
  const {userUid} = useRegistration();

  const [searchValue, onSearch] = useState('');

  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    onPressTab(TABS[0]);
  }, []);

  const onPressTab = (value: string) => {
    // RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setCurrentTab(value);
  };
  useEffect(() => {
    setDisplayedData(upcomingEvents);
  }, [eventList?.length]);

  const onClear = () => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setAddedStyles([]);
    setDisplayedData(upcomingEvents);
  };

  const upcomingEvents = eventList
    ?.filter(
      (ev: any) =>
        moment(ev.eventDate?.startDate).format('YYYY-MM-DD') >=
        moment(new Date()).format('YYYY-MM-DD'),
    )
    .map((item: any) => item);

  const managingEvents = eventList
    .filter(
      (ev: any) =>
        ev.creatorUid === userUid &&
        moment(ev.eventDate?.startDate).format('YYYY-MM-DD') >
          moment(new Date()).format('YYYY-MM-DD'),
    )
    .map((item: any) => item);

  useEffect(() => {
    switch (currentTab) {
      case 'Upcoming':
        return setDisplayedData(upcomingEvents);
      case 'Attending':
        const attendingEvents =
          eventList
            ?.filter(
              (item: any) =>
                item?.attendedPeople?.length > 0 &&
                item?.attendedPeople?.find(
                  (user: any) => user.userUid === userUid,
                ),
            )
            .map((item: any) => item) ?? [];
        return setDisplayedData(attendingEvents);
      case 'Managing':
        return setDisplayedData(managingEvents);
      case 'Passed':
        const passedEvents = eventList
          ?.filter(
            (item: any) =>
              moment(item.eventDate?.startDate).format('YYYY-MM-DD') <
              moment(new Date()).format('YYYY-MM-DD'),
          )
          .map((item: any) => item);
        return setDisplayedData(passedEvents);
      default:
        return setDisplayedData(upcomingEvents);
    }
  }, [currentTab]);
  const renderEmpty = () => {
    return (
      <RN.View style={styles.emptyContainer}>
        <RN.Text style={styles.emptyText}>There is no events yet</RN.Text>
      </RN.View>
    );
  };

  const onChangeTextSearch = (value: string) => {
    const search = displayedData.filter((item: any) => {
      const itemData = `${item.categories?.map(m =>
        m.toLowerCase(),
      )} ${item?.name?.toLowerCase()}`;
      const textData = value.toLowerCase();
      // console.log(itemData, textData);
      return itemData.indexOf(textData) > -1;
    });
    setDisplayedData(search);
    setEventsCountValue(displayedData?.length ?? 0);
    onSearch(value);
  };
  useMemo(() => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setEventsCountValue(displayedData?.length ?? 0);
  }, [displayedData?.length]);
  const renderHeader = () => {
    return (
      <>
        <RN.View style={{marginHorizontal: 20}}>
          <Search
            onSearch={onChangeTextSearch}
            searchValue={searchValue}
            placeholder="Event name, dance style, place..."
            visibleAddBtn={false}
          />
        </RN.View>
        <RN.ScrollView
          style={styles.tabsWrapper}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {TABS.map((item: string, index: number) => {
            return (
              <RN.TouchableOpacity
                onPress={() => onPressTab(item)}
                key={index}
                style={[
                  styles.itemTabContainer,
                  {
                    borderBottomWidth: currentTab === item ? 3 : 0,
                    marginBottom: -1,
                    paddingHorizontal: 16,
                    paddingBottom: 8,
                  },
                ]}>
                <RN.Text
                  style={[
                    styles.itemTabText,
                    {
                      color:
                        currentTab === item ? colors.purple : colors.darkGray,
                    },
                  ]}>
                  {item}
                </RN.Text>
              </RN.TouchableOpacity>
            );
          })}
        </RN.ScrollView>
        {renderFilters()}
      </>
    );
  };
  const renderLoading = () => {
    return (
      <RN.View style={styles.loadingContainer}>
        <RN.ActivityIndicator size={'large'} color={colors.orange} />
      </RN.View>
    );
  };
  const renderFilters = () => {
    return (
      <>
        {currentTab !== 'Upcoming' && <RN.View style={{marginBottom: 14}} />}
        {currentTab === 'Upcoming' && (
          <RN.View style={styles.filterWrapper}>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text
                style={
                  styles.eventsLength
                }>{`${eventsCountValue} events found`}</RN.Text>
            </RN.View>
            <RN.TouchableOpacity
              style={styles.filterBtn}
              onPress={() => setOpeningFilters(true)}>
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
        )}
      </>
    );
  };
  const onFilter = () => {
    const data = eventList.filter((item: any) =>
      item?.categories?.some((ai: any) => addedStyles.includes(ai)),
    );
    setDisplayedData(data);
    if (!addedStyles?.length) {
      setDisplayedData(eventList);
    }
    setEventsCountValue(displayedData?.length ?? 0);
  };

  const renderItem = (item: any) => {
    return <EventCard item={item?.item} key={item.index} />;
  };
  const renderFlat = () => {
    return (
      <RN.FlatList
        showsVerticalScrollIndicator={false}
        data={sotrtBy(displayedData, 'eventDate.startDate')}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader()}
        keyExtractor={(item, _index) => `${item}${_index}`}
        ListEmptyComponent={renderEmpty()}
      />
    );
  };
  return (
    <RN.SafeAreaView style={styles.container}>
      {/* {renderHeader()} */}
      {loadingEvents && !loadingAttend && renderLoading()}
      {eventList?.length > 0 && renderFlat()}

      {openingFilters && (
        <FiltersBottom
          onClose={() => setOpeningFilters(false)}
          selectedStyles={addedStyles}
          setSelectedStyles={setAddedStyles}
          onClear={onClear}
          onFilter={onFilter}
        />
      )}
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: isAndroid ? 0 : 40,
    paddingHorizontal: 16,
  },
  nameContainer: {
    flexDirection: 'row',
  },
  name: {
    fontSize: 24,
    lineHeight: 28.8,
    fontWeight: '700',
    fontFamily: 'Mulish-Regular',
    color: colors.textPrimary,
    textAlign: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  tabsWrapper: {
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    // marginBottom: 14,
    // paddingHorizontal: 14,
  },
  itemTabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.purple,
    paddingBottom: 6,
  },
  itemTabText: {
    fontSize: 16,
    lineHeight: 28.2,
    // letterSpacing: 0.2,
    paddingHorizontal: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 2,
    backgroundColor: 'transparent',
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
    paddingHorizontal: isAndroid ? 0 : 20,
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

export default EventsScreen;
