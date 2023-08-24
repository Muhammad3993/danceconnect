import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import Carousel from '../../components/carousel';
import moment from 'moment';
import {Button} from '../../components/Button';
import useEvents from '../../hooks/useEvents';
import useRegistration from '../../hooks/useRegistration';
import {
  MERCHANT_ID,
  SCREEN_WIDTH,
  STRIPE_PUBLIC_KEY,
  statusBarHeight,
} from '../../utils/constants';
import SkeletonEventScreen from '../../components/skeleton/EventScreen-Skeleton';
import {useEventById} from '../../hooks/useEventById';
import {diablePayEvent, getTickets, payEvent} from '../../api/serverRequests';
import socket from '../../api/sockets';
import {
  BillingDetails,
  CardField,
  PlatformPay,
  PlatformPayButton,
  StripeProvider,
  confirmPayment,
  confirmPlatformPayPayment,
} from '@stripe/stripe-react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';

const EventScreen = () => {
  const routeProps = useRoute();
  const navigation = useNavigation();
  const {data, createEvent}: any = routeProps.params;
  const openPaymentModal = useRef<Modalize>(null);

  const {getEvent, loadingById, eventData, remove} = useEventById(data?.id);
  const [openingDescription, setOpeningDescription] = useState(false);
  const {userUid, saveEmail} = useRegistration();
  const {attendEvent, onClearEventDataById} = useEvents();
  const [unFolloweOpen, setUnFollowOpen] = useState(false);
  // const [displayedData, setDisplayedData] = useState(eventData);
  const isPassedEvent = eventData?.eventDate?.time < new Date().getTime();

  const [loadSubscribe, setLoadSubscribe] = useState(false);
  const [isFollowed, setIsFollowed] = useState(
    eventData?.attendedPeople?.find(
      (user: {userUid: any}) => user?.userUid === userUid,
    ),
  );
  const [attendedImgs, setAttendedImgs] = useState([]);

  const isAdmin = eventData?.creator?.uid === userUid;
  const total =
    (Number(eventData?.price) / 100) * 10 + Number(eventData?.price);

  const [cardDisabled, setCardDisabled] = useState(true);
  const [paymentError, setPaymentError] = useState('');
  const [disablePaymentBtn, setDisablePaymentBtn] = useState(false);
  const [showPaymentBtn, setShowPaymentBtn] = useState(true);

  useEffect(() => {
    getEvent();
  }, []);
  useEffect(() => {
    setShowPaymentBtn(!isFollowed && total > 0);
  }, [isFollowed, total]);

  const onPressShowText = () => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setOpeningDescription(v => !v);
  };

  useEffect(() => {
    setAttendedImgs(eventData?.userImages);
  }, [eventData?.userImages]);

  useEffect(() => {
    socket.on('subscribed_event', socket_data => {
      // console.log('currentEvent data', socket_data?.currentEvent?.attendedPeople);
      // if (socket_data?.currentEvent) {
      // setDisplayedData(socket_data?.currentEvent);
      RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.linear);
      // setAttendedImgs(socket_data?.userImages);
      setFollowed(socket_data?.currentEvent?.attendedPeople);
      // setIsFollowed(
      //   socket_data?.currentEvent?.attendedPeople?.find(
      //     (user: {userUid: any}) => user.userUid === userUid,
      //   ),
      // );
      // // socket.emit('updated_events');
      // setAttendedImgs(eventData?.userImages);
      setDisablePaymentBtn(false);
      // }
    });
  }, []);
  const setFollowed = useCallback(
    (attendedList: string[]) => {
      const isFollow = attendedList
        ?.map(user => user?.userUid)
        ?.findIndex(id => id === userUid);
      // setIsFollowed()
      if (isFollow === 1) {
        setIsFollowed(true);
        setLoadSubscribe(false);
      } else {
        setIsFollowed(false);
        setLoadSubscribe(false);
      }
      console.log('isFollow', isFollow);
    },
    [userUid],
  );
  useEffect(() => {
    setFollowed(data?.attendedPeople);
  }, []);

  useEffect(() => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  }, [loadSubscribe]);

  const confirmPaymentByCard = () => {
    const billingDetails: BillingDetails = {
      email: saveEmail,
    };
    setDisablePaymentBtn(true);
    socket.connect();
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    // attendEvent(eventData?.id);
    const amount = Math.floor(total * 100);
    payEvent(eventData?.id, amount).then(async res => {
      const {clientSecret} = res;
      const {paymentIntent, error} = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails,
        },
      });
      if (error) {
        console.log('payEvent er', error);
        diablePayEvent(res?.id).then();
        RN.LayoutAnimation.configureNext(
          RN.LayoutAnimation.Presets.easeInEaseOut,
        );
        setDisablePaymentBtn(false);
        setShowPaymentBtn(true);
        // setLoadSubscribe(false);
        setPaymentError(error?.localizedMessage);
      } else {
        if (paymentIntent?.status === 'Succeeded') {
          attendEvent(eventData?.id);
          openPaymentModal.current?.close();
          setDisablePaymentBtn(false);
        }
      }
    });
  };

  const onPressApplePayBtn = () => {
    setDisablePaymentBtn(true);
    // socket.connect();
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    const amount = Math.floor(total * 100);
    payEvent(eventData?.id, amount).then(async res => {
      const {clientSecret} = res;
      const {error, paymentIntent} = await confirmPlatformPayPayment(
        clientSecret,
        {
          applePay: {
            cartItems: [
              {
                label: eventData?.title,
                amount: total.toString(),
                paymentType: PlatformPay.PaymentType.Immediate,
              },
              {
                label: 'Dance Connect',
                amount: total.toString(),
                paymentType: PlatformPay.PaymentType.Immediate,
              },
            ],
            merchantCountryCode: 'US',
            currencyCode: 'USD',
            requiredBillingContactFields: [
              PlatformPay.ContactField.EmailAddress,
            ],
          },
        },
      );
      if (error) {
        // console.log('payEvent er', error, res);
        diablePayEvent(res?.id).then();
        RN.LayoutAnimation.configureNext(
          RN.LayoutAnimation.Presets.easeInEaseOut,
        );
        // setLoadSubscribe(false);
        setShowPaymentBtn(true);
        setDisablePaymentBtn(false);
      } else {
        if (paymentIntent?.status === 'Succeeded') {
          attendEvent(eventData?.id);
          openPaymentModal.current?.close();
        }
        setDisablePaymentBtn(false);
      }
    });
  };
  const onPressAttend = async () => {
    socket.connect();
    setShowPaymentBtn(false);
    setLoadSubscribe(true);
    if (Number(eventData?.price) > 0) {
      openPaymentModal.current?.open();
    } else {
      attendEvent(eventData?.id);
    }
  };

  const onPressTicket = (eventUid: string) => {
    getTickets().then(ticketsList => {
      const tickets = Object.values(ticketsList).flat();
      const currentTicket = tickets.find(
        ticket => ticket?.currentTicket?.eventUid === eventUid,
      );
      navigation.navigate('Ticket', currentTicket?.currentTicket);
    });
  };
  const onPressUnSubscribe = () => {
    setLoadSubscribe(true);
    // setUnFollowOpen(false);
    // if (Number(eventData?.price) > 0) {
    //   refundPayEvent(eventData.id).then(res => {
    //     setLoadSubscribe(false);
    //   });
    //   attendEvent(eventData?.id);
    // } else {
    //   attendEvent(eventData?.id);
    // }
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
  const onPressBack = () => {
    onClearEventDataById();
    if (createEvent) {
      navigation.navigate('Events');
    } else {
      navigation.goBack();
    }
  };
  useMemo(() => {
    if (paymentError.length > 0) {
      setTimeout(() => {
        setPaymentError('');
      }, 5000);
    }
  }, [paymentError]);
  const header = () => {
    return (
      <>
        <RN.TouchableOpacity
          style={styles.backIconContainer}
          onPress={onPressBack}>
          <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        </RN.TouchableOpacity>
        {!isAdmin && isFollowed && Number(eventData?.price) <= 0 && (
          <RN.TouchableOpacity
            style={styles.moreIconContainer}
            onPress={() => setUnFollowOpen(v => !v)}>
            <RN.Image source={{uri: 'more'}} style={styles.backIcon} />
          </RN.TouchableOpacity>
        )}
        {isAdmin && !isPassedEvent && (
          <RN.TouchableOpacity
            style={[
              styles.settingIconContainer,
              {right: Number(eventData?.price) <= 0 ? 48 : 0},
            ]}
            onPress={onPressEditEvent}>
            <RN.Image source={{uri: 'setting'}} style={styles.backIcon} />
          </RN.TouchableOpacity>
        )}
        {isAdmin && Number(eventData?.price) <= 0 && (
          <RN.TouchableOpacity
            style={styles.moreIconContainer}
            onPress={() => setUnFollowOpen(v => !v)}>
            <RN.Image source={{uri: 'more'}} style={styles.backIcon} />
          </RN.TouchableOpacity>
        )}
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
            <RN.Text style={styles.unFollowText}>{'Remove Event'}</RN.Text>
          </RN.TouchableOpacity>
        )}
        {!isAdmin && isFollowed && unFolloweOpen && (
          <RN.TouchableOpacity
            style={styles.unFollowContainer}
            onPress={onPressUnSubscribe}>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Image
                source={{uri: 'closesquare'}}
                style={{height: 20, width: 20}}
              />
            </RN.View>
            <RN.Text style={styles.unFollowText}>{'Un-attend'}</RN.Text>
          </RN.TouchableOpacity>
        )}
      </>
    );
  };
  const renderAttendedImgs = () => {
    const countPeople =
      attendedImgs?.length > 6 ? `+${attendedImgs?.length - 6} going` : 'going';
    return (
      <RN.View
        style={{
          flexDirection: 'row',
          marginHorizontal: 24,
          paddingVertical: 20,
        }}>
        {attendedImgs?.slice(0, 6)?.map((img, idx) => {
          // console.log('img', img, idx);
          const imgUri =
            typeof img !== 'undefined'
              ? {uri: 'data:image/png;base64,' + img?.userImage?.base64}
              : require('../../assets/images/defaultuser.png');
          return (
            <RN.View
              style={{
                marginLeft: idx !== 0 ? -12 : 0,
                zIndex: idx !== 0 ? idx : -idx,
              }}>
              <RN.Image
                source={imgUri}
                style={styles.attendPeopleImg}
                defaultSource={require('../../assets/images/defaultuser.png')}
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
            ?.replaceAll('0', '')
            ?.replace(':', '')}`}</RN.Text>
        </RN.View>
      </RN.View>
    );
  };
  const onOpenMaps = () => {
    const url = RN.Platform.select({
      ios: `maps:0,0?q=${eventData.place}`,
      android: `geo:0,0?q=${eventData.place}`,
    });

    RN.Linking.openURL(url);
  };
  const renderOrganizer = () => {
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
        {total > 0 && renderPrice()}
        <RN.View style={styles.organizerContainer}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.Image
              source={
                eventData?.creator?.image
                  ? {
                      uri:
                        'data:image/png;base64,' +
                        eventData?.creator?.image.base64,
                    }
                  : require('../../assets/images/defaultuser.png')
              }
              style={styles.organizerImg}
            />
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.organizerName}>
                {eventData?.creator?.name}
              </RN.Text>
              <RN.Text style={styles.organizer}>Organizer</RN.Text>
            </RN.View>
          </RN.View>
          {/* {!isAdmin && (
            <RN.TouchableOpacity
              style={
                isPassedEvent ? styles.contactBtnDisabled : styles.contactBtn
              }
              disabled={isPassedEvent}>
              <RN.Text
                style={[
                  styles.contactText,
                  {color: isPassedEvent ? colors.darkGray : colors.purple},
                ]}>
                Contact
              </RN.Text>
            </RN.TouchableOpacity>
          )} */}
        </RN.View>
      </>
    );
  };
  const renderPrice = () => {
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
              {`$ ${total}`}
            </RN.Text>
            <RN.Text style={{color: colors.darkGray, paddingLeft: 12}}>
              {'Ticket price depends on package'}
            </RN.Text>
          </RN.View>
        </RN.View>
      </RN.View>
    );
  };
  const renderDescription = () => {
    return (
      <RN.View style={styles.descWrapper}>
        <RN.Text style={styles.aboutText}>About this event</RN.Text>
        <RN.Text
          numberOfLines={
            openingDescription ? eventData?.description?.length : 3
          }
          style={styles.titleDesc}>
          {eventData?.description}
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

  const renderLoading = () => {
    return (
      <RN.View style={{marginVertical: 16}}>
        <RN.ActivityIndicator size={'small'} color={colors.orange} />
      </RN.View>
    );
  };
  const renderAttendBtn = () => {
    if (loadSubscribe) {
      return <>{renderLoading()}</>;
    }
    if (isAdmin) {
      return null;
    }
    if (total > 0 && isFollowed) {
      return (
        <>
          <RN.TouchableOpacity
            onPress={() => onPressTicket(eventData.id)}
            style={styles.ticketBtn}>
            <RN.Text
              style={[
                styles.joinedText,
                {color: colors.white, paddingLeft: 0},
              ]}>
              {'Show ticket'}
            </RN.Text>
          </RN.TouchableOpacity>
        </>
      );
    }
    if (total > 0 && showPaymentBtn) {
      return (
        <>
          <StripeProvider
            publishableKey={STRIPE_PUBLIC_KEY}
            merchantIdentifier={MERCHANT_ID}>
            <Button
              title={`Buy ticket for ${total} USD`}
              disabled={!isPassedEvent}
              onPress={onPressAttend}
              buttonStyle={styles.attendBtn}
            />
          </StripeProvider>
        </>
      );
    }
    // if (total <= 0) {
    return (
      <RN.View>
        {loadSubscribe ? (
          <>{renderLoading()}</>
        ) : isFollowed ? null : (
          <Button
            title="Attend"
            disabled={!isPassedEvent}
            onPress={onPressAttend}
            buttonStyle={styles.attendBtn}
          />
        )}
      </RN.View>
    );
    // }
  };
  if (loadingById) {
    return <SkeletonEventScreen />;
  }

  return (
    <>
      <RN.ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        {header()}
        <Carousel items={data?.images} />
        {renderTitle()}
        {renderEventDate()}
        {renderOrganizer()}
        {renderAttendBtn()}
        {renderDescription()}
      </RN.ScrollView>
      <Portal>
        <Modalize
          ref={openPaymentModal}
          closeOnOverlayTap={false}
          // onClosed={() => {
          //   setLoadSubscribe(false);
          //   // setShowPaymentBtn(true);
          // }}
          handlePosition="inside"
          modalStyle={styles.paymentModal}
          disableScrollIfPossible={false}
          adjustToContentHeight={true}>
          <RN.TouchableOpacity
            onPress={() => {
              setLoadSubscribe(false);
              setShowPaymentBtn(!isFollowed && total > 0);
              openPaymentModal.current?.close();
            }}
            style={{
              alignSelf: 'flex-end',
              margin: 14,
              backgroundColor: colors.grayTransparent,
              borderRadius: 100,
              padding: 10,
              borderWidth: 0.5,
              borderColor: colors.darkGray,
            }}>
            <RN.Image source={{uri: 'close'}} style={{height: 14, width: 14}} />
          </RN.TouchableOpacity>
          <RN.View style={{paddingVertical: 14, paddingBottom: 40}}>
            <RN.View style={{alignItems: 'center', marginTop: 4}}>
              <PlatformPayButton
                onPress={onPressApplePayBtn}
                type={PlatformPay.ButtonType.Continue}
                appearance={PlatformPay.ButtonStyle.WhiteOutline}
                borderRadius={8}
                style={{
                  width: '90%',
                  height: 50,
                }}
              />
            </RN.View>
            <CardField
              postalCodeEnabled={false}
              placeholders={{
                number: '4242 4242 4242 4242',
              }}
              cardStyle={{
                backgroundColor: '#FFFFFF',
                textColor: '#000000',
              }}
              style={{
                width: '100%',
                height: 50,
                marginVertical: 30,
              }}
              onCardChange={cardDetails => {
                // console.log('cardDetails', cardDetails);
                if (cardDetails?.complete) {
                  setCardDisabled(false);
                }
                //  else {
                //   setCardDisabled(true);
                // }
              }}
              // onFocus={focusedField => {
              //   console.log('focusField', focusedField);
              // }}
            />
            {paymentError?.length > 0 && (
              <RN.Text
                style={{
                  textAlign: 'center',
                  color: colors.redError,
                  marginTop: -12,
                }}>
                {paymentError}
              </RN.Text>
            )}
            {disablePaymentBtn ? (
              <>{renderLoading()}</>
            ) : (
              <Button
                title={`Confirm pay ${total} $`}
                disabled={!cardDisabled}
                onPress={confirmPaymentByCard}
              />
            )}
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
  paymentModal: {
    backgroundColor: colors.white,
  },
  attendPeopleImg: {
    height: 44,
    width: 44,
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
    paddingVertical: 6,
    marginHorizontal: 28,
    marginTop: 34,
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
  },
  organizerName: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    fontWeight: '700',
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
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    paddingTop: 12,
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
    top: statusBarHeight + 8,
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
    top: statusBarHeight + 8,
  },
  backIcon: {
    height: 22,
    width: 26,
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
    marginVertical: 28,
    marginHorizontal: 24,
    marginTop: 34,
  },
  settingIconContainer: {
    padding: 8,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    zIndex: 2,
    right: 0,
    margin: 12,
    marginHorizontal: 24,
    borderRadius: 50,
    top: statusBarHeight + 8,
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
export default EventScreen;
