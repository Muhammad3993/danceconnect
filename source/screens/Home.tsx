import React, {useCallback, useEffect, useState} from 'react';
import * as RN from 'react-native';
import useRegistration from '../hooks/useRegistration';
import colors from '../utils/colors';
import CreateCommunityButton from '../components/createCommunityBtn';
import useEvents from '../hooks/useEvents';
import EventCard from '../components/eventCard';
import EmptyContainer from '../components/emptyCommunitiesMain';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import useAppStateHook from '../hooks/useAppState';
import useTickets from '../hooks/useTickets';
import {useTranslation} from 'react-i18next';
import {isAndroid} from '../utils/constants';
import {Client} from '@amityco/ts-sdk';
import messaging from '@react-native-firebase/messaging';
import {useProfile} from '../hooks/useProfile';
import PushController from '../utils/pushController';
import {Tab} from '../components/tab';

const HomeScreen = () => {
  const routeProps = useRoute();
  const isFocused = useIsFocused();
  const {logout} = useRegistration();
  const navigation = useNavigation();
  const {eventTypes, getDanceStyles, setMessageNotice, setVisibleNotice} =
    useAppStateHook();
  const [tabs, setTabs] = useState(['All', ...eventTypes]);
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const {personalEvents, getPersonalEvents} = useEvents();
  const [events, setEvents] = useState<string[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const {getPurchasedTickets} = useTickets();
  const {setToken} = useProfile();

  const {t} = useTranslation();
  const getFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      console.log('getFcmToken', fcmToken);
      setToken(fcmToken);
      return fcmToken;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  useEffect(() => {
    setTabs(['All', ...eventTypes]);
  }, [eventTypes, eventTypes.length]);

  useEffect(() => {
    if (routeProps?.params && routeProps.params?.logout) {
      setMessageNotice('Token expire');
      setVisibleNotice(true);
      logout();
    }
  }, [isFocused, routeProps.params?.logout, routeProps.params]);

  useEffect(() => {
    getFcmToken();
    getDanceStyles();
    // getManagingEvents();
    getPersonalEvents();
    getPurchasedTickets();
  }, []);

  useEffect(() => {
    if (personalEvents?.length > 0) {
      setEvents(personalEvents);
    }
  }, [personalEvents, personalEvents?.length]);

  const onPressTab = useCallback(
    (value: string) => {
      // RN.LayoutAnimation.configureNext(
      // RN.LayoutAnimation.Presets.easeInEaseOut,
      // );
      setCurrentTab(value);
      if (value === 'All') {
        setEvents(personalEvents);
      } else {
        setEvents(
          personalEvents?.filter(
            (event: {typeEvent: string}) => event?.typeEvent === value,
          ),
        );
      }
    },
    [personalEvents],
  );

  useEffect(() => {
    const unreadSub = Client.getUserUnread(({data}) => {
      setUnreadMessages(data.unreadCount);
    });
    return () => {
      unreadSub();
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      onPressTab('All');
    }
    if (currentTab !== 'All') {
      onPressTab(currentTab);
    }
  }, [isFocused, currentTab, onPressTab]);

  const goToCommunities = () => navigation.navigate('Communities');

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{flex: 1, backgroundColor: '#FAFAFA'}}>
      <RN.View style={styles.container}>
        <RN.View style={styles.headerContainer}>
          <RN.Image
            source={require('../assets/images/logoauth.png')}
            style={styles.logoImg}
          />

          <RN.TouchableOpacity
            style={{justifyContent: 'center'}}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Chats')}>
            {unreadMessages > 0 && <RN.View style={styles.unreadDot} />}
            <RN.Image source={{uri: 'chat'}} style={{height: 28, width: 28}} />
          </RN.TouchableOpacity>
        </RN.View>
        {/* {maybeEvents?.length > 0 && (
          <RN.View style={styles.interestedWrapper}>
            <RN.Text style={styles.interestedText}>
              You might be interested
            </RN.Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {maybeEvents?.map(i => (
                <VerticalCard data={i} eventsLength={maybeEvents?.length} />
              ))}
            </ScrollView>
          </RN.View>
        )} */}
        <RN.View style={{padding: 16, backgroundColor: colors.white}}>
          <CreateCommunityButton />
        </RN.View>
        <RN.Text style={styles.upcomingEventsTitle}>
          {t('your_upcoming')}
        </RN.Text>
        <RN.View style={styles.tabsWrapper}>
          <Tab
            textStyle={styles.itemTabText}
            onPressTab={onPressTab}
            currentTab={currentTab}
            data={tabs}
            wrapperStyle={{borderBottomWidth: 0}}
          />
        </RN.View>
        {events.map((item: any) => {
          return (
            <RN.View
              style={{
                paddingTop: 8,
                minHeight: events.length > 1 ? 200 : 260,
              }}
              key={item?.id}>
              <EventCard item={item} />
            </RN.View>
          );
        })}
        {events?.length <= 0 && (
          <EmptyContainer onPressButton={goToCommunities} />
        )}
        {/* </ScrollView> */}
      </RN.View>
      <RN.View style={{paddingBottom: 24, backgroundColor: '#FAFAFA'}} />
      <PushController />
    </ScrollView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: colors.white,
    backgroundColor: '#FAFAFA',
    // paddingHorizontal: 20,
  },
  interestedWrapper: {
    backgroundColor: colors.white,
    paddingTop: 32,
  },
  interestedText: {
    fontSize: 24,
    lineHeight: 28.8,
    color: colors.textPrimary,
    fontWeight: '700',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  upcomingEventsTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: 0.2,
    paddingTop: 28,
    paddingHorizontal: 20,
    color: colors.textPrimary,
    backgroundColor: colors.white,
  },
  nameContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingTop: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(238, 238, 238, 1)',
    paddingTop: isAndroid ? 14 : 44,
    paddingBottom: 8,
    // marginBottom: 8,
    backgroundColor: colors.white,
  },
  logoImg: {
    height: 34,
    width: 122,
  },
  tabsWrapper: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },

  itemTabText: {
    fontSize: 16,
    lineHeight: 28.2,
    paddingHorizontal: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -6,
    backgroundColor: colors.purple,
    width: 13,
    height: 13,
    borderRadius: 50,
    zIndex: 1,
    borderColor: colors.white,
    borderWidth: 3,
  },
});

export default HomeScreen;
