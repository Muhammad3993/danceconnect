import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';
import moment from 'moment';
import {SCREEN_WIDTH, isAndroid} from '../utils/constants';
import useEvents from '../hooks/useEvents';
import useRegistration from '../hooks/useRegistration';
import {useNavigation} from '@react-navigation/native';
import {minWeekDay} from '../utils/helpers';
import SkeletonEventCard from './skeleton/eventCard-Skeleton';
import {apiUrl} from '../api/serverRequests';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {defaultProfile, getDefaultImgUser} from '../utils/images';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface Props {
  item: any;
  containerStyle?: RN.ViewStyle;
}

const EventCard = ({item, containerStyle}: Props) => {
  const data = item;
  // const [data, setdata] = useState(data);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {t} = useTranslation();
  const {userUid} = useRegistration();
  const {loadingEvents} = useEvents();
  const isAdmin = data?.creator?.uid === userUid;
  const isManager =
    data?.managers?.length > 0 && data?.managers?.find(i => i === userUid);
// console.log('data?.eventDate?.time?.date ??', moment(data?.eventDate?.time?.date).local().format('MM DD'));
  const dateEvent = `${String(
    minWeekDay.weekdaysMin(moment(data?.eventDate?.startDate)),
  ).toUpperCase()}, ${data?.eventDate?.time?.date ? String( moment(data?.eventDate?.time?.date).local().format('DD-MM')) : String(
    moment(data?.eventDate?.startDate).format('MMM Do'),
  ).toUpperCase()} • ${moment(data?.eventDate?.time).format('HH:mm')}`;

  const [attendedImgs, setAttendedImgs] = useState([]);
  const displayedPlaceText =
    data?.place?.length > 16 ? data?.place?.slice(0, 16) + '...' : data?.place;

  const goToEvent = () => {
    navigation.push('EventScreen', {data});
  };
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    setIsFollowed(
      data?.attendedPeople?.find(
        (i: {userUid: string}) => i.userUid === userUid,
      ),
    );
    // RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  }, [data?.attendedPeople, userUid]);

  useEffect(() => {
    if (data?.attendedPeople?.length > 0) {
      setAttendedImgs(data?.attendedPeople);
    }
  }, [data?.attendedPeople]);

  const renderTags = (tags: string[]) => {
    return (
      <RN.View style={styles.tagsContainer}>
        {tags?.length <= 1 &&
          tags?.map(tag => {
            return (
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Text style={styles.tagsItem}>{tag}</RN.Text>
              </RN.View>
            );
          })}
        {tags?.length >= 2 &&
          tags?.slice(0, 2)?.map(tag => {
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
      attendedImgs?.length > 3
        ? `+${attendedImgs?.length - 3}` + t('going')
        : attendedImgs?.length
        ? t('going')
        : '';
    return (
      <RN.View style={{flexDirection: 'row'}}>
        {attendedImgs
          ?.slice(0, 3)
          ?.map((img: {userImage: string} | any, idx) => {
            let imgUri =
              typeof img === 'object'
                ? {uri: apiUrl + img?.userImage}
                : {uri: apiUrl + img};

            if (img?.userImage === null || img === null) {
              // console.log(imgUri);
              imgUri = getDefaultImgUser(img.userGender);
            }
            return (
              <RN.View
                style={{
                  marginLeft: idx !== 0 ? -8 : 0,
                  zIndex: idx !== 0 ? -idx : idx,
                }}>
                <FastImage
                  source={imgUri}
                  defaultSource={getDefaultImgUser(img.userGender)}
                  style={styles.attendPeopleImg}
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
  const renderAttendBtn = () => {
    return (
      <RN.View>
        <RN.View>
          {isFollowed ? (
            <RN.View style={{justifyContent: 'center', paddingTop: 4}}>
              <RN.Text style={styles.joinedText}>
                {isAdmin || isManager ? t('managing') : t('going')}
              </RN.Text>
            </RN.View>
          ) : null}
        </RN.View>
      </RN.View>
    );
  };
  const type = () => {
    return (
      <RN.View style={{flexDirection: 'row'}}>
        <RN.View style={styles.typeEventContainer}>
          <RN.Text style={styles.typeEventText}>{data?.typeEvent}</RN.Text>
        </RN.View>
        <RN.View style={styles.priceContainer}>
          <RN.Text style={styles.priceText}>
            {data?.tickets?.length > 0 && data?.minPriceTickets >= 0
              ? '$ ' + data?.minPriceTickets
              : 'Free'}
          </RN.Text>
        </RN.View>
      </RN.View>
    );
  };
  if (loadingEvents) {
    return (
      <RN.View style={{marginTop: 16}}>
        <SkeletonEventCard />
      </RN.View>
    );
  }
  return (
    <RN.View style={[styles.container, containerStyle]}>
      <RN.TouchableOpacity
        // style={styles.container}
        onPress={goToEvent}
        activeOpacity={0.7}>
        <RN.View
          style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <RN.View style={{maxWidth: SCREEN_WIDTH / 1.57}}>
            {data?.typeEvent && type()}
            <RN.View style={styles.dateEventContainer}>
              <RN.Image
                source={{uri: 'calendar'}}
                style={styles.calendarIcon}
              />
              <RN.Text style={styles.dateEventText}>{dateEvent}</RN.Text>
            </RN.View>
            <RN.View>
              <RN.Text numberOfLines={2} style={styles.nameEvent}>
                {data?.title}
              </RN.Text>
              <RN.Text numberOfLines={2} style={styles.description}>
                {data?.description}
              </RN.Text>
            </RN.View>
          </RN.View>
          <RN.View>
            <FastImage
              source={
                data?.images?.length > 0
                  ? {
                      uri: apiUrl + data?.images[0],
                      cache: FastImage.cacheControl.immutable,
                      priority: FastImage.priority.high,
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
                  {data?.place}
                </RN.Text>
              </RN.View>
            </RN.View>
          )}
          {data?.attendedPeople?.length > 0 && renderAttendedImgs()}
        </RN.View>
        <RN.View style={styles.footerContainer}>
          {renderTags(data?.categories)}
          {renderAttendBtn()}
        </RN.View>
      </RN.TouchableOpacity>
    </RN.View>
  );
};
const styles = RN.StyleSheet.create({
  paymentModal: {
    backgroundColor: colors.white,
  },
  container: {
    zIndex: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 3,
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
    // paddingHorizontal: 12,
    // paddingLeft: 6,
  },
});
export default EventCard;
