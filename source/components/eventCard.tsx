import React, {useEffect, useMemo, useState} from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';
import moment from 'moment';
import {Button} from './Button';
import {isAndroid} from '../utils/constants';
import useEvents from '../hooks/useEvents';
import database from '@react-native-firebase/database';
import useRegistration from '../hooks/useRegistration';
import { useNavigation } from '@react-navigation/native';

type props = {
  item?: any;
};
const EventCard = ({item}: props) => {
  const data = item;
  const [eventData, setEventData] = useState();
  const navigation = useNavigation();

  const {userUid} = useRegistration();
  const isPassedEvent =
    moment(data.eventDate?.startDate).format('YYYY-MM-DD') <
    moment(new Date()).format('YYYY-MM-DD');
  const {loadingAttend, attendEvent, eventsDataById, eventList} = useEvents();
  const [loading, setLoading] = useState(false);
  const [crntIndex, setCrntIndex] = useState(null);
  const index = eventsDataById?.findIndex(
    (itm: any) => itm.eventUid === data.id,
  );

  const isJoined = eventData?.attendedPeople?.find(
    (user: any) => user.userUid === userUid,
  );

  const goToEvent = () => {
    navigation.navigate('EventScreen', {data});
  };
  // console.log(item);
  useEffect(() => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    const onValueChange = database()
      .ref(`events/${data?.eventUid}`)
      .on('value', snapshot => {
        // console.log(snapshot);
        setEventData(snapshot.val());
      });

    return () =>
      database().ref(`events/${data?.eventUid}`).off('value', onValueChange);
  }, [data?.eventUid, eventData?.communityUid]);
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
        {tags?.length > 2 && (
          <RN.Text style={styles.tagsItem}>{`+${tags?.length - 2}`}</RN.Text>
        )}
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
      <RN.View style={{position: 'absolute', bottom: 10, right: 0}}>
        <RN.View>
          {loadingAttend &&
          eventList?.findIndex((itm: any) => itm.eventUid === data.eventUid) ===
            crntIndex ? (
            <>{renderLoading()}</>
          ) : isJoined ? (
            <RN.View style={{flexDirection: 'row'}}>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Image
                  source={{uri: 'tick'}}
                  style={{height: 12, width: 12}}
                />
              </RN.View>
              <RN.Text style={styles.joinedText}>{'Going'}</RN.Text>
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
  return (
    <RN.TouchableOpacity style={styles.container} onPress={goToEvent}>
      <RN.Image
        source={
          eventData?.images?.length > 0
            ? {
                uri: 'data:image/png;base64,' + eventData?.images[0]?.base64,
              }
            : require('../assets/images/default.jpeg')
        }
        style={styles.itemImg}
      />
      <RN.View style={{marginLeft: 14}}>
        {renderTags(item?.categories)}
        <RN.Text style={styles.title}>{eventData?.name}</RN.Text>
        <RN.View style={{flexDirection: 'row'}}>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Image
              source={{uri: 'calendar'}}
              style={{height: 14, width: 14, tintColor: colors.purple}}
            />
          </RN.View>
          <RN.Text style={styles.date}>
            {`${moment(eventData?.eventDate?.startDate).format(
              'MMM Do',
            )} • ${moment(eventData?.eventDate?.time).format('HH:mm')}`}
          </RN.Text>
        </RN.View>

        <RN.View style={{flexDirection: 'row'}}>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Image
              source={{uri: 'locate'}}
              style={{
                height: 14,
                width: 14,
                tintColor: isAndroid ? colors.purple : null,
              }}
            />
          </RN.View>
          <RN.Text style={[styles.date, {fontSize: 16}]}>
            {eventData?.place}
          </RN.Text>
        </RN.View>
      </RN.View>
      {renderAttendBtn()}
    </RN.TouchableOpacity>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginVertical: 12,
    marginHorizontal: 10,
    flexDirection: 'row',
    padding: 11,
    borderRadius: 8,
    // justifyContent: 'space-around',
  },
  joinedText: {
    color: colors.darkGray,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19.6,
    paddingHorizontal: 12,
  },
  title: {
    paddingVertical: 8,
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22.4,
  },
  date: {
    color: '#616161',
    fontSize: 14,
    lineHeight: 19.6,
    letterSpacing: 0.2,
    paddingLeft: 8,
  },
  itemImg: {
    height: 105,
    width: 76,
    borderRadius: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
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
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
export default EventCard;
