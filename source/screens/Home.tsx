import React, {useCallback, useEffect, useState} from 'react';
import * as RN from 'react-native';
import useRegistration from '../hooks/useRegistration';
import colors from '../utils/colors';
import CreateCommunityButton from '../components/createCommunityBtn';
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
import {useCommunities} from '../hooks/useCommunitites';
import VerticalCommunityCard from '../components/verticalCommunityCard';
import {CommunityT} from '../utils/interfaces';
import useEvents from '../hooks/useEvents';

const HomeScreen = () => {
  const routeProps = useRoute();
  const isFocused = useIsFocused();
  const {logout} = useRegistration();
  const navigation = useNavigation();
  const {
    eventTypes,
    getDanceStyles,
    setMessageNotice,
    setVisibleNotice,
    getCommunityType,
  } = useAppStateHook();
  const [tabs, setTabs] = useState(['All', ...eventTypes]);
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  const [events, setEvents] = useState<string[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const {getPurchasedTickets} = useTickets();
  const {setToken} = useProfile();
  const {getMainCommunities, mainCommunities} = useCommunities();
  const {getMainEvents, mainEvents} = useEvents();

  const {t} = useTranslation();
  const getFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
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
    if (isFocused) {
      getMainCommunities();
      getMainEvents();
      setEvents(mainEvents);
      getCommunityType();
    }
  }, [isFocused]);

  useEffect(() => {
    getFcmToken();
    getDanceStyles();
    getPurchasedTickets();
    getCommunityType();
  }, []);

  const onPressTab = useCallback(
    (value: string) => {
      RN.LayoutAnimation.configureNext(
        RN.LayoutAnimation.Presets.easeInEaseOut,
      );
      setCurrentTab(value);
      if (value === 'All') {
        setEvents(mainEvents);
      } else {
        setEvents(
          mainEvents?.filter(
            (event: {typeEvent: string}) => event?.typeEvent === value,
          ),
        );
      }
    },
    [mainEvents],
  );

  useEffect(() => {
    let unreadSub: Amity.Unsubscriber | undefined;
    Client.startUnreadSync().then(() => {
      unreadSub = Client.getUserUnread(({data}) => {
        setUnreadMessages(data.unreadCount);
      });
    });

    return () => {
      if (unreadSub) {
        unreadSub();
      }
      Client.stopUnreadSync();
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
        {mainCommunities?.length > 0 && (
          <RN.View style={styles.interestedWrapper}>
            <RN.View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8,
                paddingRight: 30,
              }}>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Text style={styles.interestedText}>
                  You might be interested
                </RN.Text>
              </RN.View>
              <RN.TouchableOpacity
                style={styles.ellipse}
                onPress={() => navigation.navigate('Communities')}>
                <RN.Image
                  source={{uri: 'arrowright'}}
                  style={{height: 16, width: 16, margin: 6}}
                />
              </RN.TouchableOpacity>
            </RN.View>
            <ScrollView
              style={{paddingHorizontal: 8}}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {mainCommunities?.map((community: CommunityT) => (
                <VerticalCommunityCard {...community} />
              ))}
              <RN.View style={{marginRight: 16}} />
            </ScrollView>
          </RN.View>
        )}
        <RN.View style={{padding: 16, backgroundColor: colors.white}}>
          <CreateCommunityButton />
        </RN.View>
        <RN.View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 18,
            paddingTop: 20,
            paddingRight: 30,
            backgroundColor: colors.white,
          }}>
          <RN.Text style={styles.upcomingEventsTitle}>
            {t('upcoming') + ' ' + t('events_tab')}
          </RN.Text>
          <RN.TouchableOpacity
            style={[styles.ellipse, {justifyContent: 'center'}]}
            onPress={() => navigation.navigate('Events')}>
            <RN.Image
              source={{uri: 'arrowright'}}
              style={{height: 16, width: 16, margin: 6}}
            />
          </RN.TouchableOpacity>
        </RN.View>
        <RN.View style={styles.tabsWrapper}>
          <Tab
            textStyle={styles.itemTabText}
            onPressTab={onPressTab}
            currentTab={currentTab}
            data={tabs}
            wrapperStyle={{borderBottomWidth: 0}}
          />
        </RN.View>
        <RN.View style={{paddingTop: 12, backgroundColor: colors.white}} />
        {events.map((item: any) => {
          return (
            <RN.View
              style={{
                // paddingTop: 8,
                paddingHorizontal: 12,
                // minHeight: events.length > 1 ? 200 : 260,
                backgroundColor: colors.white,
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
  ellipse: {
    backgroundColor: colors.transparentPurple,
    borderRadius: 100,
    height: 28,
    width: 28,
    justifyContent: 'center',
    // marginRight: 30,
  },
  interestedText: {
    fontSize: 20,
    letterSpacing: 0.2,
    lineHeight: 24,
    color: colors.textPrimary,
    fontWeight: '600',
    // paddingBottom: 20,
    paddingHorizontal: 20,
  },
  upcomingEventsTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: 0.2,
    // paddingTop: 28,
    paddingHorizontal: 20,
    color: colors.textPrimary,
    // backgroundColor: colors.white,
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
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    paddingVertical: 16,
  },
  name: {
    fontSize: 24,
    lineHeight: 28.8,
    fontWeight: '700',
    fontFamily: 'Lato-Regular',
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
    // paddingTop: 20,
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
