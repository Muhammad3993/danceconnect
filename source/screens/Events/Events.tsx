import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import * as RN from 'react-native';
import {Portal} from 'react-native-portalize';
import FindCity from '../../components/findCity copy';
import Search from '../../components/search';
import {Tab} from '../../components/tab';
import useAppStateHook from '../../hooks/useAppState';
import useEvents from '../../hooks/useEvents';
import i18n from '../../i18n/i118n';
import colors from '../../utils/colors';
import {isAndroid} from '../../utils/constants';
import AttentingTab from './tabs/attenting';
import ManagingTab from './tabs/managing';
import PassingTab from './tabs/passed';
import UpcommingTab from './tabs/upcoming';

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
  const TABS = [
    {text: t('upcoming')},
    {text: t('attending')},
    {text: t('managing')},
    {text: t('passed')},
  ];
  const [tabs, setTabs] = useState(TABS);
  const routeProps = useRoute();
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState(tabs[0].text);
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
        {text: i18n.t('upcoming')},
        {text: i18n.t('attending')},
        {text: i18n.t('managing')},
        {text: i18n.t('passed')},
      ]);
      onPressTab(t('upcoming'));
    });
  }, [t]);
  useEffect(() => {
    getEvents();
  }, [currentCity]);

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
    return (
      <RN.View style={{marginTop: isAndroid ? 14 : 0}}>
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
        <Tab
          data={tabs}
          currentTab={currentTab}
          onPressTab={onPressTab}
          textStyle={styles.itemTabText}
          wrapperStyle={{paddingHorizontal: 1}}
        />
      </RN.View>
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
      <RN.View style={styles.root}>
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
      </RN.View>
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  root: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
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

  itemTabText: {
    fontSize: 16,
    lineHeight: 25.2,
    letterSpacing: 0.2,
    paddingHorizontal: 4,
    fontWeight: '600',
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
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    paddingVertical: 16,
  },
});

export default EventsScreen;
