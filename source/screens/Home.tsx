import React, {useCallback, useEffect, useState} from 'react';
import * as RN from 'react-native';
import {useProfile} from '../hooks/useProfile';
import useRegistration from '../hooks/useRegistration';
import colors from '../utils/colors';
import CreateCommunityButton from '../components/createCommunityBtn';
import {SCREEN_HEIGHT, isAndroid} from '../utils/constants';
import useEvents from '../hooks/useEvents';
import EventCard from '../components/eventCard';
import EmptyContainer from '../components/emptyCommunitiesMain';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import VerticalCard from '../components/verticalEventCard';
import moment from 'moment';
import useAppStateHook from '../hooks/useAppState';
import {useCommunities} from '../hooks/useCommunitites';
import socket from '../api/sockets';

const HomeScreen = () => {
  const {userImgUrl, individualStyles, getCurrentUser, userCommunities} =
    useProfile();
  const isFocused = useIsFocused();
  const {userUid} = useRegistration();
  const navigation = useNavigation();
  const {eventTypes, getDanceStyles} = useAppStateHook();
  const {communitiesData} = useCommunities();
  const [tabs, setTabs] = useState(['All', ...eventTypes]);
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const {
    attendEventWithUserUid,
    getManagingEvents,
    getEvents,
    eventList,
    setSocketEvents,
    // setDefaultEventLimit,
  } = useEvents();
  const [events, setEvents] = useState<string[]>(attendEventWithUserUid);

  const [maybeEvents, setMaybeEvents] = useState([]);
  useEffect(() => {
    setTabs(['All', ...eventTypes]);
  }, [eventTypes?.length]);

  useEffect(() => {
    socket.once('subscribed_event', socket_data => {
      // console.log('subscribed_event socket_data.events?.length', socket_data.events?.length);
      if (socket_data?.events?.length) {
        setSocketEvents(socket_data?.events);
      }
    });
    // console.log('eventData.attendedPeople.length', eventData.attendedPeople.length);
  }, []);
  useEffect(() => {
    getDanceStyles();
    getEvents();
    getManagingEvents();
  }, []);

  useEffect(() => {
    if (isFocused) {
      const followCommunities = communitiesData
        ?.map(community => community)
        .filter(
          item =>
            item.followers?.length > 0 &&
            item.followers?.find(user => user.userUid === userUid),
        )
        ?.map(c => c.id);
      const communitiesIdsIncludesForEvents = eventList.filter(ev =>
        followCommunities.includes(ev.communityUid),
      );
      // if (communitiesIdsIncludesForEvents?.length > 0) {
      //   setMaybeEvents(communitiesIdsIncludesForEvents);
      // }
      setEvents([
        ...attendEventWithUserUid,
        ...communitiesIdsIncludesForEvents,
      ]);
      // console.log(
      //   'communitiesIdsIncludesForEvents',
      //   attendEventWithUserUid,
      // );
    }
  }, [isFocused, eventList]);

  const goToCommunities = () => navigation.navigate('Communities');
  useEffect(() => {
    onPressTab('All');
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  const onPressTab = useCallback(
    (value: string) => {
      RN.LayoutAnimation.configureNext(
        RN.LayoutAnimation.Presets.easeInEaseOut,
      );
      setCurrentTab(value);
      // console.log('value', attendEventWithUserUid?.filter(event => event?.typeEvent === value));
      if (value === 'All') {
        setEvents(attendEventWithUserUid);
      } else {
        setEvents(
          attendEventWithUserUid?.filter(event => event?.typeEvent === value),
        );
      }
    },
    [attendEventWithUserUid],
  );
  useEffect(() => {
    if (isFocused) {
      onPressTab('All');
    }
    if (currentTab !== 'All') {
      console.log('currentTab', currentTab);
      onPressTab(currentTab);
    }
  }, [isFocused, currentTab]);
  const renderHeader = () => {
    return (
      <>
        <RN.View style={styles.headerContainer}>
          <RN.Image
            source={require('../assets/images/logoauth.png')}
            style={styles.logoImg}
          />
          <RN.TouchableOpacity
            style={{justifyContent: 'center'}}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Profile')}>
            <RN.Image
              source={
                userImgUrl
                  ? {uri: 'data:image/png;base64,' + userImgUrl?.base64}
                  : require('../assets/images/defaultuser.png')
              }
              style={{height: 40, width: 40, borderRadius: 50}}
              defaultSource={require('../assets/images/defaultuser.png')}
            />
          </RN.TouchableOpacity>
        </RN.View>
      </>
    );
  };
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
  const renderItem = (item: any) => {
    return <EventCard item={item?.item} key={item.item.id} />;
  };
  const renderEmpty = () => {
    return <EmptyContainer onPressButton={goToCommunities} />;
  };
  return (
    <RN.View style={styles.container}>
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false}>
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
        <RN.View
          style={{
            padding: 16,
            backgroundColor: colors.white,
          }}>
          <CreateCommunityButton />
        </RN.View>
        <RN.Text style={styles.upcomingEventsTitle}>
          Your Upcoming Events
        </RN.Text>
        <RN.View style={styles.tabsWrapper}>
          <RN.FlatList
            data={tabs}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderTab}
            horizontal
          />
        </RN.View>
        <RN.FlatList
          showsVerticalScrollIndicator={false}
          data={events}
          renderItem={renderItem}
          keyExtractor={(item, _index) => `${item}${_index}`}
          ListEmptyComponent={renderEmpty()}
          ListFooterComponent={() => {
            return <RN.View style={{paddingBottom: SCREEN_HEIGHT / 10}} />;
          }}
        />
      </ScrollView>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.white,
    backgroundColor: '#FAFAFA',
    paddingTop: isAndroid ? 40 : 44,
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
    paddingTop: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(238, 238, 238, 1)',
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
  itemTabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.purple,
    paddingBottom: 6,
  },
  itemTabText: {
    fontSize: 16,
    lineHeight: 28.2,
    paddingHorizontal: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HomeScreen;
