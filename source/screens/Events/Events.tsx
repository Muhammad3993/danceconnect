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
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {Portal} from 'react-native-portalize';
import FindCity from '../../components/findCity copy';
import {useTranslation} from 'react-i18next';
import i18n from '../../i18n/i118n';

// const TABS = ['Upcoming', 'Attending', 'Managing', 'Passed'];

const EventsScreen = () => {
  const {
    getEvents,
    eventList,
    loadingEvents,
    loadingAttend,
    managingEvents,
    attentingsEvents,
    passingEvents,
    getManagingEvents,
    getPersonalEvents,
    // setDefaultEventLimit,
  } = useEvents();
  const {t} = useTranslation();
  const TABS = [t('upcoming'), t('attending'), t('managing'), t('passed')];
  const [tabs, setTabs] = useState(TABS);
  const routeProps = useRoute();
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const isFocused = useIsFocused();

  const [searchValue, onSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const {currentCity, onChoosedCity} = useAppStateHook();
  const [eventsSearch, setEventsSearch] = useState<string[]>([]);
  const lastSymUserCountry = currentCity?.substr(currentCity?.length - 2);
  const createdEvent = routeProps.params?.createdEvent ?? null;
  useMemo(() => {
    // console.log('isFocused', currentTab, isFocused);
    if (isFocused && currentTab === t('attending')) {
      getPersonalEvents();
    }
  }, [currentTab, isFocused]);
  useEffect(() => {
    i18n.on('languageChanged', lg => {
      // i18n.reloadResources(lg);
      // console.log(lg);
      setTabs([
        i18n.t('upcoming'),
        i18n.t('attending'),
        i18n.t('managing'),
        i18n.t('passed'),
      ]);
      onPressTab(t('upcoming'));
    });
  }, [t]);
  useEffect(() => {
    getEvents();
  }, [currentCity]);

  useEffect(() => {
    onPressTab(TABS[0]);
  }, []);

  const upcomingEvents = eventList?.filter(
    (ev: any) =>
      moment(ev.eventDate?.time).format('YYYY-MM-DD') >
      moment(new Date()).format('YYYY-MM-DD'),
  );

  const onChangeTextSearch = useCallback(
    (value: string) => {
      onSearch(value);
      if (currentTab === t('upcoming')) {
        const search = upcomingEvents.filter((item: any) => {
          const itemData = `${item.categories?.map((m: any) =>
            m.toLowerCase(),
          )} ${item?.title?.toLowerCase()}`;
          const textData = value?.toLowerCase();
          return itemData.indexOf(textData) > -1;
        });
        setEventsSearch(search);
        if (!value?.length) {
          setEventsSearch(upcomingEvents);
        }
      }
      if (currentTab === t('attending')) {
        const searchJoin = attentingsEvents.filter((item: any) => {
          const itemData = `${item.categories?.map((m: any) =>
            m.toLowerCase(),
          )} ${item?.title?.toLowerCase()}`;
          const textData = value?.toLowerCase();
          return itemData.indexOf(textData) > -1;
        });
        setEventsSearch(searchJoin);
        if (!value?.length) {
          setEventsSearch(attentingsEvents);
        }
      }
      if (currentTab === t('managing')) {
        const searchManaging = managingEvents.filter((item: any) => {
          const itemData = `${item.categories?.map((m: any) =>
            m.toLowerCase(),
          )} ${item?.title?.toLowerCase()}`;
          const textData = value?.toLowerCase();
          return itemData.indexOf(textData) > -1;
        });
        setEventsSearch(searchManaging);
        if (!value?.length) {
          setEventsSearch(managingEvents);
        }
      }
      if (currentTab === t('passed')) {
        const searchPassed = passingEvents.filter((item: any) => {
          const itemData = `${item.categories?.map((m: any) =>
            m.toLowerCase(),
          )} ${item?.title?.toLowerCase()}`;
          const textData = value?.toLowerCase();
          return itemData.indexOf(textData) > -1;
        });
        setEventsSearch(searchPassed);
        if (!value?.length) {
          setEventsSearch(passingEvents);
        }
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
      setEventsSearch([]);
      onSearch('');
    }
    setCurrentTab(value);
  };

  useMemo(() => {
    if (createdEvent) {
      getManagingEvents();
      onPressTab(t('managing'));
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
              paddingHorizontal: 16,
              paddingBottom: 8,
            },
          ]}>
          <RN.Text
            style={[
              styles.itemTabText,
              {color: currentTab === item ? colors.purple : colors.darkGray},
            ]}>
            {item}
          </RN.Text>
        </RN.TouchableOpacity>
      );
    };
    return (
      <>
        <RN.View
          style={{
            paddingHorizontal: isAndroid ? 12 : 20,
            marginTop: isAndroid ? 14 : 0,
          }}>
          <RN.TouchableOpacity
            style={styles.userLocationWrapper}
            onPress={() => setOpenModal(true)}>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Image
                source={{uri: 'locate'}}
                style={{height: 16, width: 16}}
              />
            </RN.View>
            <RN.Text style={styles.userLocationText}>{currentCity}</RN.Text>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Image
                source={{uri: 'downlight'}}
                style={{height: 16, width: 16, marginLeft: 6}}
              />
            </RN.View>
          </RN.TouchableOpacity>
          <Search
            onPressAdd={() => navigation.navigate('CreateEvent')}
            onSearch={onChangeTextSearch}
            searchValue={searchValue}
            placeholder={t('input_search_events')}
            visibleAddBtn
          />
        </RN.View>
        <RN.View style={styles.tabsWrapper}>
          <RN.FlatList
            data={tabs}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderTab}
            horizontal
          />
        </RN.View>
      </>
    );
  };

  const renderWrapper = useCallback(() => {
    switch (currentTab) {
      case t('upcomming'):
        return (
          <UpcommingTab searchValue={searchValue} eventsSearch={eventsSearch} />
        );

      case t('attending'):
        return (
          <AttentingTab searchValue={searchValue} eventsSearch={eventsSearch} />
        );

      case t('managing'):
        return (
          <ManagingTab searchValue={searchValue} eventsSearch={eventsSearch} />
        );
      case t('passed'):
        return (
          <PassingTab searchValue={searchValue} eventsSearch={eventsSearch} />
        );
      default:
        return (
          <UpcommingTab searchValue={searchValue} eventsSearch={eventsSearch} />
        );
    }
  }, [currentTab, eventsSearch, searchValue]);

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
            isTabScreen
            communityScreen
            setCurrentCountry={() => console.log('setCurrentCountry')}
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
    alignSelf: 'center',
    // paddingHorizontal: 16,
  },
  itemTabText: {
    fontSize: 16,
    lineHeight: 25.2,
    // letterSpacing: 0.2,
    paddingHorizontal: 4,
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
