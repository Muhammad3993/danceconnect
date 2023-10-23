import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import {Button} from '../../components/Button';
import useRegistration from '../../hooks/useRegistration';
import {useCommunities} from '../../hooks/useCommunitites';
import {useCommunityById} from '../../hooks/useCommunityById';
import useEvents from '../../hooks/useEvents';
import Carousel from '../../components/carousel';
import SkeletonCommunityScreen from '../../components/skeleton/CommunityScreen-Skeleton';
import {SCREEN_WIDTH, isAndroid, statusBarHeight} from '../../utils/constants';
import socket from '../../api/sockets';
import {apiUrl} from '../../api/serverRequests';
import CommunityEvents from '../../components/communityEvents';
import FastImage from 'react-native-fast-image';
import {Animated} from 'react-native';

const CommunityScreen = ({route}) => {
  const routeProps = useRoute();
  const navigation = useNavigation();
  const {userUid} = useRegistration();
  const {startFollowed, isSaveChanges, onClearCommunityDataById} =
    useCommunities();

  const {data}: any = routeProps.params;
  const communityId = (route.params && route.params?.id) ?? data?.id;
  const {isProfileScreen}: any = routeProps.params;
  const {remove, getCommunity, communityData, loadingById} =
    useCommunityById(communityId);
  const [openingDescription, setOpeningDescription] = useState(false);
  const [unFolloweOpen, setUnFollowOpen] = useState(false);
  const isAdmin = communityData?.creator?.uid === userUid;

  const {getEventByIdCommunity, loadingEvents} = useEvents();
  const TABS = ['Upcoming Events', !isAdmin && 'Attending', 'Passed'];
  const [currentTab, setCurrentTab] = useState<string>(TABS[0]);
  const [loadSubscribe, setLoadSubscribe] = useState(false);
  const [sourceDimensions, setSourceDimensions] = useState({
    height: 0,
    width: 0,
  });
  RN.Image.getSizeWithHeaders(
    apiUrl + communityData?.creator?.userImage,
    {},
    (width, height) => {
      // console.log(`The image dimensions are ${width}x${height}`);
      if (sourceDimensions.height === 0) {
        setSourceDimensions({
          height: height,
          width: width,
        });
      }
    },
    error => {
      console.error(`Couldn't get the image size: ${error}`);
    },
  );
  useEffect(() => {
    getCommunity();
  }, []);
  // console.log('com', routeProps.params, linkId);
  useEffect(() => {
    // getCommunity();
    if (communityData !== null) {
      getEventByIdCommunity(communityData?.eventsIds);
    }
  }, [communityData]);
  useEffect(() => {
    if (isSaveChanges) {
      getCommunity();
    }
  }, [isSaveChanges]);
  const [isJoined, setIsJoined] = useState();
  const [attendedImgs, setAttendedImgs] = useState([]);

  useEffect(() => {
    if (communityData !== null) {
      setAttendedImgs(communityData?.userImages);
    }
  }, [communityData, communityData?.userImages]);

  useEffect(() => {
    setIsJoined(
      communityData?.followers?.find(
        (user: {userUid: any}) => user?.userUid === userUid,
      ),
    );
  }, [communityData?.followers, userUid]);
  useEffect(() => {
    socket.on('subscribed', socket_data => {
      if (socket_data?.currentCommunity?.id === communityId) {
        setIsJoined(
          socket_data?.currentCommunity?.followers
            ?.map(u => u)
            .some(user => user.userUid === userUid),
        );
        // RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.linear);
        setAttendedImgs(socket_data?.userImages);
        setLoadSubscribe(false);
      }
    });
  }, [communityId, userUid]);

  const onPressEditCommunity = () => {
    navigation.navigate('EditCommunity', communityData);
  };

  const onPressJoin = () => {
    setLoadSubscribe(true);
    startFollowed(communityData?.id);
  };
  const onPressUnfollow = () => {
    setLoadSubscribe(true);
    startFollowed(communityData?.id);
    setUnFollowOpen(v => !v);
  };
  const onPressRemove = async () => {
    setUnFollowOpen(v => !v);
    remove();
    // navigation.navigate('CommunitiesMain', {removedCommunity: true});
  };
  const onPressBack = () => {
    if (isProfileScreen) {
      navigation.goBack();
    } else {
      navigation.navigate('CommunitiesMain');
    }
    onClearCommunityDataById();
  };
  const onPressShare = async () => {
    try {
      const result = await RN.Share.share({
        title: `${communityData.title}`,
        message: isAndroid
          ? `https://danceconnect.online/community/${communityData?.id}`
          : `${communityData.title}`,
        url: `https://danceconnect.online/community/${communityData?.id}`,
      });
      if (result.action === RN.Share.sharedAction) {
        if (result.activityType) {
          console.log('resi', result);
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === RN.Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error);
    }
  };
  const renderTags = () => {
    return (
      <RN.View
        style={[
          styles.tagsContainer,
          {marginTop: communityData?.images?.length > 0 ? -50 : -10},
        ]}>
        <RN.ScrollView
          horizontal
          style={styles.scrollTags}
          showsHorizontalScrollIndicator={false}>
          {communityData?.categories?.map((item: string) => {
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

  const headerOptionButtons = [
    {
      key: 'edit',
      icon: 'edit',
      isEnabled: isAdmin,
      onPress: onPressEditCommunity,
    },
    {
      key: 'more',
      icon: 'more',
      isEnabled: isAdmin ? true : isJoined,
      onPress: () => setUnFollowOpen(v => !v),
    },
    {key: 'share', icon: 'share', isEnabled: true, onPress: onPressShare},
  ];
  const opacity = new RN.Animated.Value(0);

  const onScroll = (ev: RN.NativeSyntheticEvent<RN.NativeScrollEvent>) => {
    const {y} = ev.nativeEvent.contentOffset;
    Animated.timing(opacity, {
      toValue: y / 100,
      duration: 100,
      useNativeDriver: false,
    }).start();
    setUnFollowOpen(false);
  };
  const header = () => {
    return (
      <RN.View style={styles.headerContainer}>
        <RN.Animated.View
          style={[
            styles.headerAnimateContainer,
            {backgroundColor: colors.white, opacity},
          ]}
        />
        <RN.TouchableOpacity
          style={styles.backIconContainer}
          onPress={onPressBack}>
          <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        </RN.TouchableOpacity>
        <RN.View style={{flexDirection: 'row', zIndex: 2}}>
          {headerOptionButtons.map(btn => {
            return (
              <>
                {btn?.isEnabled && (
                  <RN.TouchableOpacity
                    style={styles.headerIconContainer}
                    onPress={btn.onPress}>
                    <RN.Image
                      source={{uri: btn.icon}}
                      style={styles.backIcon}
                    />
                  </RN.TouchableOpacity>
                )}
              </>
            );
          })}
        </RN.View>
        {unFolloweOpen && (
          <RN.TouchableOpacity
            style={styles.unFollowContainer}
            onPress={isAdmin ? onPressRemove : onPressUnfollow}>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Image
                source={{uri: 'closesquare'}}
                style={{height: 20, width: 20}}
              />
            </RN.View>
            <RN.Text style={styles.unFollowText}>
              {isAdmin ? 'Remove Community' : 'Unfollow'}
            </RN.Text>
          </RN.TouchableOpacity>
        )}
      </RN.View>
    );
  };
  const renderTitle = () => {
    return (
      <>
        {renderTags()}
        <RN.View style={styles.titleContainer}>
          <RN.Text style={styles.titleName}>{communityData?.title}</RN.Text>
          <RN.Text style={styles.titleDesc}>
            {communityData?.description?.length > 40 && !openingDescription
              ? `${communityData?.description?.slice(0, 40)}...`
              : communityData?.description}
          </RN.Text>
          {communityData?.description?.length > 40 && (
            <RN.TouchableOpacity
              onPress={() => {
                RN.LayoutAnimation.configureNext(
                  RN.LayoutAnimation.Presets.easeInEaseOut,
                );
                setOpeningDescription(v => !v);
              }}
              style={styles.showWrapper}>
              <RN.Text style={styles.showMoreText}>
                {!openingDescription ? 'Show more' : 'Show less'}
              </RN.Text>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Image
                  source={{uri: 'downlight'}}
                  style={[
                    styles.arrowDownIcon,
                    {
                      transform: [
                        {
                          rotate: openingDescription ? '180deg' : '0deg',
                        },
                      ],
                    },
                  ]}
                />
              </RN.View>
            </RN.TouchableOpacity>
          )}
        </RN.View>
      </>
    );
  };

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
      </RN.ScrollView>
    );
  };
  const renderLoading = () => {
    return <RN.ActivityIndicator size={'small'} color={colors.orange} />;
  };
  const onOpenMaps = () => {
    const url = isAndroid
      ? `geo:0,0?q=${communityData?.location}`
      : `maps:0,0?q=${communityData?.location}`;
    RN.Linking.openURL(url);
  };
  const renderAttendedImgs = () => {
    const countPeople =
      attendedImgs?.length > 6
        ? `+${attendedImgs?.length - 6} joined`
        : 'joined';
    return (
      <RN.View
        style={{
          flexDirection: 'row',
          marginHorizontal: 24,
          paddingVertical: 10,
        }}>
        {attendedImgs?.slice(0, 6)?.map((img, idx) => {
          return (
            <RN.View
              style={{
                marginLeft: idx !== 0 ? -12 : 0,
                zIndex: idx !== 0 ? idx : -idx,
              }}>
              <FastImage
                source={{
                  uri: apiUrl + img?.userImage,
                  cache: FastImage.cacheControl.immutable,
                  priority: FastImage.priority.high,
                }}
                defaultSource={require('../../assets/images/defaultuser.png')}
                style={styles.attendPeopleImg}
              />
            </RN.View>
          );
        })}
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Text style={styles.attendPeopleText}>{countPeople}</RN.Text>
        </RN.View>
      </RN.View>
    );
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
              style={styles.locateText}>{`${communityData?.location}`}</RN.Text>
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
            <RN.View style={{justifyContent: 'center'}}>
              <FastImage
                source={{
                  uri: apiUrl + communityData?.creator?.image,
                  cache: FastImage.cacheControl.immutable,
                  priority: FastImage.priority.high,
                }}
                defaultSource={require('../../assets/images/defaultuser.png')}
                style={styles.organizerImg}
              />
            </RN.View>

            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.organizerName}>
                {communityData?.creator?.name}
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
        {attendedImgs?.length > 0 && renderAttendedImgs()}
      </>
    );
  };

  if (loadingById) {
    return <SkeletonCommunityScreen />;
  }

  return (
    <>
      {header()}
      <RN.ScrollView
        style={styles.container}
        onScroll={onScroll}
        scrollEventThrottle={1}
        showsVerticalScrollIndicator={false}>
        <Carousel items={communityData?.images} />
        {renderTitle()}
        {renderMapInfoOrganizer()}
        {loadSubscribe
          ? renderLoading()
          : !isAdmin &&
            !isJoined && (
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
                navigation.navigate('CreateEvent', {
                  communityData: communityData,
                })
              }
              disabled
              // isLoading={isLoadingWithFollow}
              title={'Create Event'}
            />
          </RN.View>
        )}
        {renderTabs()}
        {loadingEvents && renderLoading()}
        <CommunityEvents
          currentTab={currentTab}
          communityUid={communityId}
          isAdmin={isAdmin}
        />
      </RN.ScrollView>
    </>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  attendPeopleImg: {
    height: 38,
    width: 38,
    borderRadius: 100,
  },
  attendPeopleText: {
    fontSize: 14,
    lineHeight: 18.9,
    fontWeight: '400',
    color: '#616161',
    paddingLeft: 8,
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
    width: SCREEN_WIDTH,
    position: 'absolute',
    paddingTop: statusBarHeight + 14,
    paddingHorizontal: 24,
    zIndex: 2,
  },
  headerAnimateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH,
    position: 'absolute',
    paddingTop: isAndroid ? statusBarHeight * 4 : statusBarHeight * 2.3,
    // paddingTop: statusBarHeight * 2.2,
    // paddingHorizontal: 24,
    zIndex: 1,
  },
  headerIconContainer: {
    padding: 8,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2,
    right: 0,
    marginHorizontal: 2,
    borderRadius: 50,
  },
  backIconContainer: {
    padding: 8,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2,
    borderRadius: 50,
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
    fontFamily: 'Mulish-Regular',
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
    right: 94,
    top: isAndroid ? 100 : 126,
    borderRadius: 8,
    borderTopRightRadius: 0,
    padding: 14,
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
