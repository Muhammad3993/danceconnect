import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import {Button} from '../../components/Button';
import useRegistration from '../../hooks/useRegistration';
import {useCommunities} from '../../hooks/useCommunitites';
import {useProfile} from '../../hooks/useProfile';
import database from '@react-native-firebase/database';
import {useCommunityById} from '../../hooks/useCommunityById';
import useEvents from '../../hooks/useEvents';
import EventCard from '../../components/eventCard';
import sotrtBy from 'lodash.sortby';
import moment from 'moment';
import Carousel from '../../components/carousel';
import SkeletonCommunityScreen from '../../components/skeleton/CommunityScreen-Skeleton';
import {statusBarHeight} from '../../utils/constants';

const CommunityScreen = () => {
  const routeProps = useRoute();
  const navigation = useNavigation();
  const {userImgUrl, userById, getUser} = useProfile();
  const {userUid} = useRegistration();
  const {startFollowed} = useCommunities();

  const {data}: any = routeProps.params;
  const {id} = data;
  const isAdmin = userUid === data?.creatorUid;
  const TABS = ['Upcoming Events', !isAdmin && 'Attending', 'Passed'];
  const {remove} = useCommunityById(id);
  const [isJoined, setJoined] = useState();
  const [openingDescription, setOpeningDescription] = useState(false);
  const [unFolloweOpen, setUnFollowOpen] = useState(false);
  const [displayedData, setDisplayedData] = useState();
  const {
    getEventById,
    eventsDataById,
    loadingEvents,
    attendingEventsForCommunity,
  } = useEvents();
  const [currentTab, setCurrentTab] = useState(TABS[0]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const upcomingEvents =
    eventsDataById?.filter(
      (item: {eventDate: {startDate: Date}}) =>
        moment(item.eventDate?.startDate).format('YYYY-MM-DD') >=
        moment(new Date()).format('YYYY-MM-DD'),
    ) ?? [];
  const [desc, setDesc] = useState();
  useEffect(() => {
    getUser(displayedData?.creatorUid);
  }, [displayedData?.creatorUid]);
  const passedEvents = eventsDataById?.filter(
    (item: any) =>
      moment(item.eventDate?.startDate).format('YYYY-MM-DD') <
      moment(new Date()).format('YYYY-MM-DD'),
  );
  useEffect(() => {
    // RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    const onValueChange = database()
      .ref(`community/${id}`)
      .on('value', snapshot => {
        setDisplayedData(snapshot.val());
        setDesc(
          snapshot.val()?.description?.length > 70
            ? snapshot.val()?.description?.slice(0, 40) + '...'
            : snapshot.val()?.description,
        );
        // getEvents();
        getEventById(snapshot.val()?.events);
      });

    return () => database().ref(`community/${id}`).off('value', onValueChange);
  }, [id]);

  useMemo(() => {
    setEvents(upcomingEvents);
  }, [eventsDataById?.length]);
  const onPressShowText = () => {
    setOpeningDescription(true);
    setDesc(displayedData?.description);
  };
  const onPressEditCommunity = () => {
    navigation.navigate('EditCommunity', displayedData);
  };

  const onPressJoin = () => {
    if (isJoined) {
      return null;
    }
    startFollowed({
      communityUid: data.id,
      userUid: userUid,
      userImg: userImgUrl,
    });
  };
  const onPressUnfollow = () => {
    startFollowed({
      communityUid: data.id,
      userUid: userUid,
      userImg: userImgUrl,
    });
    setUnFollowOpen(v => !v);
  };
  const onPressRemove = async () => {
    remove();
    // navigation.navigate('CommunitiesMain', {removedCommunity: true});
  };
  useMemo(() => {
    setJoined(
      displayedData?.followers?.map(item => item.userUid)?.includes(userUid),
    );
  }, [displayedData?.followers, userUid]);

  const renderTags = () => {
    return (
      <RN.View
        style={[
          styles.tagsContainer,
          {marginTop: displayedData?.images?.length > 0 ? -50 : -10},
        ]}>
        <RN.ScrollView
          horizontal
          style={styles.scrollTags}
          showsHorizontalScrollIndicator={false}>
          {displayedData?.categories?.map((item: string) => {
            return (
              <RN.View style={styles.tagItem}>
                <RN.Text style={{color: colors.white}}>{item}</RN.Text>
              </RN.View>
            );
          })}
          <RN.View style={{paddingRight: 44}} />
        </RN.ScrollView>
      </RN.View>
    );
  };
  const header = () => {
    return (
      <>
        <RN.TouchableOpacity
          style={styles.backIconContainer}
          onPress={() => navigation.goBack()}>
          <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        </RN.TouchableOpacity>
        {isAdmin && (
          <RN.TouchableOpacity
            style={styles.settingIconContainer}
            onPress={onPressEditCommunity}>
            <RN.Image source={{uri: 'setting'}} style={styles.backIcon} />
          </RN.TouchableOpacity>
        )}
        <RN.TouchableOpacity
          style={styles.moreIconContainer}
          onPress={() => setUnFollowOpen(v => !v)}>
          <RN.Image source={{uri: 'more'}} style={styles.backIcon} />
        </RN.TouchableOpacity>
        {isAdmin && unFolloweOpen && (
          <RN.TouchableOpacity
            style={styles.unFollowContainer}
            onPress={onPressRemove}>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Image
                source={{uri: 'closesquare'}}
                style={{height: 20, width: 20}}
              />
            </RN.View>
            <RN.Text style={styles.unFollowText}>{'Remove Community'}</RN.Text>
          </RN.TouchableOpacity>
        )}
        {isJoined && unFolloweOpen && (
          <RN.TouchableOpacity
            style={styles.unFollowContainer}
            onPress={onPressUnfollow}>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Image
                source={{uri: 'closesquare'}}
                style={{height: 20, width: 20}}
              />
            </RN.View>
            <RN.Text style={styles.unFollowText}>{'Unfollow'}</RN.Text>
          </RN.TouchableOpacity>
        )}
      </>
    );
  };
  const renderTitle = () => {
    return (
      <>
        {renderTags()}
        <RN.View style={styles.titleContainer}>
          <RN.Text style={styles.titleName}>{displayedData?.name}</RN.Text>
          <RN.Text style={styles.titleDesc}>{desc}</RN.Text>
          {!openingDescription && desc?.length > 40 && (
            <RN.TouchableOpacity
              onPress={onPressShowText}
              style={styles.showWrapper}>
              <RN.Text style={styles.showMoreText}>Show more</RN.Text>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Image
                  source={{uri: 'downlight'}}
                  style={styles.arrowDownIcon}
                />
              </RN.View>
            </RN.TouchableOpacity>
          )}
        </RN.View>
      </>
    );
  };

  useEffect(() => {
    switch (currentTab) {
      case 'Upcoming Events':
        return setEvents(upcomingEvents);
      case 'Attending':
        return setEvents(attendingEventsForCommunity);
      case 'Passed':
        return setEvents(passedEvents);
      default:
        return setEvents(upcomingEvents);
    }
  }, [currentTab]);
  const onPressTab = (value: string) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setCurrentTab(value);
  };
  const renderTabs = () => {
    return (
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
        {/* <RN.View style={{paddingRight: 34}} /> */}
      </RN.ScrollView>
    );
  };
  const renderEvents = () => {
    if (loadingEvents) {
      return <RN.ActivityIndicator size={'small'} color={colors.orange} />;
    }
    if (currentTab === 'Passed' && !passedEvents?.length) {
      return (
        <RN.View style={styles.passedEventsContainer}>
          <RN.Text style={{color: 'rgba(158, 158, 158, 1)', fontSize: 16}}>
            {isAdmin
              ? 'You don`t have any past events yet'
              : 'There are no past events yet'}
          </RN.Text>
        </RN.View>
      );
    }
    if (!events?.length && eventsDataById?.length > 0) {
      return (
        <RN.View style={styles.passedEventsContainer}>
          <RN.Text style={{color: 'rgba(158, 158, 158, 1)', fontSize: 16}}>
            There are no events yet
          </RN.Text>
        </RN.View>
      );
    }
    return (
      <>
        {events?.length > 0 &&
          sotrtBy(events, 'eventDate.startDate').map((item: any) => (
            <EventCard item={{...item, communityId: data.id}} />
          ))}
      </>
    );
  };
  const onOpenMaps = () => {
    const url = RN.Platform.select({
      ios: `maps:0,0?q=${displayedData?.location}`,
      android: `geo:0,0?q=${displayedData?.location}`,
    });

    RN.Linking.openURL(url);
  };
  const renderMapInfoOrganizer = () => {
    return (
      <>
        <RN.TouchableOpacity
          style={styles.mapInfoContainer}
          onPress={onOpenMaps}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.View
                style={{
                  backgroundColor: colors.transparentPurple,
                  padding: 10,
                  borderRadius: 100,
                }}>
                <RN.Image
                  source={{uri: 'locate'}}
                  style={{height: 20, width: 20, tintColor: colors.purple}}
                />
              </RN.View>
            </RN.View>
            <RN.Text
              style={styles.locateText}>{`${displayedData?.location}`}</RN.Text>
          </RN.View>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.seeMapsText}>Maps</RN.Text>
            </RN.View>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.View
                style={{
                  transform: [{rotate: '180deg'}],
                  height: 14,
                  width: 16,
                }}>
                <RN.Image
                  source={{uri: 'backicon'}}
                  style={{height: 14, width: 16, tintColor: colors.purple}}
                />
              </RN.View>
            </RN.View>
          </RN.View>
        </RN.TouchableOpacity>
        <RN.View style={styles.organizerContainer}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.Image
              source={
                userById?.profileImg
                  ? {
                      uri:
                        'data:image/png;base64,' + userById?.profileImg?.base64,
                    }
                  : require('../../assets/images/defaultuser.png')
              }
              style={styles.organizerImg}
            />
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.organizerName}>
                {userById?.auth_data?.displayName ?? userById?.name}
              </RN.Text>
              <RN.Text style={styles.organizer}>Organizer</RN.Text>
            </RN.View>
          </RN.View>
          {/* {!isAdmin && (
            <RN.TouchableOpacity style={styles.contactBtn}>
              <RN.Text style={styles.contactText}>Contact</RN.Text>
            </RN.TouchableOpacity>
          )} */}
        </RN.View>
      </>
    );
  };
  useEffect(() => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.linear);
  }, [loading]);

  if (loading) {
    return <SkeletonCommunityScreen />;
  }
  return (
    <RN.ScrollView style={styles.container}>
      {header()}
      <Carousel items={displayedData?.images} />
      {renderTitle()}
      {renderMapInfoOrganizer()}
      {!isAdmin && !isJoined && (
        <RN.View style={styles.btnJoin}>
          <Button
            onPress={onPressJoin}
            // iconName={isJoined && 'chat'}
            disabled
            // isLoading={loadingFollow}
            buttonStyle={isJoined && styles.btnMessage}
            title={'Join Community'}
          />
        </RN.View>
      )}
      {isAdmin && (
        <RN.View style={styles.btnJoin}>
          <Button
            onPress={() =>
              navigation.navigate('CreateEvent', {communityData: data})
            }
            disabled
            // isLoading={isLoadingWithFollow}
            title={'Create Event'}
          />
        </RN.View>
      )}
      {/* {!isAdmin ? (
        <RN.View style={styles.btnJoin}>
          <Button
            onPress={onPressJoin}
            iconName={isJoined && 'chat'}
            disabled
            // isLoading={loadingFollow}
            buttonStyle={isJoined && styles.btnMessage}
            title={isJoined ? 'Message Community' : 'Join Community'}
          />
        </RN.View>
      ) : (
        <RN.View style={styles.btnJoin}>
          <Button
            onPress={() =>
              navigation.navigate('CreateEvent', {communityData: data})
            }
            disabled
            // isLoading={isLoadingWithFollow}
            title={'Create Event'}
          />
        </RN.View>
      )} */}
      {eventsDataById?.length > 0 && renderTabs()}
      {renderEvents()}
    </RN.ScrollView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '47%',
    zIndex: 2,
  },
  passedEventsContainer: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  seeMapsText: {
    color: colors.purple,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22.4,
    marginRight: 4,
  },
  locateText: {
    fontSize: 14,
    lineHeight: 22.4,
    fontWeight: '600',
    paddingVertical: 20,
    marginLeft: 12,
    color: colors.textPrimary,
  },
  mapInfoContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: colors.gray,
    marginTop: 14,
  },
  organizerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    paddingVertical: 14,
    paddingBottom: 20,
  },
  organizerName: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    fontWeight: '700',
  },
  organizerImg: {
    height: 38,
    width: 38,
    borderRadius: 100,
    marginRight: 16,
  },
  organizer: {
    color: colors.darkGray,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 19.6,
    letterSpacing: 0.2,
  },
  contactBtn: {
    borderWidth: 1,
    borderColor: colors.purple,
    borderRadius: 50,
    paddingHorizontal: 22,
    justifyContent: 'center',
  },
  contactText: {
    color: colors.purple,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
  },
  tabsWrapper: {
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    marginBottom: 14,
    paddingHorizontal: 14,
  },
  itemTabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.purple,
    alignSelf: 'center',
  },
  itemTabText: {
    fontSize: 16,
    lineHeight: 25.2,
    // letterSpacing: 0.2,
    paddingHorizontal: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    // flex: 1,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  backIconContainer: {
    padding: 8,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    zIndex: 2,
    left: 0,
    margin: 12,
    marginHorizontal: 24,
    borderRadius: 50,
    top: statusBarHeight + 14,
  },
  moreIconContainer: {
    padding: 8,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    zIndex: 2,
    right: 0,
    margin: 12,
    marginHorizontal: 24,
    borderRadius: 50,
    top: statusBarHeight + 14,
  },
  settingIconContainer: {
    padding: 8,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    zIndex: 2,
    right: 48,
    margin: 12,
    marginHorizontal: 24,
    borderRadius: 50,
    top: statusBarHeight + 14,
  },
  backIcon: {
    height: 22,
    width: 26,
    tintColor: colors.white,
  },
  titleContainer: {
    marginHorizontal: 24,
    paddingTop: 16,
  },
  scrollTags: {
    paddingHorizontal: 24,
  },
  titleName: {
    color: colors.textPrimary,
    fontSize: 24,
    lineHeight: 28.8,
    fontWeight: '700',
  },
  titleDesc: {
    color: '#424242',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.2,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: -20,
    zIndex: 1,
  },
  tagItem: {
    backgroundColor: colors.purple,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 4,
  },
  btnMessage: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.purple,
    color: colors.purple,
  },
  btnJoin: {
    paddingVertical: 24,
    paddingHorizontal: 10,
  },
  showMoreText: {
    color: colors.purple,
    fontSize: 16,
    lineHeight: 22.4,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  showWrapper: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  arrowDownIcon: {
    height: 16,
    width: 16,
    marginLeft: 8,
    marginTop: 4,
    tintColor: colors.purple,
  },
  unFollowContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 3,
    right: 26,
    top: statusBarHeight + 80,
    borderRadius: 8,
    padding: 16,
  },
  unFollowText: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 19.6,
    letterSpacing: 0.2,
    fontWeight: '600',
    marginLeft: 8,
  },
});
export default CommunityScreen;
