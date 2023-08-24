import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SCREEN_HEIGHT, statusBarHeight} from '../../utils/constants';
import {useEventById} from '../../hooks/useEventById';
import {getTickets} from '../../api/serverRequests';
import TicketCard from '../../components/ticketCard';
import EventCard from '../../components/eventCard';

const TicketsScreen = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchTickets = () => {
    setLoading(true);
    getTickets().then(ticketsList => {
      // console.log('tick', ticketsList);
      setTickets(ticketsList.paidEvents.flat());
      setLoading(false);
    });
  };
  //   const {getEvent, loadingById, eventData, remove} = useEventById(ticketId);
  useEffect(() => {
    fetchTickets();
  }, []);
  const navigation = useNavigation();
  const renderHeader = () => {
    return (
      <RN.TouchableOpacity
        style={styles.backIconContainer}
        onPress={() => navigation.goBack()}>
        <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        <RN.Text style={styles.headerTitle}>My Tickets</RN.Text>
      </RN.TouchableOpacity>
    );
  };
  const renderItem = (item: any) => {
    return (
      <EventCard
        item={item.item?.event[0]}
        key={item.id}
        isTicket
        currentTicket={item.item.currentTicket}
      />
    );
  };
  const renderEmpty = () => {
    return (
      <RN.View style={styles.emptyContainer}>
        {!loading && (
          <RN.Text style={styles.emptyText}>There are no tickets yet</RN.Text>
        )}
      </RN.View>
    );
  };
  return (
    <RN.View style={styles.container}>
      {renderHeader()}
      <RN.FlatList
        refreshing={loading}
        onRefresh={() => {
          fetchTickets();
        }}
        showsVerticalScrollIndicator={false}
        data={tickets}
        renderItem={renderItem}
        keyExtractor={(item, _index) => `${item}${_index}`}
        ListEmptyComponent={renderEmpty()}
        // ListFooterComponent={() => {
        //   return <RN.View style={{paddingBottom: SCREEN_HEIGHT / 10}} />;
        // }}
      />
    </RN.View>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingTop: statusBarHeight,
  },
  backIcon: {
    height: 24,
    width: 28,
  },
  backIconContainer: {
    padding: 10,
    margin: 12,
    flexDirection: 'row',
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
    flex: 1,
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
});
export default TicketsScreen;
