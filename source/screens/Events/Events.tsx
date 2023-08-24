import React, {useCallback, useEffect, useMemo, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import useEvents from '../../hooks/useEvents';
import Search from '../../components/search';
import moment from 'moment';
import {isAndroid} from '../../utils/constants';
import UpcommingTab from './tabs/upcoming';
import AttentingTab from './tabs/attenting';
import ManagingTab from './tabs/managing';
import PassingTab from './tabs/passed';
import useAppStateHook from '../../hooks/useAppState';
import CitySelector from '../../components/citySelector';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Portal} from 'react-native-portalize';
import FindCity from '../../components/findCity';

const TABS = ['Upcoming', 'Attending', 'Managing', 'Passed'];

const EventsScreen = () => {
  const {
    getEvents,
    eventList,
    loadingEvents,
    loadingAttend,
    managingEvents,
    attentingsEvents,
    passingEvents,
    // setDefaultEventLimit,
  } = useEvents();
  const routeProps = useRoute();
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState(TABS[0]);

  const [searchValue, onSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const {currentCity, onChoosedCity} = useAppStateHook();
  const [communititesSearch, setCommunitiesSearch] = useState<string[]>([]);
  const lastSymUserCountry = currentCity?.substr(currentCity?.length - 2);
  const createdEvent = routeProps.params?.createdEvent ?? null;

  // useEffect(() => {
  //   getEvents();
  // }, []);

  useEffect(() => {
    onPressTab(TABS[0]);
  }, []);

  const upcomingEvents = eventList
    ?.filter(
      (ev: any) =>
        moment(ev.eventDate?.time).format('YYYY-MM-DD') >=
          moment(new Date()).format('YYYY-MM-DD') &&
        ev?.location?.toLowerCase().includes(currentCity.toLowerCase()) &&
        ev?.location?.substr(ev?.location?.length - 2) === lastSymUserCountry,
    )
    .map((item: any) => item);

  const onChangeTextSearch = useCallback(
    (value: string) => {
      onSearch(value);
      if (currentTab === 'Upcoming') {
        const search = upcomingEvents.filter((item: any) => {
          const itemData = `${item.categories?.map((m: any) =>
            m.toLowerCase(),
          )} ${item?.name?.toLowerCase()}`;
          const textData = value?.toLowerCase();
          return itemData.indexOf(textData) > -1;
        });
        setCommunitiesSearch(search);
      }
      if (currentTab === 'Attending') {
        const searchJoin = attentingsEvents.filter((item: any) => {
          const itemData = `${item.categories?.map((m: any) =>
            m.toLowerCase(),
          )} ${item?.name?.toLowerCase()}`;
          const textData = value?.toLowerCase();
          return itemData.indexOf(textData) > -1;
        });
        setCommunitiesSearch(searchJoin);
      }
      if (currentTab === 'Managing') {
        const searchManaging = managingEvents.filter((item: any) => {
          const itemData = `${item.categories?.map((m: any) =>
            m.toLowerCase(),
          )} ${item?.name?.toLowerCase()}`;
          const textData = value?.toLowerCase();
          return itemData.indexOf(textData) > -1;
        });
        setCommunitiesSearch(searchManaging);
      }
      if (currentTab === 'Passing') {
        const searchPassed = passingEvents.filter((item: any) => {
          const itemData = `${item.categories?.map((m: any) =>
            m.toLowerCase(),
          )} ${item?.name?.toLowerCase()}`;
          const textData = value?.toLowerCase();
          return itemData.indexOf(textData) > -1;
        });
        setCommunitiesSearch(searchPassed);
      }
    },
    [
      currentTab,
      upcomingEvents,
      attentingsEvents,
      managingEvents,
      passingEvents,
    ],
  );

  const onPressTab = (value: string) => {
    // RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    if (searchValue?.length) {
      RN.Keyboard.dismiss();
      setCommunitiesSearch([]);
      onSearch('');
    }
    setCurrentTab(value);
  };

  useMemo(() => {
    if (createdEvent) {
      onPressTab('Managing');
      // getCommunitites();
    }
  }, [createdEvent]);

  const renderHeader = () => {
    const renderTab = ({item}: any) => {
      return (
        <RN.TouchableOpacity
          onPress={() => onPressTab(item)}
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
                color: currentTab === item ? colors.purple : colors.darkGray,
              },
            ]}>
            {item}
          </RN.Text>
        </RN.TouchableOpacity>
      );
    };
    return (
      <>
        <RN.View style={{marginHorizontal: 20}}>
          <RN.TouchableOpacity
            style={styles.userLocationWrapper}
            onPress={() => setOpenModal(true)}>
            <RN.Image
              source={{uri: 'locate'}}
              style={{height: 16, width: 16}}
            />
            <RN.Text style={styles.userLocationText}>{currentCity}</RN.Text>
            <RN.Image
              source={{uri: 'downlight'}}
              style={{height: 16, width: 16, marginLeft: 6}}
            />
          </RN.TouchableOpacity>
          <Search
            onPressAdd={() => navigation.navigate('CreateEvent')}
            onSearch={onChangeTextSearch}
            searchValue={searchValue}
            placeholder="Event name, dance style, place..."
            visibleAddBtn
          />
        </RN.View>
        <RN.View style={styles.tabsWrapper}>
          <RN.FlatList
            data={TABS}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderTab}
            horizontal
          />
        </RN.View>
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

  const renderWrapper = useCallback(() => {
    switch (currentTab) {
      case 'Upcomming':
        return (
          <UpcommingTab
            searchValue={searchValue}
            eventsSearch={communititesSearch}
          />
        );

      case 'Attending':
        return (
          <AttentingTab
            searchValue={searchValue}
            eventsSearch={communititesSearch}
          />
        );

      case 'Managing':
        return (
          <ManagingTab
            searchValue={searchValue}
            eventsSearch={communititesSearch}
          />
        );
      case 'Passed':
        return (
          <PassingTab
            searchValue={searchValue}
            eventsSearch={communititesSearch}
          />
        );
      default:
        return (
          <UpcommingTab
            searchValue={searchValue}
            eventsSearch={communititesSearch}
          />
        );
    }
  }, [currentTab, communititesSearch, searchValue]);

  return (
    <RN.SafeAreaView style={styles.container}>
      {renderHeader()}
      {/* {loadingEvents && !loadingAttend && renderLoading()} */}
      {renderWrapper()}
      {/* <CitySelector
        opening={openModal}
        onClose={() => setOpenModal(false)}
        onChoosedCity={onChoosedCity}
      /> */}
      {openModal && (
        <Portal>
          <FindCity
            selectedLocation={currentCity}
            setSelectedLocation={onChoosedCity}
            onClosed={() => setOpenModal(false)}
            communityScreen
          />
        </Portal>
      )}
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: isAndroid ? 0 : 40,
    // paddingHorizontal: 16,
  },
  nameContainer: {
    flexDirection: 'row',
  },
  userLocationWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
    backgroundColor: '#FBFBFB',
    padding: 8,
    borderRadius: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#CDCDCD',
  },
  userLocationText: {
    paddingLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
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
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    // marginBottom: 14,
    paddingHorizontal: 14,
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
    paddingHorizontal: 10,
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
