import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SCREEN_WIDTH, isAndroid, statusBarHeight} from '../../utils/constants';
import useTickets from '../../hooks/useTickets';
import QuantityTicketValue from '../../components/quantityTicket';
import {getTicketByEventUid} from '../../api/serverRequests';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

const TicketsScreen = () => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const routeProps = useRoute();
  const eventUid = routeProps?.params?.eventUid;
  const {purchasedTickets, getPurchasedTickets} = useTickets();
  const [tickets, setTickets] = useState([]);
  const [loadTickets, setLoadTickets] = useState(false);
  const fetchTickets = () => {
    setLoading(true);
    getPurchasedTickets();
    setLoading(false);
  };
  const getTicketByEvent = () => {
    setLoadTickets(true);
    getTicketByEventUid(eventUid).then(res => {
      setTickets(res);
      setLoadTickets(false);
    });
  };
  useEffect(() => {
    fetchTickets();
  }, []);
  useEffect(() => {
    if (eventUid) {
      getTicketByEvent();
    } else {
      setTickets(purchasedTickets);
    }
  }, [eventUid]);
  const navigation = useNavigation();
  const renderHeader = () => {
    return (
      <RN.TouchableOpacity
        style={styles.backIconContainer}
        onPress={() => navigation.goBack()}>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        </RN.View>
        <RN.Text style={styles.headerTitle}>{t('my_tickets')}</RN.Text>
      </RN.TouchableOpacity>
    );
  };
  const onPressTicket = (currentTicket: any) => {
    navigation.navigate('Ticket', currentTicket);
  };
  const renderItem = (item: {
    name: string;
    description: string;
    price: string;
    enabled: boolean;
    quantity: number;
    event: any;
  }) => {
    const ticket = item;
    const price = Number(ticket.price);
    const dateEvent = `${String(
      moment(ticket.event?.eventDate?.startDate).format('MMM Do'),
    )} • ${moment(ticket.event?.eventDate?.time).format('HH:mm')}`;
    return (
      <RN.TouchableOpacity
        style={styles.ticketContainer}
        onPress={() => onPressTicket(ticket)}>
        <RN.View
          style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <RN.Text style={styles.eventTitle}>{ticket.event.title}</RN.Text>
          <RN.Text style={styles.eventTitle}>{dateEvent}</RN.Text>
        </RN.View>
        <RN.View style={styles.ticketTitleWrapper}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.View style={{justifyContent: 'flex-start'}}>
              <RN.Image
                source={{uri: 'ticketfull'}}
                style={styles.ticketIcon}
              />
            </RN.View>
            <RN.Text numberOfLines={2} style={styles.ticketTitle}>
              {ticket?.name}
            </RN.Text>
          </RN.View>
          <RN.View style={{justifyContent: 'flex-start'}}>
            <RN.Text style={styles.ticketTitle}>
              {`$${(price * ticket?.quantity).toFixed(2)}`}
            </RN.Text>
          </RN.View>
        </RN.View>
        <RN.View>
          <RN.Text numberOfLines={2} style={styles.ticketDescription}>
            {ticket?.description}
          </RN.Text>
        </RN.View>
        <QuantityTicketValue ticketCard ticket={ticket} />
      </RN.TouchableOpacity>
    );
  };
  const renderEmpty = () => {
    return (
      <RN.View style={styles.emptyContainer}>
        {!loading && (
          <RN.Text style={styles.emptyText}>{t('no_tickets')}</RN.Text>
        )}
      </RN.View>
    );
  };
  const refreshControl = () => {
    return (
      <RN.RefreshControl
        onRefresh={() => {
          // console.log('refresh', eventUid);
          eventUid ? getTicketByEvent() : fetchTickets();
        }}
        refreshing={loading || loadTickets}
      />
    );
  };
  return (
    <RN.View style={styles.container}>
      {renderHeader()}
      <RN.ScrollView
        style={styles.flatList}
        refreshControl={refreshControl()}
        showsVerticalScrollIndicator={false}>
        {tickets.map(ticket => {
          return renderItem(ticket);
        })}
        {!loading && tickets.length <= 0 && renderEmpty()}
        <RN.View style={{marginBottom: 40}} />
      </RN.ScrollView>
    </RN.View>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingTop: isAndroid ? 0 : statusBarHeight,
  },
  flatList: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  backIcon: {
    height: 24,
    width: 28,
  },
  backIconContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    lineHeight: 28.8,
    fontFamily: 'Lato-Regular',
    paddingLeft: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    // flex: 1,
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
    maxWidth: SCREEN_WIDTH - 190,
    fontFamily: 'Lato-Regular',
    color: colors.textPrimary,
    marginTop: -4,
  },
  eventTitle: {
    fontSize: 16,
    lineHeight: 25.2,
    letterSpacing: 0.2,
    fontWeight: '800',
    maxWidth: SCREEN_WIDTH - 190,
    color: colors.textPrimary,
    fontFamily: 'Lato-Regular',
    marginTop: -12,
    paddingBottom: 14,
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
export default TicketsScreen;
