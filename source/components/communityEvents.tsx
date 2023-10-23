import React from 'react';
import sotrtBy from 'lodash.sortby';
import * as RN from 'react-native';
import EventCard from './eventCard';
import useEvents from '../hooks/useEvents';
import moment from 'moment';
import useRegistration from '../hooks/useRegistration';

type props = {
  currentTab: string;
  communityUid: string;
  isAdmin: boolean;
};
const CommunityEvents = ({currentTab, communityUid, isAdmin}: props) => {
  const TABS = ['Upcoming Events', 'Attending', 'Passed'];
  const {eventsDataByCommunityId} = useEvents();
  const {userUid} = useRegistration();
  const events = () => {
    switch (currentTab) {
      case TABS[0]:
        return eventsDataByCommunityId?.filter(
          (item: {eventDate: {startDate: Date}}) =>
            moment(item?.eventDate?.startDate).format('YYYY-MM-DD') >=
            moment(new Date()).format('YYYY-MM-DD'),
        );
      case TABS[1]:
        return eventsDataByCommunityId?.filter((event: {attendedPeople: []}) =>
          event?.attendedPeople?.find(
            (u: {userUid: string}) => u.userUid === userUid,
          ),
        );
      case TABS[2]:
        return eventsDataByCommunityId?.filter(
          (item: any) =>
            moment(item?.eventDate?.startDate).format('YYYY-MM-DD') <
            moment(new Date()).format('YYYY-MM-DD'),
        );
      default:
        return eventsDataByCommunityId?.filter(
          (item: {eventDate: {startDate: Date}}) =>
            moment(item?.eventDate?.startDate).format('YYYY-MM-DD') >=
            moment(new Date()).format('YYYY-MM-DD'),
        );
    }
  };
  const renderEmpty = () => {
    return (
      <RN.View style={styles.emptyEventsContainer}>
        {currentTab === TABS[2] && (
          <RN.Text style={styles.emptyText}>
            {isAdmin
              ? 'You don`t have any passed events yet'
              : 'There are no passed events yet'}
          </RN.Text>
        )}
        {currentTab === TABS[0] && (
          <RN.Text style={styles.emptyText}>
            There are no upcoming events yet
          </RN.Text>
        )}
        {currentTab === TABS[1] && (
          <RN.Text style={styles.emptyText}>
            There are no attending events yet
          </RN.Text>
        )}
      </RN.View>
    );
  };
  return (
    <>
      {sotrtBy(events(), 'eventDate.startDate').map((item: any) => {
        if (item?.id) {
          return (
            <EventCard
              key={item?.id}
              item={{...item, communityId: communityUid}}
            />
          );
        }
      })}
      {!events().length && renderEmpty()}
      <RN.View style={styles.footer} />
    </>
  );
};
const styles = RN.StyleSheet.create({
  emptyEventsContainer: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(158, 158, 158, 1)',
    fontSize: 16,
  },
  footer: {
    paddingBottom: 24,
  },
});
export default CommunityEvents;
