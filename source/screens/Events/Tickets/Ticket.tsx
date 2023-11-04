import React, {useState} from 'react';
import * as RN from 'react-native';
import colors from '../../../utils/colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {statusBarHeight} from '../../../utils/constants';
import moment from 'moment';
// import {getTicketById} from '../../api/serverRequests';

const TicketScreen = () => {
  const routeProps = useRoute();
  const {event, user, name, eventOrganizer} = routeProps.params;
  console.log('ticket', routeProps.params);
  const navigation = useNavigation();
  // const [tickets, setTickets] = useState(
  //   new Array(routeProps.params?.quantity).fill(routeProps.params),
  // );
  const tickets = new Array(routeProps.params?.quantity).fill(
    routeProps.params,
  );
  const renderHeader = () => {
    return (
      <RN.TouchableOpacity
        style={styles.backIconContainer}
        onPress={() => navigation.goBack()}>
        <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
      </RN.TouchableOpacity>
    );
  };
  return (
    <RN.View style={styles.container}>
      {renderHeader()}
      <RN.ScrollView style={{flex: 1}}>
        {tickets.map((item: any) => {
          return (
            <RN.View style={styles.eventContainer}>
              <RN.Text style={styles.smallText}>Event</RN.Text>
              <RN.Text style={styles.meduimText}>{event?.title}</RN.Text>
              <RN.Text style={styles.smallText}>Date and Hour</RN.Text>
              <RN.Text style={styles.meduimText}>
                {`${moment(event?.eventDate?.startDate).format(
                  'dddd',
                )}, ${moment(event?.eventDate?.startDate).format('MMM D')}${
                  event?.eventDate?.endDate
                    ? ' - ' + moment(event?.eventDate?.endDate).format('MMM D')
                    : ''
                } • ${moment(event?.eventDate?.time).format('HH:mm')}`}
              </RN.Text>
              <RN.Text style={styles.smallText}>Event Location</RN.Text>
              <RN.Text style={styles.meduimText}>{event?.place}</RN.Text>
              <RN.Text style={styles.smallText}>Event Organizer</RN.Text>
              <RN.Text style={styles.meduimText}>
                {eventOrganizer?.userName}
              </RN.Text>
            </RN.View>
          );
        })}

        {/* <RN.View style={styles.eventContainer}>
          <RN.View style={styles.userWrapper}>
            <RN.Text style={styles.smallText}>Full Name</RN.Text>
            <RN.Text style={styles.largeText}>{user?.name}</RN.Text>
          </RN.View>
          <RN.View style={styles.userWrapper}>
            <RN.Text style={styles.smallText}>Country</RN.Text>
            <RN.Text style={styles.largeText}>{event?.location}</RN.Text>
          </RN.View>
          <RN.View style={styles.userWrapper}>
            <RN.Text style={styles.smallText}>Gender</RN.Text>
            <RN.Text style={styles.largeText}>{user?.gender}</RN.Text>
          </RN.View>
          <RN.View style={[styles.userWrapper, {paddingBottom: 0}]}>
            <RN.Text style={styles.smallText}>Email</RN.Text>
            <RN.Text style={styles.largeText}>{user?.email}</RN.Text>
          </RN.View>
        </RN.View> */}
      </RN.ScrollView>
    </RN.View>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingTop: statusBarHeight,
  },
  userWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  largeText: {
    color: '#424242',
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    fontWeight: '600',
  },
  meduimText: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingBottom: 12,
  },
  smallText: {
    fontSize: 12,
    color: colors.darkGray,
    lineHeight: 19.6,
    letterSpacing: 0.2,
    fontWeight: '500',
  },
  eventContainer: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 8,
    margin: 12,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 9,
  },
  backIcon: {
    height: 24,
    width: 28,
  },
  backIconContainer: {
    paddingHorizontal: 12,
    margin: 12,
    marginTop: 0,
    // paddingTop: 2,
  },
});
export default TicketScreen;
