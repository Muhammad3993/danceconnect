import React, {useEffect, useMemo, useState} from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';
import moment from 'moment';
import {Button} from './Button';
import {SCREEN_WIDTH} from '../utils/constants';
import useEvents from '../hooks/useEvents';
import database from '@react-native-firebase/database';
import useRegistration from '../hooks/useRegistration';
import {useNavigation} from '@react-navigation/native';
import {getImgsAttendedPeopleToEvent} from '../api/functions';
import {minWeekDay} from '../utils/helpers';
import SkeletonEventCard from './skeleton/eventCard-Skeleton';

type props = {
  item?: any;
};
const EventCard = ({item}: props) => {
  const data = item;
  // console.log(data);
  const [eventData, setEventData] = useState(data);
  const navigation = useNavigation();

  const {userUid} = useRegistration();
  const isPassedEvent = eventData?.eventDate?.time < new Date().getTime();
  const {loadingAttend, attendEvent, eventsDataById, eventList} = useEvents();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [crntIndex, setCrntIndex] = useState(null);
  const index = eventsDataById?.findIndex(
    (itm: any) => itm?.eventUid === data.id,
  );

  const isJoined = eventData?.attendedPeople?.find(
    (user: any) => user.userUid === userUid,
  );
  const dateEvent = `${String(
    minWeekDay.weekdaysMin(moment(eventData?.eventDate?.startDate)),
  ).toUpperCase()}, ${String(
    moment(eventData?.eventDate?.startDate).format('MMM Do'),
  ).toUpperCase()} • ${moment(eventData?.eventDate?.time).format('HH:mm')}`;

  const [attendedImgs, setAttendedImgs] = useState([]);
  const displayedPlaceText =
    eventData?.place?.length > 16
      ? eventData?.place?.slice(0, 16) + '...'
      : eventData?.place;

  const goToEvent = () => {
    navigation.navigate('EventScreen', {data});
  };

  // useEffect(() => {
  //   setLoadingData(true);
  //   RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  //   const onValueChange = database()
  //     .ref(`events/${data?.eventUid}`)
  //     .on('value', snapshot => {
  //       setEventData(snapshot.val());
  //       const ids = snapshot
  //         .val()
  //         ?.attendedPeople?.map(i => i.userUid)
  //         .slice(0, 3);
  //       getImgsAttendedPeopleToEvent(ids).then(imgs => setAttendedImgs(imgs));
  //       setLoadingData(false);
  //     });

  //   return () =>
  //     database().ref(`events/${data?.eventUid}`).off('value', onValueChange);
  // }, [data.communityUid, data?.eventUid]);

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
      eventData?.attendedPeople?.length > 3
        ? `+${eventData?.attendedPeople?.length - 3} going`
        : ' going';
    return (
      <RN.View style={{flexDirection: 'row'}}>
        {attendedImgs.slice(0, 3)?.map((img, idx) => {
          const imgUri =
            typeof img !== 'undefined'
              ? {uri: 'data:image/png;base64,' + img?.base64}
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
  const onPressAttend = (idx: number) => {
    setCrntIndex(idx);
    attendEvent({
      communityUid: eventData?.communityUid,
      userUid: userUid,
      eventUid: eventData?.eventUid,
    });
  };
  useMemo(() => {
    if (loadingAttend) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [loadingAttend]);
  const renderLoading = () => {
    return (
      <RN.ActivityIndicator
        size={'small'}
        color={colors.black}
        animating={loading}
        key={index}
      />
    );
  };
  const renderAttendBtn = () => {
    return (
      <RN.View style={{}}>
        <RN.View>
          {loadingAttend &&
          eventList?.findIndex((itm: any) => itm.eventUid === data.eventUid) ===
            crntIndex ? (
            <>{renderLoading()}</>
          ) : isJoined ? (
            <RN.View style={{flexDirection: 'row', paddingTop: 4}}>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Image
                  source={{uri: 'tick'}}
                  style={{height: 12, width: 12}}
                />
              </RN.View>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Text style={styles.joinedText}>{'Going'}</RN.Text>
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
      <RN.View style={styles.typeEventContainer}>
        <RN.Text style={styles.typeEventText}>{eventData?.typeEvent}</RN.Text>
      </RN.View>
    );
  };
  if (loadingData) {
    return (
      <RN.View style={{marginTop: 16}}>
        <SkeletonEventCard />
      </RN.View>
    );
  }
  return (
    <RN.TouchableOpacity
      style={styles.container}
      onPress={goToEvent}
      activeOpacity={0.7}>
      <RN.View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <RN.View style={{maxWidth: SCREEN_WIDTH / 1.5}}>
          {eventData?.typeEvent && type()}
          <RN.View style={styles.dateEventContainer}>
            <RN.Image source={{uri: 'calendar'}} style={styles.calendarIcon} />
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
              style={{justifyContent: 'center', maxWidth: SCREEN_WIDTH / 1.8}}>
              <RN.Text numberOfLines={1} style={styles.placeName}>
                {eventData?.place}
              </RN.Text>
            </RN.View>
          </RN.View>
        )}
        {eventData?.attendedPeople?.length > 1 && renderAttendedImgs()}
      </RN.View>
      <RN.View style={styles.footerContainer}>
        {renderTags(eventData?.categories)}
        {renderAttendBtn()}
      </RN.View>
    </RN.TouchableOpacity>
  );
};
const styles = RN.StyleSheet.create({
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
    paddingLeft: 6,
  },
});
export default EventCard;
