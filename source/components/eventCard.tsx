import React, {useEffect, useMemo, useRef, useState} from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';
import moment from 'moment';
import {Button} from './Button';
import {MERCHANT_ID, SCREEN_WIDTH, STRIPE_PUBLIC_KEY} from '../utils/constants';
import useEvents from '../hooks/useEvents';
import useRegistration from '../hooks/useRegistration';
import {useNavigation} from '@react-navigation/native';
import {minWeekDay} from '../utils/helpers';
import SkeletonEventCard from './skeleton/eventCard-Skeleton';
import {diablePayEvent, getTickets, payEvent} from '../api/serverRequests';
import {
  BillingDetails,
  CardField,
  PlatformPay,
  PlatformPayButton,
  StripeProvider,
  confirmPayment,
  confirmPlatformPayPayment,
} from '@stripe/stripe-react-native';
import socket from '../api/sockets';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';

type props = {
  item?: any;
  isTicket?: boolean;
  currentTicket?: any;
};
const EventCard = ({item, isTicket, currentTicket}: props) => {
  const data = item;
  const [eventData, setEventData] = useState(data);
  const navigation = useNavigation();
  const openPaymentModal = useRef<Modalize>(null);
  // const [openPaymentModal, setOpenPaymenModal] = useState(true);
  const {userUid, saveEmail} = useRegistration();
  const isPassedEvent = data?.eventDate?.time < new Date().getTime();
  const {
    loadingAttend,
    attendEvent,
    eventsDataByCommunityId,
    loadingEvents,
    eventList,
    setSocketEvents,
  } = useEvents();
  const [crntIndex, setCrntIndex] = useState(null);
  const index = eventList?.findIndex(
    (itm: any) => itm?.eventUid === eventData.id,
  );
  const isAdmin = eventData?.creator?.uid === userUid;

  const dateEvent = `${String(
    minWeekDay.weekdaysMin(moment(eventData?.eventDate?.startDate)),
  ).toUpperCase()}, ${String(
    moment(eventData?.eventDate?.startDate).format('MMM Do'),
  ).toUpperCase()} • ${moment(eventData?.eventDate?.time).format('HH:mm')}`;

  const total = (Number(data?.price) / 100) * 10 + Number(data?.price);
  const [attendedImgs, setAttendedImgs] = useState(eventData?.userImages);
  const displayedPlaceText =
    eventData?.place?.length > 16
      ? eventData?.place?.slice(0, 16) + '...'
      : eventData?.place;

  const goToEvent = () => {
    if (isTicket) {
      navigation.navigate('Ticket', currentTicket);
    } else {
      navigation.navigate('EventScreen', {data});
    }
  };
  const [loadSubscribe, setLoadSubscribe] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  const [cardDisabled, setCardDisabled] = useState(true);
  const [paymentError, setPaymentError] = useState('');
  const [disablePaymentBtn, setDisablePaymentBtn] = useState(false);
  // console.log('data?.userImages', data?.userImages);
  useEffect(() => {
    setIsFollowed(
      eventData.attendedPeople?.find(
        (i: {userUid: string}) => i.userUid === userUid,
      ),
    );
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  }, [eventData.attendedPeople, userUid]);
  useEffect(() => {
    if (isFollowed) {
      setLoadSubscribe(false);
    }
  }, [isFollowed]);

  useEffect(() => {
    socket.on('subscribed_event', socket_data => {
      if (socket_data?.currentEvent?.id === data.id) {
        setEventData(socket_data?.currentEvent);
        // setAttendedImgs(socket_data?.userImages);
        setIsFollowed(
          socket_data?.currentEvent?.attendedPeople?.find(
            (i: {userUid: string}) => i.userUid === userUid,
          ),
        );
        // setSocketEvents(socket_data?.events);
      }
    });
  }, [data.id, loadSubscribe]);

  const renderTags = (tags: string[]) => {
    return (
      <RN.View style={styles.tagsContainer}>
        {tags?.slice(0, 2)?.map(tag => {
          return (
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.tagsItem}>{tag}</RN.Text>
            </RN.View>
          );
        })}
        {tags?.length > 3 && (
          <RN.View style={{justifyContent: 'center'}}>
            <RN.View style={styles.tagMoreItemContainer}>
              <RN.Text style={styles.tagMoreItem}>{`+${
                tags?.length - 2
              }`}</RN.Text>
            </RN.View>
          </RN.View>
        )}
      </RN.View>
    );
  };

  const renderAttendedImgs = () => {
    const countPeople =
      attendedImgs?.length > 3 ? `+${attendedImgs?.length} going` : 'going';
    return (
      <RN.View style={{flexDirection: 'row'}}>
        {attendedImgs?.slice(0, 3)?.map((img, idx) => {
          const imgUri =
            typeof img !== 'undefined'
              ? {uri: 'data:image/png;base64,' + img?.userImage?.base64}
              : require('../assets/images/defaultuser.png');
          return (
            <RN.View
              style={{
                marginLeft: idx !== 0 ? -8 : 0,
                zIndex: idx !== 0 ? -idx : idx,
              }}>
              <RN.Image
                source={imgUri}
                style={styles.attendPeopleImg}
                defaultSource={require('../assets/images/defaultuser.png')}
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
  const confirmPaymentByCard = () => {
    const billingDetails: BillingDetails = {
      email: saveEmail,
    };
    setLoadSubscribe(true);
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
        diablePayEvent(paymentIntent?.id).then();
        RN.LayoutAnimation.configureNext(
          RN.LayoutAnimation.Presets.easeInEaseOut,
        );
        setLoadSubscribe(false);
        setPaymentError(error?.localizedMessage);
        setDisablePaymentBtn(false);
      } else {
        if (paymentIntent?.status === 'Succeeded') {
          attendEvent(eventData?.id);
          openPaymentModal.current?.close();
          setDisablePaymentBtn(false);
        }
      }
      // console.log('res', res);
    });
  };

  const onPressApplePayBtn = () => {
    setLoadSubscribe(true);
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
        // console.log('payEvent er', error, paymentIntent);
        diablePayEvent(res?.id).then();
        RN.LayoutAnimation.configureNext(
          RN.LayoutAnimation.Presets.easeInEaseOut,
        );
        setLoadSubscribe(false);
        // handle error
      } else {
        if (paymentIntent?.status === 'Succeeded') {
          attendEvent(eventData?.id);
          openPaymentModal.current?.close();
        }
        setLoadSubscribe(false);
        // console.log('paymentIntent', paymentIntent);
      }
      // console.log('res', res);
    });
    // }
  };
  const onPressAttend = async (idx: number) => {
    socket.connect();
    setCrntIndex(idx);
    setLoadSubscribe(true);
    if (Number(eventData?.price) > 0) {
      openPaymentModal.current?.open();
    } else {
      attendEvent(eventData?.id);
      setLoadSubscribe(false);
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
  const renderLoading = () => {
    return (
      <RN.ActivityIndicator
        size={'small'}
        color={colors.orange}
        animating={loadSubscribe}
        key={index}
        style={{marginRight: 20, marginVertical: 7.5}}
      />
    );
  };
  useMemo(() => {
    if (!loadSubscribe) {
      setCrntIndex(null);
    }
  }, [loadSubscribe]);
  useMemo(() => {
    if (paymentError.length > 0) {
      setTimeout(() => {
        setPaymentError('');
      }, 5000);
    }
  }, [paymentError]);
  const renderAttendBtn = () => {
    if (Number(eventData?.price) > 0) {
      return (
        <>
          {loadSubscribe ? (
            <>{renderLoading()}</>
          ) : isFollowed ? (
            <RN.View style={{flexDirection: 'row'}}>
              {!isAdmin && (
                <RN.TouchableOpacity
                  disabled={isTicket}
                  onPress={() => onPressTicket(eventData.id)}
                  style={{
                    justifyContent: 'center',
                    backgroundColor: '#07BD74',
                    borderRadius: 18,
                    paddingVertical: 6,
                  }}>
                  <RN.Text style={[styles.joinedText, {color: colors.white}]}>
                    {isAdmin ? '' : 'Show ticket'}
                  </RN.Text>
                </RN.TouchableOpacity>
              )}
            </RN.View>
          ) : (
            <StripeProvider
              publishableKey={STRIPE_PUBLIC_KEY}
              merchantIdentifier={MERCHANT_ID}>
              <Button
                title={'Buy ticket'}
                disabled={!isPassedEvent}
                onPress={() => onPressAttend(index)}
                buttonStyle={styles.attendBtn}
              />
            </StripeProvider>
          )}
        </>
      );
    }
    return (
      <RN.View style={{}}>
        <RN.View>
          {loadSubscribe ? (
            <>{renderLoading()}</>
          ) : isFollowed ? (
            <RN.View style={{flexDirection: 'row', paddingTop: 4}}>
              <RN.View style={{justifyContent: 'center'}}>
                {!isAdmin && (
                  <RN.Image
                    source={{uri: 'tick'}}
                    style={{height: 12, width: 12}}
                  />
                )}
              </RN.View>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Text style={styles.joinedText}>
                  {isAdmin ? '' : 'Going'}
                </RN.Text>
              </RN.View>
            </RN.View>
          ) : (
            <Button
              title="Attend"
              disabled={!isPassedEvent}
              onPress={() => onPressAttend(index)}
              buttonStyle={styles.attendBtn}
            />
          )}
        </RN.View>
      </RN.View>
    );
  };
  const type = () => {
    return (
      <RN.View style={{flexDirection: 'row'}}>
        <RN.View style={styles.typeEventContainer}>
          <RN.Text style={styles.typeEventText}>{eventData?.typeEvent}</RN.Text>
        </RN.View>
        {Number(data?.price) > 0 ? (
          <RN.View style={styles.priceContainer}>
            <RN.Text style={styles.priceText}>{`$ ${total}`}</RN.Text>
          </RN.View>
        ) : (
          <RN.View style={styles.priceContainer}>
            <RN.Text style={styles.priceText}>{'Free'}</RN.Text>
          </RN.View>
        )}
      </RN.View>
    );
  };
  if (loadingEvents) {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    return (
      <RN.View style={{marginTop: 16}}>
        <SkeletonEventCard />
      </RN.View>
    );
  }
  return (
    <>
      <RN.TouchableOpacity
        style={styles.container}
        onPress={goToEvent}
        activeOpacity={0.7}>
        <RN.View
          style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <RN.View style={{maxWidth: SCREEN_WIDTH / 1.5}}>
            {eventData?.typeEvent && type()}
            <RN.View style={styles.dateEventContainer}>
              <RN.Image
                source={{uri: 'calendar'}}
                style={styles.calendarIcon}
              />
              <RN.Text style={styles.dateEventText}>{dateEvent}</RN.Text>
            </RN.View>
            <RN.View>
              <RN.Text numberOfLines={2} style={styles.nameEvent}>
                {eventData?.title}
              </RN.Text>
              <RN.Text numberOfLines={2} style={styles.description}>
                {eventData?.description}
              </RN.Text>
            </RN.View>
          </RN.View>
          <RN.View>
            <RN.Image
              source={
                eventData?.images?.length > 0
                  ? {
                      uri:
                        'data:image/png;base64,' + eventData?.images[0]?.base64,
                    }
                  : require('../assets/images/default.jpeg')
              }
              defaultSource={require('../assets/images/default.jpeg')}
              style={styles.itemImg}
            />
          </RN.View>
        </RN.View>
        <RN.View style={styles.placeContainer}>
          {displayedPlaceText?.length > 0 && (
            <RN.View style={styles.placeWrapper}>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Image
                  source={{uri: 'locate'}}
                  style={{height: 16, width: 16}}
                />
              </RN.View>
              <RN.View
                style={{
                  justifyContent: 'center',
                  maxWidth: SCREEN_WIDTH / 1.8,
                }}>
                <RN.Text numberOfLines={1} style={styles.placeName}>
                  {eventData?.place}
                </RN.Text>
              </RN.View>
            </RN.View>
          )}
          {eventData?.attendedPeople?.length &&
            !isTicket &&
            renderAttendedImgs()}
        </RN.View>
        <RN.View style={styles.footerContainer}>
          {renderTags(eventData?.categories)}
          {!isAdmin && loadSubscribe ? renderLoading() : renderAttendBtn()}
        </RN.View>
      </RN.TouchableOpacity>
      {/* {openPaymentModal &&  (
          <PaymentScreen onClose={() => setOpenPaymenModal(false)} />
        )} */}
      <Portal>
        <Modalize
          ref={openPaymentModal}
          onClosed={() => setLoadSubscribe(false)}
          handlePosition="inside"
          modalStyle={styles.paymentModal}
          disableScrollIfPossible={false}
          adjustToContentHeight={true}>
          <RN.View style={{paddingVertical: 14, paddingBottom: 24}}>
            <RN.View style={{alignItems: 'center', marginTop: 24}}>
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
                } else {
                  setCardDisabled(true);
                }
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
                  marginTop: -10,
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
      {/* <Portal>
        <Modalize
          withHandle={false}
          // adjustToContentHeight
          closeOnOverlayTap={false}
          panGestureEnabled={false}
          modalStyle={{flex: 1}}
          ref={openPaymentModal}>
          <PaymentScreen onClose={() => openPaymentModal?.current?.close()} />
        </Modalize>
      </Portal> */}
    </>
  );
};
const styles = RN.StyleSheet.create({
  paymentModal: {
    backgroundColor: colors.white,
  },
  container: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 16,
    marginHorizontal: 10,
    padding: 11,
    paddingBottom: 8,
    borderRadius: 8,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 9,
  },
  priceText: {
    color: colors.white,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    lineHeight: 14.4,
    letterSpacing: 0.2,
    fontWeight: '700',
  },
  priceContainer: {
    backgroundColor: '#07BD74',
    borderRadius: 4,
    marginLeft: 4,
  },
  attendPeopleImg: {
    height: 24,
    width: 24,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.white,
  },
  attendPeopleText: {
    fontSize: 14,
    lineHeight: 18.9,
    fontWeight: '400',
    color: '#616161',
    paddingLeft: 4,
  },
  placeName: {
    fontSize: 14,
    lineHeight: 18.9,
    color: '#616161',
    fontWeight: '400',
    paddingLeft: 8.5,
  },
  placeWrapper: {
    flexDirection: 'row',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: colors.gray,
    paddingTop: 8,
  },
  placeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
  },
  tagMoreItemContainer: {
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  tagMoreItem: {
    fontSize: 12,
    lineHeight: 14.4,
    fontWeight: '700',
    color: colors.darkGray,
  },
  tagsItem: {
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    marginRight: 4,
    color: colors.purple,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14.4,
    borderRadius: 4,
  },
  attendBtn: {
    fontSize: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 0,
  },
  itemImg: {
    height: 105,
    width: 80,
    borderRadius: 6,
  },
  typeEventContainer: {
    backgroundColor: colors.purple,
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  typeEventText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 0.2,
    lineHeight: 14.4,
  },
  calendarIcon: {
    height: 16,
    width: 16,
  },
  dateEventContainer: {
    paddingTop: 12,
    flexDirection: 'row',
  },
  dateEventText: {
    fontWeight: '800',
    fontSize: 13,
    lineHeight: 16,
    color: colors.textPrimary,
    paddingLeft: 6,
  },
  nameEvent: {
    paddingTop: 6,
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 25.4,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 14,
    lineHeight: 18.9,
    color: colors.darkGray,
    fontWeight: '400',
    paddingTop: 4,
  },
  joinedText: {
    color: colors.darkGray,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19.6,
    paddingHorizontal: 12,
    // paddingLeft: 6,
  },
});
export default EventCard;
