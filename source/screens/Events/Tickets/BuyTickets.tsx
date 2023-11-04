import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState, useEffect, useRef} from 'react';
import * as RN from 'react-native';
import colors from '../../../utils/colors';
import {
  MERCHANT_ID,
  SCREEN_WIDTH,
  isAndroid,
  statusBarHeight,
} from '../../../utils/constants';
import QuantityTicketValue from '../../../components/quantityTicket';
import {Button} from '../../../components/Button';
import useTickets from '../../../hooks/useTickets';
import {
  BillingDetails,
  CardField,
  PlatformPay,
  PlatformPayButton,
  StripeProvider,
  confirmPayment,
  confirmPlatformPayPayment,
  isPlatformPaySupported,
  presentPaymentSheet,
  useStripe,
} from '@stripe/stripe-react-native';
import useRegistration from '../../../hooks/useRegistration';
import socket from '../../../api/sockets';
import {buyTicket} from '../../../api/serverRequests';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import useEvents from '../../../hooks/useEvents';
import {useEventById} from '../../../hooks/useEventById';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useAppStateHook from '../../../hooks/useAppState';

const BuyTickets = () => {
  const routeProps = useRoute();
  const navigation = useNavigation();
  const {saveEmail} = useRegistration();
  const {attendEvent} = useEvents();
  const {STRIPE_PUBLIC_KEY, getStripeKey} = useAppStateHook();
  const tickets = routeProps?.params?.tickets;
  const eventUid = routeProps?.params?.eventUid;
  const {isFollowed} = useEventById(eventUid);
  const openPaymentModal = useRef<Modalize>(null);
  const [cardDisabled, setCardDisabled] = useState(true);
  const [paymentError, setPaymentError] = useState('');
  const [disablePaymentBtn, setDisablePaymentBtn] = useState(false);
  const cardRef = useRef<any>(null);
  // const [showPaymentBtn, setShowPaymentBtn] = useState(true);

  // const [isApplePaySupported, setIsApplePaySupported] = React.useState(false);

  const {clearBasket, totalToBuy, items} = useTickets();
  RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  // const isFree = items.map((item: {price: number}) => item?.price === 0);
  // useEffect(() => {
  //   (async function () {
  //     setIsApplePaySupported(await isPlatformPaySupported());
  //   })();
  // }, []);

  // console.log('isApplePaySupported', tickets);
  useEffect(() => {
    clearBasket();
    getStripeKey();
  }, []);
  const confirmPaymentByCard = () => {
    const billingDetails: BillingDetails = {
      email: saveEmail,
    };
    setDisablePaymentBtn(true);
    socket.connect();
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    // attendEvent(eventData?.id);
    // const amount = Math.floor(total * 100);
    items.map((ticket: any) => {
      buyTicket(ticket.id, ticket?.quantityToBuy).then(async res => {
        const {clientSecret} = res;
        console.log('res', res);
        if (!clientSecret) {
          if (!isFollowed) {
            attendEvent(eventUid);
          }
          clearBasket();
          navigation.goBack();
        } else {
          const {paymentIntent, error} = await confirmPayment(clientSecret, {
            paymentMethodType: 'Card',
            paymentMethodData: {
              billingDetails,
            },
          });
          if (error) {
            // console.log('payEvent er', error);
            // diablePayEvent(res?.id).then();
            RN.LayoutAnimation.configureNext(
              RN.LayoutAnimation.Presets.easeInEaseOut,
            );
            setDisablePaymentBtn(false);
            // setShowPaymentBtn(true);
            // setLoadSubscribe(false);
            setPaymentError(error?.localizedMessage);
          } else {
            if (paymentIntent?.status === 'Succeeded') {
              if (!isFollowed) {
                attendEvent(eventUid);
              }
              openPaymentModal.current?.close();
              // setDisablePaymentBtn(true);
              clearBasket();
              navigation.goBack();
            }
          }
        }
      });
    });

    // buyTicket(items[0].id, items.length).then(async res => {
    //   const {clientSecret} = res;
    //   const {paymentIntent, error} = await confirmPayment(clientSecret, {
    //     paymentMethodType: 'Card',
    //     paymentMethodData: {
    //       billingDetails,
    //     },
    //   });
    //   if (error) {
    //     console.log('payEvent er', error);
    //     // diablePayEvent(res?.id).then();
    //     RN.LayoutAnimation.configureNext(
    //       RN.LayoutAnimation.Presets.easeInEaseOut,
    //     );
    //     setDisablePaymentBtn(false);
    //     // setShowPaymentBtn(true);
    //     // setLoadSubscribe(false);
    //     setPaymentError(error?.localizedMessage);
    //   } else {
    //     if (paymentIntent?.status === 'Succeeded') {
    //       attendEvent(eventUid);
    //       openPaymentModal.current?.close();
    //       // setDisablePaymentBtn(true);
    //       clearBasket();
    //       navigation.goBack();
    //     }
    //   }
    // });
  };

  const onPressApplePayBtn = () => {
    // setDisablePaymentBtn(true);
    // socket.connect();
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    // const amount = Math.floor(total * 100);
    buyTicket(items[0].id, items.length).then(async res => {
      console.log(res);
      const {clientSecret} = res;
      const {error, paymentIntent} = await confirmPlatformPayPayment(
        clientSecret,
        {
          applePay: {
            cartItems:
              // items.map(
              //   (ticket: {id: string; price: number; name: string}) => [
              //     {
              //       label: ticket.name,
              //       amount: currentQuantity(ticket.id) * ticket.price,
              //       paymentType: PlatformPay.PaymentType.Immediate,
              //     },
              //     {
              //       label: 'Dance Connect',
              //       amount: totalToBuy,
              //       paymentType: PlatformPay.PaymentType.Immediate,
              //     },
              //     ,
              //   ],
              // ),
              [
                {
                  label: items[0]?.name,
                  amount: totalToBuy,
                  paymentType: PlatformPay.PaymentType.Immediate,
                },
                {
                  label: 'Dance Connect',
                  amount: totalToBuy,
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
        console.log('payEvent er', error, res);
        // diablePayEvent(res?.id).then();
        RN.LayoutAnimation.configureNext(
          RN.LayoutAnimation.Presets.easeInEaseOut,
        );
        // setLoadSubscribe(false);
        // setShowPaymentBtn(true);
        // setDisablePaymentBtn(false);
      } else {
        if (paymentIntent?.status === 'Succeeded') {
          console.log('payment', paymentIntent);
          // attendEvent(eventData?.id);
          // openPaymentModal.current?.close();
        }
        // setDisablePaymentBtn(false);
      }
    });
    // payEvent(eventUid, totalToBuy).then(async res => {
    // const {clientSecret} = res;
    // const {error, paymentIntent} = await confirmPlatformPayPayment(
    //   clientSecret,
    //   {
    //     applePay: {
    //       cartItems: items.map(
    //         (ticket: {id: string; price: number; name: string}) => [
    //           {
    //             label: ticket.name,
    //             amount: currentQuantity(ticket.id) * ticket.price,
    //             paymentType: PlatformPay.PaymentType.Immediate,
    //           },
    //           {
    //             label: 'Dance Connect',
    //             amount: totalToBuy,
    //             paymentType: PlatformPay.PaymentType.Immediate,
    //           },
    //           ,
    //         ],
    //       ),
    //       // [
    //       //   {
    //       //     label: eventData?.title,
    //       //     amount: total.toString(),
    //       //     paymentType: PlatformPay.PaymentType.Immediate,
    //       //   },
    //       //   {
    //       //     label: 'Dance Connect',
    //       //     amount: total.toString(),
    //       //     paymentType: PlatformPay.PaymentType.Immediate,
    //       //   },
    //       // ],
    //       merchantCountryCode: 'US',
    //       currencyCode: 'USD',
    //       requiredBillingContactFields: [
    //         PlatformPay.ContactField.EmailAddress,
    //       ],
    //     },
    //   },
    // );
    // if (error) {
    //   // console.log('payEvent er', error, res);
    //   diablePayEvent(res?.id).then();
    //   RN.LayoutAnimation.configureNext(
    //     RN.LayoutAnimation.Presets.easeInEaseOut,
    //   );
    //   // setLoadSubscribe(false);
    //   // setShowPaymentBtn(true);
    //   // setDisablePaymentBtn(false);
    // } else {
    //   if (paymentIntent?.status === 'Succeeded') {
    //     // attendEvent(eventData?.id);
    //     // openPaymentModal.current?.close();
    //   }
    //   // setDisablePaymentBtn(false);
    // }
    // });
  };
  const renderHeader = () => {
    return (
      <RN.TouchableOpacity
        style={styles.headerContainer}
        onPress={() => navigation.goBack()}>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        </RN.View>
        <RN.Text style={styles.headerTitle}>Select a ticket</RN.Text>
        <RN.View style={{paddingRight: 24}} />
      </RN.TouchableOpacity>
    );
  };

  const renderTicket = (item: {
    name: string;
    description: string;
    price: string;
    enabled: boolean;
    isVisible: boolean;
    errorMessages?: string;
  }) => {
    const ticket = item;
    console.log('ticket', ticket);
    if (!ticket.isVisible) {
      // console.log('ti', ticket.errorMessages);
      return null;
    }
    return (
      <RN.View style={styles.ticketContainer}>
        <RN.View style={styles.ticketTitleWrapper}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Image
                source={{uri: 'ticketfull'}}
                style={styles.ticketIcon}
              />
            </RN.View>
            <RN.Text numberOfLines={2} style={styles.ticketTitle}>
              {ticket.name}
            </RN.Text>
          </RN.View>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Text style={styles.ticketTitle}>
              {'$' + Number(ticket.price).toFixed(2)}
            </RN.Text>
          </RN.View>
        </RN.View>
        <RN.View>
          <RN.Text numberOfLines={2} style={styles.ticketDescription}>
            {ticket.description}
          </RN.Text>
        </RN.View>
        <QuantityTicketValue ticket={ticket} />
      </RN.View>
    );
  };
  const renderFooter = () => {
    return (
      <RN.View style={{justifyContent: 'flex-end', marginBottom: 14}}>
        <StripeProvider
          publishableKey={STRIPE_PUBLIC_KEY}
          merchantIdentifier={MERCHANT_ID}>
          <Button
            title={
              totalToBuy === 0
                ? 'Get Tickets'
                : `Pay $${totalToBuy?.toFixed(2)}`
            }
            onPress={() => {
              if (totalToBuy === 0) {
                confirmPaymentByCard();
              } else {
                openPaymentModal.current?.open();
              }
              // console.log(totalToBuy);
            }}
            disabled
          />
        </StripeProvider>
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
  const renderEmpty = () => {
    return (
      <RN.View style={styles.emptyContainer}>
        <RN.Text style={styles.emptyText}>
          There are no tickets available now
        </RN.Text>
      </RN.View>
    );
  };
  return (
    <>
      <RN.View style={styles.container}>
        {renderHeader()}
        <RN.ScrollView style={styles.flatListContainer}>
          {tickets
            ?.filter((i: {isVisible: boolean}) => i.isVisible)
            ?.map(
              (ticket: {
                name: string;
                description: string;
                price: string;
                enabled: boolean;
                isVisible: boolean;
                errorMessages?: string | undefined;
              }) => {
                return renderTicket(ticket);
              },
            )}
          {tickets?.filter((i: {isVisible: boolean}) => i.isVisible).length <=
            0 && renderEmpty()}
        </RN.ScrollView>

        {items.length > 0 && renderFooter()}
      </RN.View>
      <Portal>
        <Modalize
          keyboardAvoidingBehavior={isAndroid ? 'height' : 'padding'}
          keyboardAvoidingOffset={isAndroid ? 60 : 0}
          ref={openPaymentModal}
          closeOnOverlayTap={false}
          handlePosition="inside"
          modalStyle={styles.paymentModal}
          withReactModal
          adjustToContentHeight={true}>
          <RN.TouchableOpacity
            onPress={() => {
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
          <CardField
            postalCodeEnabled={false}
            placeholders={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={{
              // backgroundColor: '#FFFFFF',
              placeholderColor: '#adadad',
              textColor: colors.textPrimary,
            }}
            style={{
              width: '100%',
              height: 50,
              // marginVertical: 30,
              marginBottom: 40,
            }}
            autofocus
            ref={cardRef}
            onCardChange={cardDetails => {
              if (cardDetails?.complete) {
                setCardDisabled(false);
              }
            }}
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
            <RN.View style={{paddingBottom: 14}}>
              <Button
                title={`Confirm pay ${totalToBuy} $`}
                disabled={!cardDisabled}
                onPress={confirmPaymentByCard}
              />
            </RN.View>
          )}
        </Modalize>
      </Portal>
    </>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 0,
    paddingTop: isAndroid ? 0 : statusBarHeight,
  },
  emptyContainer: {
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Mulish-Regular',
    textAlign: 'center',
    padding: 16,
  },
  paymentModal: {
    backgroundColor: colors.white,
  },
  quantityText: {
    fontSize: 14,
    lineHeight: 18.9,
    color: colors.darkGray,
    fontWeight: '400',
  },
  count: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  increaseIcon: {
    height: 16,
    width: 16,
    tintColor: colors.orange,
  },
  quantityWrapper: {
    borderTopWidth: 1,
    borderColor: colors.gray,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  increaseBtn: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
  },
  flatListContainer: {
    padding: 24,
    paddingHorizontal: 16,
  },
  backIcon: {
    height: 18,
    width: 22,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Mulish-Regular',
    // paddingLeft: 16,
    fontWeight: '600',
  },
  ticketContainer: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    paddingTop: 20,
    paddingBottom: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  ticketTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ticketIcon: {
    tintColor: colors.orange,
    height: 18,
    width: 18,
    marginRight: 8,
  },
  ticketTitle: {
    fontSize: 16,
    lineHeight: 25.2,
    letterSpacing: 0.2,
    fontWeight: '700',
    color: colors.textPrimary,
    maxWidth: SCREEN_WIDTH - 190,
  },
  ticketPrice: {
    fontSize: 16,
    lineHeight: 25.2,
    letterSpacing: 0.2,
    fontWeight: '700',
  },
  ticketDescription: {
    paddingVertical: 8,
    fontSize: 14,
    color: colors.darkGray,
    lineHeight: 16.9,
    fontWeight: '400',
  },
});

export default BuyTickets;
