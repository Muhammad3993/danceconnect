import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import Carousel from '../../components/carousel';
import moment from 'moment';
import {Button} from '../../components/Button';
import useEvents from '../../hooks/useEvents';
import useRegistration from '../../hooks/useRegistration';
import {SCREEN_WIDTH, isAndroid, statusBarHeight} from '../../utils/constants';
import SkeletonEventScreen from '../../components/skeleton/EventScreen-Skeleton';
import {useEventById} from '../../hooks/useEventById';
import {apiUrl, getTicketByEventUid} from '../../api/serverRequests';
import socket from '../../api/sockets';
import useTickets from '../../hooks/useTickets';
import FastImage from 'react-native-fast-image';
import {Animated} from 'react-native';

const EventScreen = () => {
  const routeProps = useRoute();
  const {data, createEvent, pressBtnAttend}: any = routeProps.params;
  const linkId = routeProps.params?.id ?? data?.id;
  const navigation: any = useNavigation();
  const {ticketsList, getTickets, onLoading} = useTickets();

  const {getEvent, loadingById, eventData, remove, isFollowed} =
    useEventById(linkId);
  const [openingDescription, setOpeningDescription] = useState(false);
  const {userUid, saveEmail} = useRegistration();
  const {attendEvent, onClearEventDataById} = useEvents();
  const [unFolloweOpen, setUnFollowOpen] = useState(false);
  // const [displayedData, setDisplayedData] = useState(eventData);
  const isPassedEvent =
    moment(eventData?.eventDate?.startDate).format('YYYY-MM-DD') <
    moment(new Date()).format('YYYY-MM-DD');
  const [loadSubscribe, setLoadSubscribe] = useState(false);
  const [attendedImgs, setAttendedImgs] = useState([]);

  const isManager = eventData?.managers?.find(i => i === userUid);
  const isAdmin = eventData?.creator?.uid === userUid;

  const [tickets, setTickers] = useState([]);

  const [myTicketsByEvent, setMyTicketsByEvent] = useState([]);

  const prices = ticketsList?.map((ticket: any) => ticket?.price);
  const minPriceTickets = Math.min(...prices);
  const maxPriceTickets = Math.max(...prices);
  useEffect(() => {
    if (eventData && eventData.id) {
      getTicketByEventUid(eventData?.id).then(res => {
        setTickers(res);
      });
      // getTickets(eventData?.id);
      getTicketByEventUid(eventData?.id).then(res => {
        setMyTicketsByEvent(res);
      });
      setAttendedImgs(eventData?.userImages);
    }
  }, [eventData, eventData?.id]);

  useEffect(() => {
    if (!loadingById && eventData && eventData?.id) {
      getTickets(eventData.id);
    }
  }, [loadingById]);
  useEffect(() => {
    if (pressBtnAttend) {
      onPressAttend();
    }
  }, [pressBtnAttend]);

  useEffect(() => {
    getEvent();
  }, [linkId]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getTickets(eventData?.id);
      getTicketByEventUid(eventData?.id).then(res => {
        setTickers(res);
      });
    });
    return unsubscribe;
  }, [navigation, eventData?.id]);

  const onPressShowText = () => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setOpeningDescription(v => !v);
  };

  // useEffect(() => {
  //   setAttendedImgs(eventData?.userImages);
  // }, [eventData?.userImages]);

  // useEffect(() => {
  //   socket.on('subscribed_event', socket_data => {
  //     // console.log('currentEvent data', socket_data);
  //     // RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.linear);
  //     setAttendedImgs(socket_data?.userImages);
  //     if (socket_data?.currentEvent) {
  //       const follow = socket_data?.currentEvent?.attendedPeople?.findIndex(
  //         (i: {userUid: string}) => i.userUid === userUid,
  //       );
  //       getEventSuccess(socket_data.currentEvent, follow);
  //       setLoading(false);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  }, [loadSubscribe]);

  const onPressAttend = async () => {
    socket.connect();
    if (isFollowed) {
      if (!myTicketsByEvent.length) {
        if (ticketsList.length > 0) {
          navigation.navigate('BuyTickets', {
            tickets: ticketsList,
            eventUid: eventData.id,
          });
        } else {
          attendEvent(eventData?.id);
        }
      } else {
        onPressTicket();
      }
    } else if (ticketsList.length > 0) {
      navigation.navigate('BuyTickets', {
        tickets: ticketsList,
        eventUid: eventData.id,
      });
    } else {
      attendEvent(eventData?.id);
    }
  };

  const onPressTicket = () => {
    navigation.navigate('Tickets', {eventUid: eventData.id});
  };
  const onPressUnSubscribe = () => {
    setLoadSubscribe(true);
    setUnFollowOpen(v => !v);
    socket.connect();
    attendEvent(eventData?.id);
  };
  const onPressEditEvent = () => {
    navigation.navigate('EditEvent', eventData);
  };
  const onPressRemove = async () => {
    setUnFollowOpen(v => !v);
    remove();
  };
  const onPressBuyTickets = () => {
    navigation.navigate('BuyTickets', {tickets: ticketsList});
  };
  const onPressBack = () => {
    onClearEventDataById();
    if (createEvent) {
      navigation.navigate('Events');
    } else {
      navigation.goBack();
    }
  };
  const onPressShare = async () => {
    try {
      const result = await RN.Share.share({
        title: `${eventData.title}`,
        message: isAndroid
          ? `https://danceconnect.online/event/${eventData?.id}`
          : `${eventData.title}`,
        url: `https://danceconnect.online/event/${eventData?.id}`,
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
      console.log(error.message);
    }
  };

  const headerOptionButtons = [
    {
      key: 'edit',
      icon: 'edit',
      isEnabled: !isPassedEvent && (isAdmin || isManager),
      onPress: onPressEditEvent,
    },
    {
      key: 'more',
      icon: 'more',
      isEnabled: !isPassedEvent
        ? false
        : isManager
        ? false
        : isAdmin
        ? ticketsList?.length <= 0
        : isFollowed
        ? ticketsList?.length > 0
          ? false
          : true
        : false,
      onPress: () => setUnFollowOpen(v => !v),
    },
    {key: 'share', icon: 'share', isEnabled: true, onPress: onPressShare},
  ];
  const opacity = new Animated.Value(0);

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
                      style={[styles.backIcon]}
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
            onPress={
              isAdmin
                ? onPressRemove
                : tickets?.length > 0
                ? null
                : onPressUnSubscribe
            }>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Image
                source={{uri: 'closesquare'}}
                style={{height: 20, width: 20}}
              />
            </RN.View>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.unFollowText}>
                {isAdmin ? 'Remove Event' : 'Un-attend'}
              </RN.Text>
            </RN.View>
          </RN.TouchableOpacity>
        )}
        {/* </RN.Animated.View> */}
      </RN.View>
    );
  };
  const renderAttendedImgs = () => {
    const countPeople =
      attendedImgs?.length > 6 ? `+${attendedImgs?.length - 6} going` : 'going';
    const onPressAttended = () => {
      navigation.navigate('AttendedPeople', {
        usersArray: attendedImgs,
        header: 'Participants',
      });
    };
    return (
      <RN.TouchableOpacity
        onPress={onPressAttended}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          marginHorizontal: 20,
          paddingVertical: 20,
        }}>
        {attendedImgs?.slice(0, 6)?.map((img, idx) => {
          return (
            <RN.View
              style={{
                marginLeft: idx !== 0 ? -12 : 0,
                zIndex: idx !== 0 ? idx : -idx,
              }}>
              {img?.userImage !== null ? (
                <FastImage
                  source={{
                    uri: apiUrl + img?.userImage,
                    cache: FastImage.cacheControl.immutable,
                    priority: FastImage.priority.high,
                  }}
                  defaultSource={require('../../assets/images/defaultuser.png')}
                  style={styles.attendPeopleImg}
                />
              ) : (
                <RN.Image
                  source={require('../../assets/images/defaultuser.png')}
                  style={styles.attendPeopleImg}
                />
              )}
              {/* <FastImage
                source={{
                  uri: apiUrl + img?.userImage,
                  cache: FastImage.cacheControl.immutable,
                  priority: FastImage.priority.high,
                }}
                defaultSource={require('../../assets/images/defaultuser.png')}
                style={styles.attendPeopleImg}
              /> */}
            </RN.View>
          );
        })}
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Text style={styles.attendPeopleText}>{countPeople}</RN.Text>
        </RN.View>
      </RN.TouchableOpacity>
    );
  };
  const renderTitle = () => {
    return (
      <>
        {renderTags()}
        <RN.View style={styles.titleContainer}>
          <RN.Text style={styles.titleName}>{eventData?.title}</RN.Text>
        </RN.View>
        {renderAttendedImgs()}
      </>
    );
  };
  const renderTags = () => {
    return (
      <RN.View
        style={[
          styles.tagsContainer,
          {marginTop: data?.images?.length > 0 ? -50 : -10},
        ]}>
        <RN.ScrollView
          horizontal
          style={styles.scrollTags}
          showsHorizontalScrollIndicator={false}>
          {eventData?.typeEvent && (
            <RN.View style={styles.typeEventContainer}>
              <RN.Text style={{color: colors.white}}>
                {eventData?.typeEvent}
              </RN.Text>
            </RN.View>
          )}
          {eventData?.categories?.map((item: string) => {
            return (
              <RN.View style={styles.tagItem}>
                <RN.Text style={{color: colors.purple}}>{item}</RN.Text>
              </RN.View>
            );
          })}
          <RN.View style={{paddingRight: 44}} />
        </RN.ScrollView>
      </RN.View>
    );
  };
  const renderEventDate = () => {
    return (
      <RN.View style={styles.eventDateContainer}>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.View style={styles.calendarWrapper}>
            <RN.Image source={{uri: 'calendar'}} style={styles.calendarIcon} />
          </RN.View>
        </RN.View>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Text style={styles.eventDateText}>
            {`${moment(eventData?.eventDate?.startDate).format(
              'ddd',
            )}, ${moment(eventData?.eventDate?.startDate).format('MMM D')}${
              eventData?.eventDate?.endDate
                ? ' - ' + moment(eventData?.eventDate?.endDate).format('MMM D')
                : ''
            } • ${moment(eventData?.eventDate?.time).format('HH:mm')}`}
          </RN.Text>
          <RN.Text style={{color: colors.darkGray}}>{`GMT ${moment(
            eventData?.eventDate?.time,
          )
            .format('Z')
            ?.replace('0', '')
            ?.replace(':', '')
            ?.replace('0', '')
            ?.replace('0', '')}`}</RN.Text>
        </RN.View>
      </RN.View>
    );
  };
  const onOpenMaps = () => {
    const url = isAndroid
      ? `geo:0,0?q=${eventData?.place},${eventData?.location}`
      : `maps:0,0?q=${eventData?.place},${eventData?.location}`;
    RN.Linking.openURL(url);
  };
  // console.log('ticketsList.filter(i => i.items.length > 0)', ticketsList.filter(i => i.items.length > 0));
  const renderOrganizer = () => {
    return (
      <>
        <RN.View style={styles.organizerContainer}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.View style={{justifyContent: 'center'}}>
              {eventData?.creator?.userImage !== null ? (
                <FastImage
                  source={{
                    uri: apiUrl + eventData?.creator?.userImage,
                    cache: FastImage.cacheControl.immutable,
                    priority: FastImage.priority.high,
                  }}
                  defaultSource={require('../../assets/images/defaultuser.png')}
                  style={styles.organizerImg}
                />
              ) : (
                <RN.Image
                  source={require('../../assets/images/defaultuser.png')}
                  style={styles.organizerImg}
                />
              )}
            </RN.View>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.organizerName}>
                {eventData?.creator?.name}
              </RN.Text>
              <RN.Text style={styles.organizer}>Organizer</RN.Text>
            </RN.View>
          </RN.View>
        </RN.View>
        {renderEventDate()}
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
            <RN.View
              style={{justifyContent: 'center', maxWidth: SCREEN_WIDTH / 1.8}}>
              <RN.Text numberOfLines={1} style={styles.locateText}>
                {eventData?.place}
              </RN.Text>
              <RN.Text style={{color: colors.darkGray, paddingLeft: 12}}>
                {eventData?.location}
              </RN.Text>
            </RN.View>
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
        {renderPrice()}
        {!isPassedEvent &&
          (isAdmin || isManager) &&
          ticketsList?.length > 0 && (
            <>
              <Button
                title="Manage tickets"
                disabled
                onPress={() =>
                  navigation.navigate('EditEvent', {
                    ...eventData,
                    isEditTicket: true,
                  })
                }
                buttonStyle={styles.manageTicketsBtn}
              />
              {ticketsList.filter(i => i.items.length > 0).length > 0 && (
                <RN.TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SoldTickets', {
                      ticketsList: ticketsList,
                      eventUid: eventData.id,
                    });
                  }}>
                  <RN.Text
                    style={{
                      textAlign: 'center',
                      color: colors.purple,
                      fontSize: 18,
                    }}>
                    See tickets sold
                  </RN.Text>
                </RN.TouchableOpacity>
              )}
            </>
          )}
      </>
    );
  };
  const renderLoading = () => {
    return (
      <RN.View style={{alignItems: 'center', paddingVertical: 8}}>
        <RN.ActivityIndicator
          animating={onLoading}
          size={'small'}
          color={colors.orange}
        />
      </RN.View>
    );
  };
  const renderPrice = () => {
    if (onLoading) {
      return renderLoading();
    }
    if (ticketsList?.length > 0) {
      return (
        <RN.View style={styles.mapInfoContainer}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.View
                style={{
                  backgroundColor: colors.transparentPurple,
                  padding: 10,
                  borderRadius: 100,
                }}>
                <RN.Image
                  source={{uri: 'ticketfull'}}
                  style={{height: 20, width: 20, tintColor: colors.purple}}
                />
              </RN.View>
            </RN.View>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text numberOfLines={1} style={styles.locateText}>
                {`$ ${minPriceTickets.toFixed(2)} ${
                  maxPriceTickets !== minPriceTickets
                    ? '- ' + maxPriceTickets.toFixed(2)
                    : ''
                }`}
              </RN.Text>
              <RN.Text style={{color: colors.darkGray, paddingLeft: 12}}>
                {'Ticket price depends on package'}
              </RN.Text>
            </RN.View>
          </RN.View>
        </RN.View>
      );
    }
    return (
      <RN.View style={styles.mapInfoContainer}>
        <RN.View style={{flexDirection: 'row'}}>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.View
              style={{
                backgroundColor: colors.transparentPurple,
                padding: 10,
                borderRadius: 100,
              }}>
              <RN.Image
                source={{uri: 'ticketfull'}}
                style={{height: 20, width: 20, tintColor: colors.purple}}
              />
            </RN.View>
          </RN.View>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Text numberOfLines={1} style={styles.locateText}>
              Free event
            </RN.Text>
          </RN.View>
        </RN.View>
      </RN.View>
    );
  };
  const renderDescription = () => {
    const description =
      eventData?.description?.length > 40 && !openingDescription
        ? `${eventData.description.slice(0, 40)}...`
        : eventData?.description;
    return (
      <RN.View style={styles.descWrapper}>
        <RN.Text style={styles.aboutText}>About this event</RN.Text>
        <RN.Text
          numberOfLines={
            openingDescription ? eventData?.description?.length : 3
          }
          style={styles.titleDesc}>
          {description}
        </RN.Text>
        {eventData?.description?.length > 40 && (
          <RN.TouchableOpacity
            onPress={onPressShowText}
            activeOpacity={0.7}
            style={styles.showWrapper}>
            <RN.Text style={styles.showMoreText}>{`${
              openingDescription ? 'Show Less' : 'Show More'
            }`}</RN.Text>
            <RN.View
              style={{
                justifyContent: 'center',
              }}>
              <RN.Image
                source={{uri: 'downlight'}}
                style={[
                  {
                    transform: [
                      {rotate: openingDescription ? '180deg' : '0deg'},
                    ],
                  },
                  styles.arrowDownIcon,
                ]}
              />
            </RN.View>
          </RN.TouchableOpacity>
        )}
      </RN.View>
    );
  };

  const renderAttendBtn = () => {
    if (isFollowed && !ticketsList.length) {
      return null;
    }
    if (isManager) {
      return null;
    }
    if (isPassedEvent) {
      return (
        <RN.Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            color: colors.textPrimary,
            fontWeight: '600',
            paddingVertical: 14,
          }}>
          This event has passed
        </RN.Text>
      );
    }
    if (isFollowed && !myTicketsByEvent?.length) {
      return (
        <Button
          title={ticketsList.length > 0 ? 'Get Tickets' : 'Attend'}
          disabled={!isPassedEvent}
          buttonStyle={styles.attendBtn}
          onPress={onPressAttend}
        />
      );
    }
    return (
      <>
        <Button
          title={
            !isFollowed
              ? ticketsList.length > 0
                ? 'Get Tickets'
                : 'Attend'
              : 'Show Tickets'
          }
          disabled={!isPassedEvent}
          buttonStyle={isFollowed ? styles.ticketBtn : styles.attendBtn}
          onPress={onPressAttend}
        />
        {isFollowed &&
          ticketsList.length > 0 &&
          ticketsList.filter((i: {isVisible: boolean}) => i.isVisible).length >
            0 && (
            <RN.TouchableOpacity
              onPress={() => {
                navigation.navigate('BuyTickets', {
                  tickets: ticketsList,
                  eventUid: eventData.id,
                });
              }}>
              <RN.Text
                style={{
                  textAlign: 'center',
                  color: colors.purple,
                  fontSize: 16,
                }}>
                Get More Tickets
              </RN.Text>
            </RN.TouchableOpacity>
          )}
      </>
    );
  };
  if (loadingById) {
    return <SkeletonEventScreen />;
  }

  return (
    <>
      {header()}
      <RN.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={1}
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        <Carousel items={eventData?.images} />
        {renderTitle()}
        {/* {renderEventDate()} */}
        {renderOrganizer()}
        {!isAdmin && renderAttendBtn()}
        {renderDescription()}
      </RN.ScrollView>
    </>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  paymentModal: {
    backgroundColor: colors.white,
  },
  attendPeopleImg: {
    height: 40,
    width: 40,
    borderRadius: 100,
  },
  attendPeopleText: {
    fontSize: 14,
    lineHeight: 18.9,
    fontWeight: '400',
    color: '#616161',
    paddingLeft: 8,
  },
  ticketBtn: {
    justifyContent: 'center',
    backgroundColor: '#07BD74',
    borderRadius: 48,
    // paddingVertical: 16,
    marginHorizontal: 28,
    marginTop: 8,
    marginVertical: 14,
    alignItems: 'center',
  },
  typeEventContainer: {
    backgroundColor: colors.purple,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 4,
  },
  seeMapsText: {
    color: colors.purple,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22.4,
    marginRight: 6,
  },
  locateText: {
    fontSize: 18,
    lineHeight: 22.4,
    fontWeight: '700',
    // paddingVertical: 20,
    marginLeft: 12,
    color: colors.textPrimary,
  },
  mapInfoContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 14,
  },
  descWrapper: {
    paddingHorizontal: 24,
    marginVertical: 20,
    marginTop: 14,
  },
  aboutText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    color: colors.textPrimary,
  },
  joinedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    marginBottom: 4,
  },
  joinedText: {
    color: colors.darkGray,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 19.6,
    marginLeft: 14,
    padding: 12,
  },
  contactBtnDisabled: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 50,
    paddingHorizontal: 22,
    opacity: 0.8,
    justifyContent: 'center',
  },
  contactBtn: {
    borderWidth: 1,
    borderColor: colors.purple,
    borderRadius: 50,
    paddingHorizontal: 22,
    justifyContent: 'center',
  },
  contactText: {
    // color: colors.darkGray,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
  },
  organizerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    paddingTop: 16,
  },
  organizerName: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    fontWeight: '700',
    // paddingTop: 16,
  },
  organizerImg: {
    height: 40,
    width: 40,
    borderRadius: 100,
    marginRight: 10,
  },
  organizer: {
    color: colors.darkGray,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 19.6,
    letterSpacing: 0.2,
  },
  eventDateContainer: {
    marginHorizontal: 22,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 12,
    // paddingTop: 12,
  },
  eventDateText: {
    color: colors.textPrimary,
    fontWeight: '700',
    lineHeight: 25.2,
    letterSpacing: 0.2,
    fontSize: 18,
  },
  calendarIcon: {
    height: 18,
    width: 18,
    tintColor: colors.purple,
  },
  calendarWrapper: {
    padding: 10,
    backgroundColor: colors.transparentPurple,
    marginRight: 12,
    borderRadius: 50,
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
    height: 20,
    width: 25,
    tintColor: colors.white,
  },
  tagsContainer: {
    flexDirection: 'row',
    // marginTop: -10,
    zIndex: 1,
  },
  tagItem: {
    backgroundColor: colors.white,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 4,
    borderWidth: 1,
    borderColor: colors.purple,
  },
  scrollTags: {
    paddingHorizontal: 24,
  },
  titleContainer: {
    marginHorizontal: 24,
    paddingTop: 16,
  },
  titleName: {
    color: colors.textPrimary,
    fontSize: 24,
    lineHeight: 28.8,
    fontWeight: '700',
    fontFamily: 'Mulish-Regular',
  },
  titleDesc: {
    color: colors.darkGray,
    fontSize: 16,
    lineHeight: 22.4,
    fontWeight: '500',
    paddingTop: 6,
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
  attendBtn: {
    // fontSize: 12,
    marginVertical: 8,
    marginHorizontal: 24,
  },
  manageTicketsBtn: {
    // fontSize: 12,
    marginVertical: 28,
    marginBottom: 12,
    marginHorizontal: 24,
    marginTop: 4,
    backgroundColor: 'tranparent',
    color: colors.purple,
    borderColor: colors.purple,
    borderWidth: 1,
  },
  unFollowContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 3,
    right: 94,
    // top: statusBarHeight + iAndroid ? 120 : 80, //TODO android
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
export default EventScreen;
