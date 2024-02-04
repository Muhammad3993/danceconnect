import React from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';
import moment from 'moment';
import {minWeekDay} from '../utils/helpers';
import {Button} from './Button';
import useEvents from '../hooks/useEvents';
import useRegistration from '../hooks/useRegistration';
import {useNavigation} from '@react-navigation/native';
import {SCREEN_WIDTH} from '../utils/constants';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type props = {
  data: object;
  eventsLength: number;
};
const VerticalCard = ({data, eventsLength}: props) => {
  const {attendEvent} = useEvents();
  const {userUid} = useRegistration();

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dateEvent = `${String(
    minWeekDay.weekdaysMin(moment(data?.eventDate?.startDate)),
  ).toUpperCase()}, ${String(
    moment(data?.eventDate?.startDate).format('MMM Do'),
  ).toUpperCase()} • ${moment(data?.eventDate?.time).format('HH:mm')}`;

  const placeEvent =
    data?.place?.length > 12 ? `${data?.place?.slice(0, 16)}...` : data?.place;
  const tags =
    data?.categories?.length > 2
      ? data?.categories?.slice(0, 2)
      : data?.categories;

  const onPressAttend = () => {
    attendEvent({
      communityUid: data?.communityUid,
      userUid: userUid,
      eventUid: data?.eventUid,
    });
  };
  const onPress = () => {
    navigation.push('EventScreen', {data});
  };
  return (
    <RN.TouchableOpacity
      style={[
        styles.container,
        {
          minWidth: eventsLength > 1 ? SCREEN_WIDTH - 60 : SCREEN_WIDTH - 40,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <RN.Image
        source={
          data?.images
            ? {uri: 'data:image/png;base64,' + data?.images[0]?.base64}
            : require('../assets/images/default.jpeg')
        }
        style={styles.imgStyle}
      />
      <RN.ScrollView horizontal style={{paddingTop: 8}}>
        <RN.View style={styles.typeEvent}>
          <RN.Text style={styles.typeEventText}>{data?.typeEvent}</RN.Text>
        </RN.View>
        {tags?.map(tag => {
          return (
            <RN.View style={styles.tagContainer}>
              <RN.Text style={styles.tagText}>{tag}</RN.Text>
            </RN.View>
          );
        })}
        {data?.categories?.length > 2 && (
          <RN.View
            style={{
              backgroundColor: 'rgba(245, 245, 245, 1)',
              borderRadius: 4,
              justifyContent: 'center',
              marginLeft: 4,
            }}>
            <RN.Text
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                color: 'rgba(117, 117, 117, 1)',
              }}>{`+${data?.categories?.length - 2}`}</RN.Text>
          </RN.View>
        )}
      </RN.ScrollView>
      <RN.Text style={styles.title}>{data?.title}</RN.Text>
      <RN.View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <RN.View>
          <RN.View style={styles.dateEventContainer}>
            <RN.Image source={{uri: 'calendar'}} style={styles.calendarIcon} />
            <RN.Text style={styles.dateEventText}>{dateEvent}</RN.Text>
          </RN.View>
          <RN.View style={styles.placeContainer}>
            <RN.Image source={{uri: 'locate'}} style={styles.calendarIcon} />
            <RN.Text style={styles.dateEventText}>{placeEvent}</RN.Text>
          </RN.View>
        </RN.View>
        <Button
          title="Attend"
          disabled={true}
          onPress={onPressAttend}
          buttonStyle={styles.attendBtn}
        />
      </RN.View>
    </RN.TouchableOpacity>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    marginLeft: 16,
    marginVertical: 4,
    marginBottom: 14,
    borderRadius: 8,
    backgroundColor: colors.white,
    shadowColor: 'rgba(88, 76, 244, 0.15)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 9,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  calendarIcon: {
    height: 14,
    width: 14,
  },
  placeContainer: {
    flexDirection: 'row',
    paddingTop: 4,
  },
  dateEventContainer: {
    // paddingTop: 12,
    flexDirection: 'row',
  },
  dateEventText: {
    fontWeight: '800',
    fontSize: 12,
    lineHeight: 16.8,
    color: colors.textPrimary,
    paddingLeft: 6,
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
    paddingVertical: 8,
    color: colors.textPrimary,
  },
  tagContainer: {
    borderWidth: 1,
    borderColor: 'rgba(224, 224, 224, 1)',
    borderRadius: 4,
    marginLeft: 4,
  },
  tagText: {
    color: colors.purple,
    fontSize: 12,
    lineHeight: 14.4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  typeEventText: {
    color: colors.white,
    fontSize: 12,
    lineHeight: 14.4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  typeEvent: {
    backgroundColor: colors.purple,
    borderRadius: 4,
    justifyContent: 'center',
  },
  imgStyle: {
    height: 200,
    maxWidth: SCREEN_WIDTH - 60,
    borderRadius: 8,
  },
  attendBtn: {
    fontSize: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 0,
  },
});
export default VerticalCard;
