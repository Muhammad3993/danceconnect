import React, {useEffect, useRef, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import {Button} from '../../components/Button';
import useRegistration from '../../hooks/useRegistration';
import {useCommunities} from '../../hooks/useCommunitites';
import {useCommunityById} from '../../hooks/useCommunityById';
import Carousel from '../../components/carousel';
import SkeletonCommunityScreen from '../../components/skeleton/CommunityScreen-Skeleton';
import {SCREEN_WIDTH, isAndroid, statusBarHeight} from '../../utils/constants';
import socket from '../../api/sockets';
import {apiUrl} from '../../api/serverRequests';
import CommunityEvents from '../../components/communityEvents';
import FastImage from 'react-native-fast-image';
import {Animated} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {useTranslation} from 'react-i18next';
import {defaultProfile} from '../../utils/images';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import {ChannelRepository} from '@amityco/ts-sdk';

interface Props {
  navigation: NativeStackNavigationProp<any>;
}

const CommunityScreen = ({route, navigation}: Props) => {
  const {t} = useTranslation();
  const removeModalizeRef = useRef<Modalize>(null);
  const {userUid} = useRegistration();
  const {startFollowed, isSaveChanges, onClearCommunityDataById} =
    useCommunities();

  const {data}: any = route.params;
  const communityId = (route.params && route.params?.id) ?? data?.id;
  const {isProfileScreen}: any = route.params;
  const {remove, getCommunity, communityData, loadingById} =
    useCommunityById(communityId);
  const [openingDescription, setOpeningDescription] = useState(false);
  const [unFolloweOpen, setUnFollowOpen] = useState(false);
  const isAdmin = communityData?.creator?.uid === userUid;

  const [loadSubscribe, setLoadSubscribe] = useState(false);
  const isManager =
    communityData?.managers?.length > 0 &&
    communityData?.managers?.find(i => i === userUid);

  useEffect(() => {
    getCommunity();

    return () => {
      onClearCommunityDataById();
    };
  }, []);

  useEffect(() => {
    if (isSaveChanges) {
      getCommunity();
    }
  }, [isSaveChanges]);
  const [isJoined, setIsJoined] = useState();
  const [attendedImgs, setAttendedImgs] = useState([]);

  useEffect(() => {
    if (communityData !== null) {
      setAttendedImgs(communityData?.followers);
    }
  }, [communityData, communityData?.followers]);

  useEffect(() => {
    setIsJoined(
      communityData?.followers?.find(
        (user: {_id: any}) => user?._id === userUid,
      ),
    );
  }, [communityData?.followers, userUid]);

  useEffect(() => {
    socket.on('subscribed', socket_data => {
      // console.log('socket_data?.currentCommunity', socket_data);
      if (socket_data?.currentCommunity?.id === communityId) {
        setIsJoined(
          socket_data?.currentCommunity?.followers.find(
            (user: {userUid: any}) => user?.userUid === userUid,
          ),
        );
        // RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.linear);
        setAttendedImgs(socket_data?.userImages);
        setLoadSubscribe(false);
      }
    });
  }, [communityId, userUid]);

  const onPressEditCommunity = () => {
    navigation.push('EditCommunity', communityData);
  };

  const onPressJoin = () => {
    setLoadSubscribe(true);
    startFollowed(communityData?.id, communityData.channelId);
  };

  const onWriteChat = async () => {
    navigation.push('Chat', {
      channel: {
        defaultSubChannelId: communityData.channelId,
        channelId: communityData.channelId,
      },
    });
  };

  const onPressUnfollow = () => {
    setLoadSubscribe(true);
    startFollowed(communityData?.id, communityData.channelId);
    setUnFollowOpen(v => !v);
  };
  const onPressRemove = async () => {
    setUnFollowOpen(v => !v);
    remove(isProfileScreen ? 'Profile' : 'Community');
    // navigation.navigate('CommunitiesMain', {removedCommunity: true});
  };
  const onPressRemoveCommunity = () => {
    setUnFollowOpen(v => !v);
    removeModalizeRef.current?.open();
  };
  const onPressAddMenegers = () => {
    setUnFollowOpen(v => !v);
    navigation.push('Managers', {id: communityId});
  };
  const onPressBack = () => {
    if (isProfileScreen && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('TABS', {screen: 'Communities'});
    }
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
          // console.log('resi', result);
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
          {communityData?.categories?.map((item: string, idx: number) => {
            return (
              <RN.View style={styles.tagItem} key={idx}>
                <RN.Text style={{color: colors.white}}>{item}</RN.Text>
              </RN.View>
            );
          })}
          <RN.View style={{paddingRight: 44}} />
        </RN.ScrollView>
      </RN.View>
    );
  };
  const onPressOrganizer = () => {
    navigation.push('User', {id: communityData?.creator.uid});
  };

  const headerOptionButtons = [
    {
      key: 'edit',
      icon: 'edit',
      isEnabled: isAdmin || isManager,
      onPress: onPressEditCommunity,
    },
    {
      key: 'more',
      icon: 'more',
      isEnabled: isAdmin ? true : isManager ? false : isJoined,
      onPress: () => setUnFollowOpen(v => !v),
      options: [
        {
          key: 'add',
          label: t('add_managers'),
          onPress: () => onPressAddMenegers(),
          icon: 'members',
          visible: isAdmin,
          iconColor: colors.textPrimary,
        },
        {
          key: 'unfollow',
          label: isAdmin ? t('remove_community') : t('unfollow'),
          onPress: isAdmin ? onPressRemoveCommunity : onPressUnfollow,
          icon: 'closesquare',
          visible: true,
          iconColor: colors.redError,
        },
      ],
    },
    {key: 'share', icon: 'share', isEnabled: true, onPress: onPressShare},
  ];
  const moreActions = headerOptionButtons
    .filter(i => i?.options)
    .map(i => i.options)
    .flat(1);

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

  const shouldJoinChat = !isAdmin && !isJoined && !isManager;

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
          <RN.View style={{position: 'absolute', right: SCREEN_WIDTH / 10}}>
            {moreActions.map(item => {
              const isLast = moreActions[moreActions.length - 1]?.key;
              const isVisible = item?.visible;
              if (!isVisible) {
                return null;
              }
              return (
                <RN.TouchableOpacity
                  key={item?.key}
                  onPress={item?.onPress}
                  style={[
                    styles.unFollowContainer,
                    {
                      borderBottomLeftRadius: isLast === item?.key ? 8 : 0,
                      borderBottomRightRadius: isLast === item?.key ? 8 : 0,
                      borderTopLeftRadius:
                        isLast === item?.key ? (isAdmin ? 0 : 8) : 8,
                      borderTopRightRadius: isLast === item?.key ? 0 : 8,
                      borderBottomWidth: isLast === item?.key ? 0 : 0.5,
                    },
                  ]}>
                  <RN.View style={{justifyContent: 'center'}}>
                    <RN.Image
                      source={{uri: item?.icon}}
                      style={{height: 20, width: 20, tintColor: item.iconColor}}
                    />
                  </RN.View>
                  <RN.View style={{justifyContent: 'center'}}>
                    <RN.Text style={styles.unFollowText}>{item?.label}</RN.Text>
                  </RN.View>
                </RN.TouchableOpacity>
              );
            })}
          </RN.View>
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
                {!openingDescription ? t('show_more') : t('show_less')}
              </RN.Text>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Image
                  source={{uri: 'downlight'}}
                  style={[
                    styles.arrowDownIcon,
                    {
                      transform: [
                        {rotate: openingDescription ? '180deg' : '0deg'},
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

  const onOpenMaps = () => {
    const url = isAndroid
      ? `geo:0,0?q=${communityData?.location}`
      : `maps:0,0?q=${communityData?.location}`;
    RN.Linking.openURL(url);
  };
  const renderAttendedImgs = () => {
    const countPeople =
      attendedImgs?.length > 6
        ? `+${t('followers', {count: attendedImgs?.length - 6})}`
        : t('followed');
    const onPressAttended = () => {
      navigation.push('AttendedPeople', {
        usersArray: attendedImgs,
        header: 'Community Members',
      });
    };
    return (
      <RN.TouchableOpacity
        onPress={onPressAttended}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          marginHorizontal: 24,
          paddingVertical: 10,
        }}>
        {attendedImgs?.slice(0, 6)?.map((img, idx) => {
          return (
            <RN.View
              key={idx}
              style={{
                marginLeft: idx !== 0 ? -12 : 0,
                zIndex: idx !== 0 ? idx : -idx,
              }}>
              <FastImage
                source={
                  img?.userImage
                    ? {
                        uri: apiUrl + img?.userImage,
                        cache: FastImage.cacheControl.immutable,
                        priority: FastImage.priority.high,
                      }
                    : defaultProfile
                }
                defaultSource={defaultProfile}
                style={styles.attendPeopleImg}
              />
            </RN.View>
          );
        })}
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Text style={styles.attendPeopleText}>{countPeople}</RN.Text>
        </RN.View>
      </RN.TouchableOpacity>
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
              <RN.Text style={styles.seeMapsText}>{t('maps')}</RN.Text>
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
          <RN.TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={onPressOrganizer}>
            <RN.View style={{justifyContent: 'center'}}>
              <FastImage
                source={
                  communityData?.creator?.image
                    ? {
                        uri: apiUrl + communityData?.creator?.image,
                        cache: FastImage.cacheControl.immutable,
                        priority: FastImage.priority.high,
                      }
                    : defaultProfile
                }
                defaultSource={defaultProfile}
                style={styles.organizerImg}
              />
            </RN.View>

            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.organizerName}>
                {communityData?.creator?.name}
              </RN.Text>
              <RN.Text style={styles.organizer}>{t('organizer')}</RN.Text>
            </RN.View>
          </RN.TouchableOpacity>
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

        <RN.View style={styles.btnJoin}>
          <Button
            isLoading={loadSubscribe}
            onPress={shouldJoinChat ? onPressJoin : onWriteChat}
            disabled
            buttonStyle={shouldJoinChat ? undefined : styles.btnMessage}
            title={shouldJoinChat ? t('join') : 'Write to chat'}
          />
        </RN.View>
        {(isAdmin || isManager) && (
          <RN.View style={styles.btnJoin}>
            <Button
              onPress={() =>
                navigation.push('CreateEvent', {communityData: communityData})
              }
              disabled
              // isLoading={isLoadingWithFollow}
              title={t('create_event')}
            />
          </RN.View>
        )}
        {!loadingById && (
          <CommunityEvents
            isAdmin={isAdmin}
            eventsIds={communityData?.eventsIds}
          />
        )}
      </RN.ScrollView>
      <Portal>
        <Modalize
          withHandle={false}
          adjustToContentHeight
          closeOnOverlayTap={false}
          panGestureEnabled={false}
          modalStyle={styles.modalContainer}
          ref={removeModalizeRef}>
          <RN.Text style={styles.removeCommunityTitle}>
            {t('remove_question')}
          </RN.Text>
          <RN.View
            style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <RN.TouchableOpacity
              style={styles.removeCommunityBtnCancel}
              onPress={() => removeModalizeRef?.current?.close()}>
              <RN.Text style={styles.deleteTextCancel}>{t('cancel')}</RN.Text>
            </RN.TouchableOpacity>
            <RN.TouchableOpacity
              style={styles.removeCommunityBtn}
              onPress={onPressRemove}>
              <RN.Text style={styles.deleteText}>{t('yes_delete')}</RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
        </Modalize>
      </Portal>
    </>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  modalContainer: {
    position: 'absolute',
    right: 20,
    left: 20,
    bottom: '50%',
    borderRadius: 12,
  },
  removeCommunityBtnCancel: {
    borderRadius: 100,
    backgroundColor: colors.orange,
    marginVertical: 22,
    marginTop: 0,
  },
  removeCommunityBtn: {
    borderRadius: 100,
    backgroundColor: colors.redError,
    marginVertical: 22,
    marginTop: 0,
    justifyContent: 'center',
  },
  removeCommunityTitle: {
    textAlign: 'center',
    padding: 18,
    fontSize: 22,
    lineHeight: 24.6,
    fontWeight: '600',
    paddingTop: 34,
    color: colors.textPrimary,
  },
  removeCommunityDesc: {
    textAlign: 'center',
    padding: 18,
    fontSize: 18,
    lineHeight: 24.6,
    paddingTop: 0,
    color: colors.textPrimary,
  },
  deleteText: {
    paddingHorizontal: 34,
    fontSize: 18,
    lineHeight: 22.4,
    color: colors.white,
    textAlign: 'center',
    paddingVertical: 14,
    fontWeight: '600',
  },
  deleteTextCancel: {
    paddingHorizontal: 34,
    fontSize: 18,
    lineHeight: 22.4,
    color: colors.white,
    textAlign: 'center',
    paddingVertical: 14,
    fontWeight: '600',
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
    paddingTop: 18,
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
    fontFamily: 'Lato-Regular',
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
    // position: 'relative',
    zIndex: 3,
    right: 54,
    top: isAndroid ? 100 : 126,
    // borderRadius: 8,
    padding: 14,
    borderBottomColor: colors.darkGray,
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
