import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import {SCREEN_WIDTH} from '../../utils/constants';
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

const TABS = ['Upcoming Events', 'Attending', 'Passed'];
const CommunityScreen = () => {
  const routeProps = useRoute();
  const navigation = useNavigation();
  const {userImgUrl} = useProfile();
  const {userUid} = useRegistration();
  const {startFollowed} = useCommunities();

  const {data}: any = routeProps.params;
  const {id} = data;
  const isAdmin = userUid === data?.creatorUid;
  const {remove} = useCommunityById(id);
  const [isJoined, setJoined] = useState();
  const [openingDescription, setOpeningDescription] = useState(false);
  const [unFolloweOpen, setUnFollowOpen] = useState(false);
  const [displayedData, setDisplayedData] = useState();
  const {getEventById, eventsDataById, loadingEvents, attendingEvents} =
    useEvents();
  const [currentTab, setCurrentTab] = useState(TABS[0]);
  const [events, setEvents] = useState([]);

  const upcomingEvents =
    eventsDataById?.filter(
      (item: any) =>
        moment(item.eventDate?.startDate).format('YYYY-MM-DD') >=
        moment(new Date()).format('YYYY-MM-DD'),
    ) ?? [];
  const [desc, setDesc] = useState();

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
    navigation.navigate('CommunitiesMain', {removedCommunity: true});
  };
  useMemo(() => {
    setJoined(
      displayedData?.followers?.map(item => item.userUid)?.includes(userUid),
    );
  }, [displayedData?.followers, userUid]);

  const renderTags = () => {
    return (
      <RN.View style={styles.tagsContainer}>
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
        return setEvents(attendingEvents);
      case 'Passed':
        const passedEvents = eventsDataById?.filter(
          (item: any) =>
            moment(item.eventDate?.startDate).format('YYYY-MM-DD') <
            moment(new Date()).format('YYYY-MM-DD'),
        );
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
        <RN.View style={{paddingRight: 34}} />
      </RN.ScrollView>
    );
  };
  const renderEvents = () => {
    if (loadingEvents) {
      return <RN.ActivityIndicator size={'small'} color={colors.orange} />;
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
  return (
    <RN.ScrollView style={styles.container}>
      {header()}
      <RN.Image
        source={
          displayedData?.images?.length > 0
            ? {uri: 'data:image/png;base64,' + displayedData?.images[0]?.base64}
            : require('../../assets/images/default.jpeg')
        }
        style={{height: 350, width: SCREEN_WIDTH}}
      />
      {renderTitle()}
      {!isAdmin ? (
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
              navigation.navigate('CreateEvent', {communityUid: data.id})
            }
            disabled
            // isLoading={isLoadingWithFollow}
            title={'Create Event'}
          />
        </RN.View>
      )}
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
    paddingHorizontal: 20,
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
    top: 24,
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
    top: 24,
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
    top: 24,
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
    color: colors.textPrimary,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: -20,
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
    top: 80,
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
