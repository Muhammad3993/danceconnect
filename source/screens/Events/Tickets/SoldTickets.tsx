import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {getTickets} from '../../../api/serverRequests';
import colors from '../../../utils/colors';
import {
  SCREEN_WIDTH,
  isAndroid,
  statusBarHeight,
} from '../../../utils/constants';

const SoldTickets = () => {
  const routeProps = useRoute();
  const eventUid = routeProps?.params?.eventUid;
  const [tickets, setTickets] = useState([]);
  const [loadTickets, setLoadTickets] = useState(false);

  useEffect(() => {
    getTicketByEvent();
  }, []);

  const getTicketByEvent = () => {
    setLoadTickets(true);
    getTickets(eventUid).then(res => {
      setTickets(res);
      setLoadTickets(false);
    });
  };

  const navigation = useNavigation();
  const renderHeader = () => {
    return (
      <RN.TouchableOpacity
        style={styles.backIconContainer}
        onPress={() => navigation.goBack()}>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        </RN.View>
        <RN.Text style={styles.headerTitle}>Sold Tickets</RN.Text>
      </RN.TouchableOpacity>
    );
  };
  const renderItem = (item: {
    name: string;
    description: string;
    price: string;
    enabled: boolean;
    quantity: number;
    items: string[];
  }) => {
    const ticket = item;
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
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text numberOfLines={2} style={styles.ticketTitle}>
                {ticket?.name}
                <RN.Text
                  style={{
                    fontSize: 14,
                    lineHeight: 19.6,
                    fontWeight: '400',
                    color: colors.darkGray,
                  }}>
                  {' '}
                  {`(${ticket.price} $)`}
                </RN.Text>
              </RN.Text>
            </RN.View>
          </RN.View>
          <RN.Text numberOfLines={2} style={styles.ticketTitle}>
            {ticket?.items.length}
          </RN.Text>
        </RN.View>
      </RN.View>
    );
  };
  const refreshControl = () => {
    return (
      <RN.RefreshControl
        onRefresh={getTicketByEvent}
        refreshing={loadTickets}
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
        <RN.View style={{marginBottom: 40}} />
        <RN.View style={{marginTop: 240, alignItems: 'center'}}>
          <RN.Text
            style={[
              styles.emptyText,
              {fontWeight: '400', fontSize: 16, marginHorizontal: 24},
            ]}>
            Payouts will be made within 5 business days after event ends
          </RN.Text>
        </RN.View>
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
    flex: 1,
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
    fontFamily: 'Mulish-Regular',
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
    fontFamily: 'Mulish-Regular',
    textAlign: 'center',
    paddingVertical: 16,
  },
  ticketContainer: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    paddingVertical: 14,
    // paddingTop: 20,
    // paddingBottom: 8,
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
    color: colors.textPrimary,
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
  quantityWrapper: {
    borderTopWidth: 1,
    borderColor: colors.gray,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityText: {
    fontSize: 14,
    lineHeight: 18.9,
    color: colors.darkGray,
    fontWeight: '400',
  },
});
export default SoldTickets;
