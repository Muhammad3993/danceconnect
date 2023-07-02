import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import database from '@react-native-firebase/database';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import Carousel from '../../components/carousel';
import moment from 'moment';
import {useProfile} from '../../hooks/useProfile';
import {Button} from '../../components/Button';
import useEvents from '../../hooks/useEvents';
import useRegistration from '../../hooks/useRegistration';
import {SCREEN_WIDTH, statusBarHeight} from '../../utils/constants';
import SkeletonEventScreen from '../../components/skeleton/EventScreen-Skeleton';

const EventScreen = () => {
  const routeProps = useRoute();
  const navigation = useNavigation();
  const {data}: any = routeProps.params;

  const [displayedData, setDisplayedData] = useState();
  const {userById, getUser} = useProfile();
  const [images, setImages] = useState([]);
  const [openingDescription, setOpeningDescription] = useState(false);
  const {userUid} = useRegistration();
  const [unFolloweOpen, setUnFollowOpen] = useState(false);

  const {loadingAttend, attendEvent, eventList} = useEvents();
  const isPassedEvent =
    moment(data.eventDate?.endDate).format('YYYY-MM-DD') <
    moment(new Date()).format('YYYY-MM-DD');
  const isJoined =
    displayedData?.attendedPeople?.find(
      (user: any) => user.userUid === userUid,
    ) ?? false;
  const isAdmin = data?.creatorUid === userUid;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userById?.name?.length > 0) {
        setLoading(false);
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, [userById?.name?.length]);

  const onPressShowText = () => {
    setOpeningDescription(v => !v);
  };

  useEffect(() => {
    const onValueChange = database()
      .ref(`events/${data.eventUid}`)
      .on('value', snapshot => {
        setDisplayedData(snapshot.val());
        setImages(snapshot.val()?.images);
      });

    return () =>
      database().ref(`events/${data.eventUid}`).off('value', onValueChange);
  }, [data.eventUid]);

  useEffect(() => {
    getUser(displayedData?.creatorUid);
  }, [displayedData?.creatorUid]);

  const onPressAttend = () => {
    attendEvent({
      communityUid: displayedData?.communityUid,
      userUid: userUid,
      eventUid: displayedData?.eventUid,
    });
  };
  const onPressEditEvent = () => {
    navigation.navigate('EditEvent', displayedData);
  };
  const header = () => {
    return (
      <>
        <RN.TouchableOpacity
          style={styles.backIconContainer}
          onPress={() => navigation.goBack()}>
          <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        </RN.TouchableOpacity>
        {!isAdmin && (
          <RN.TouchableOpacity
            style={styles.moreIconContainer}
            onPress={() => setUnFollowOpen(v => !v)}>
            <RN.Image source={{uri: 'more'}} style={styles.backIcon} />
          </RN.TouchableOpacity>
        )}
        {isAdmin && !isPassedEvent && (
          <RN.TouchableOpacity
            style={styles.settingIconContainer}
            onPress={onPressEditEvent}>
            <RN.Image source={{uri: 'setting'}} style={styles.backIcon} />
          </RN.TouchableOpacity>
        )}
        {isJoined && unFolloweOpen && (
          <RN.TouchableOpacity
            style={styles.unFollowContainer}
            onPress={onPressAttend}>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Image
                source={{uri: 'closesquare'}}
                style={{height: 20, width: 20}}
              />
            </RN.View>
            <RN.Text style={styles.unFollowText}>{'Un-attend'}</RN.Text>
          </RN.TouchableOpacity>
        )}
      </>
    );
  };
  const renderTitle = () => {
    return (
      <>
        {renderTags()}
        <RN.View style={styles.titleContainer}>
          <RN.Text style={styles.titleName}>{displayedData?.name}</RN.Text>
        </RN.View>
      </>
    );
  };
  const renderTags = () => {
    return (
      <RN.View
        style={[
          styles.tagsContainer,
          {marginTop: images?.length > 0 ? -50 : -10},
        ]}>
        <RN.ScrollView
          horizontal
          style={styles.scrollTags}
          showsHorizontalScrollIndicator={false}>
          {displayedData?.typeEvent && (
            <RN.View style={styles.typeEventContainer}>
              <RN.Text style={{color: colors.white}}>
                {displayedData?.typeEvent}
              </RN.Text>
            </RN.View>
          )}
          {displayedData?.categories?.map((item: string) => {
            return (
              <RN.View style={styles.tagItem}>
                <RN.Text style={{color: colors.purple}}>{item}</RN.Text>
              </RN.View>
            );
          })}
          <RN.View style={{paddingRight: 44}} />
        </RN.ScrollView>
      </RN.View>
    );
  };
  const renderEventDate = () => {
    return (
      <RN.View style={styles.eventDateContainer}>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.View style={styles.calendarWrapper}>
            <RN.Image source={{uri: 'calendar'}} style={styles.calendarIcon} />
          </RN.View>
        </RN.View>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Text style={styles.eventDateText}>
            {`${moment(displayedData?.eventDate?.startDate).format(
              'ddd',
            )}, ${moment(displayedData?.eventDate?.startDate).format('MMM D')}${
              displayedData?.eventDate?.endDate
                ? ' - ' +
                  moment(displayedData?.eventDate?.endDate).format('MMM D')
                : ''
            } • ${moment(displayedData?.eventDate?.time).format('HH:mm')}`}
          </RN.Text>
          <RN.Text style={{color: colors.darkGray}}>{`GMT ${moment(
            displayedData?.eventDate?.time,
          )
            .format('Z')
            ?.replaceAll('0', '')
            ?.replace(':', '')}`}</RN.Text>
        </RN.View>
      </RN.View>
    );
  };
  const onOpenMaps = () => {
    const url = RN.Platform.select({
      ios: `maps:0,0?q=${displayedData?.place}`,
      android: `geo:0,0?q=${displayedData?.place}`,
    });

    RN.Linking.openURL(url);
  };
  const renderOrganizer = () => {
    return (
      <>
        <RN.TouchableOpacity
          style={styles.mapInfoContainer}
          onPress={onOpenMaps}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.View
                style={{
                  backgroundColor: colors.transparentPurple,
                  padding: 10,
                  borderRadius: 100,
                }}>
                <RN.Image
                  source={{uri: 'locate'}}
                  style={{height: 20, width: 20, tintColor: colors.purple}}
                />
              </RN.View>
            </RN.View>
            <RN.View
              style={{justifyContent: 'center', maxWidth: SCREEN_WIDTH / 1.8}}>
              <RN.Text numberOfLines={1} style={styles.locateText}>
                {displayedData?.place}
              </RN.Text>
              <RN.Text style={{color: colors.darkGray, paddingLeft: 12}}>
                {displayedData?.location}
              </RN.Text>
            </RN.View>
          </RN.View>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.seeMapsText}>Maps</RN.Text>
            </RN.View>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.View
                style={{
                  transform: [{rotate: '180deg'}],
                  height: 14,
                  width: 16,
                }}>
                <RN.Image
                  source={{uri: 'backicon'}}
                  style={{height: 14, width: 16, tintColor: colors.purple}}
                />
              </RN.View>
            </RN.View>
          </RN.View>
        </RN.TouchableOpacity>
        <RN.View style={styles.organizerContainer}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.Image
              source={
                userById?.profileImg
                  ? {
                      uri:
                        'data:image/png;base64,' + userById?.profileImg?.base64,
                    }
                  : require('../../assets/images/defaultuser.png')
              }
              style={styles.organizerImg}
            />
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.organizerName}>
                {userById?.auth_data?.displayName ?? userById?.name}
              </RN.Text>
              <RN.Text style={styles.organizer}>Organizer</RN.Text>
            </RN.View>
          </RN.View>
          {/* {!isAdmin && (
            <RN.TouchableOpacity
              style={
                isPassedEvent ? styles.contactBtnDisabled : styles.contactBtn
              }
              disabled={isPassedEvent}>
              <RN.Text
                style={[
                  styles.contactText,
                  {color: isPassedEvent ? colors.darkGray : colors.purple},
                ]}>
                Contact
              </RN.Text>
            </RN.TouchableOpacity>
          )} */}
        </RN.View>
      </>
    );
  };
  const renderDescription = () => {
    return (
      <RN.View style={styles.descWrapper}>
        <RN.Text style={styles.aboutText}>About this event</RN.Text>
        <RN.Text
          numberOfLines={
            openingDescription ? displayedData?.description?.length : 3
          }
          style={styles.titleDesc}>
          {displayedData?.description}
        </RN.Text>
        {displayedData?.description?.length > 40 && (
          <RN.TouchableOpacity
            onPress={onPressShowText}
            activeOpacity={0.7}
            style={styles.showWrapper}>
            <RN.Text style={styles.showMoreText}>{`${
              openingDescription ? 'Show Less' : 'Show More'
            }`}</RN.Text>
            <RN.View
              style={{
                justifyContent: 'center',
              }}>
              <RN.Image
                source={{uri: 'downlight'}}
                style={[
                  {
                    transform: [
                      {rotate: openingDescription ? '180deg' : '0deg'},
                    ],
                  },
                  styles.arrowDownIcon,
                ]}
              />
            </RN.View>
          </RN.TouchableOpacity>
        )}
      </RN.View>
    );
  };
  const renderAttendBtn = () => {
    return (
      <Button
        title="Attend"
        disabled={!isPassedEvent}
        // isLoading={loading}
        onPress={onPressAttend}
        buttonStyle={styles.attendBtn}
      />
    );
  };
  useEffect(() => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.linear);
  }, [loading]);

  if (loading) {
    return <SkeletonEventScreen />;
  }
  return (
    <RN.ScrollView style={styles.container}>
      {header()}
      <Carousel items={images} />
      {renderTitle()}
      {renderEventDate()}
      {renderOrganizer()}
      {!isJoined && renderAttendBtn()}
      {renderDescription()}
    </RN.ScrollView>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  typeEventContainer: {
    backgroundColor: colors.purple,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 4,
  },
  seeMapsText: {
    color: colors.purple,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22.4,
    marginRight: 6,
  },
  locateText: {
    fontSize: 18,
    lineHeight: 22.4,
    fontWeight: '700',
    // paddingVertical: 20,
    marginLeft: 12,
    color: colors.textPrimary,
  },
  mapInfoContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 14,
  },
  descWrapper: {
    paddingHorizontal: 24,
    marginVertical: 20,
    marginTop: 12,
  },
  aboutText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    color: colors.textPrimary,
  },
  joinedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    marginBottom: 4,
  },
  joinedText: {
    color: colors.darkGray,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 19.6,
    marginLeft: 14,
    padding: 12,
  },
  contactBtnDisabled: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 50,
    paddingHorizontal: 22,
    opacity: 0.8,
    justifyContent: 'center',
  },
  contactBtn: {
    borderWidth: 1,
    borderColor: colors.purple,
    borderRadius: 50,
    paddingHorizontal: 22,
    justifyContent: 'center',
  },
  contactText: {
    // color: colors.darkGray,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
  },
  organizerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 22,
  },
  organizerName: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    fontWeight: '700',
  },
  organizerImg: {
    height: 40,
    width: 40,
    borderRadius: 100,
    marginRight: 10,
  },
  organizer: {
    color: colors.darkGray,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 19.6,
    letterSpacing: 0.2,
  },
  eventDateContainer: {
    marginHorizontal: 22,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    paddingTop: 12,
  },
  eventDateText: {
    color: colors.textPrimary,
    fontWeight: '700',
    lineHeight: 25.2,
    letterSpacing: 0.2,
    fontSize: 18,
  },
  calendarIcon: {
    height: 18,
    width: 18,
    tintColor: colors.purple,
  },
  calendarWrapper: {
    padding: 10,
    backgroundColor: colors.transparentPurple,
    marginRight: 12,
    borderRadius: 50,
  },
  backIconContainer: {
    padding: 8,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    zIndex: 2,
    left: 0,
    margin: 12,
    marginHorizontal: 24,
    borderRadius: 50,
    top: statusBarHeight + 8,
  },
  moreIconContainer: {
    padding: 8,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    zIndex: 2,
    right: 0,
    margin: 12,
    marginHorizontal: 24,
    borderRadius: 50,
    top: statusBarHeight + 8,
  },
  backIcon: {
    height: 22,
    width: 26,
    tintColor: colors.white,
  },
  tagsContainer: {
    flexDirection: 'row',
    // marginTop: -10,
    zIndex: 1,
  },
  tagItem: {
    backgroundColor: colors.white,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 4,
    borderWidth: 1,
    borderColor: colors.purple,
  },
  scrollTags: {
    paddingHorizontal: 24,
  },
  titleContainer: {
    marginHorizontal: 24,
    paddingTop: 16,
  },
  titleName: {
    color: colors.textPrimary,
    fontSize: 24,
    lineHeight: 28.8,
    fontWeight: '700',
  },
  titleDesc: {
    color: colors.darkGray,
    fontSize: 16,
    lineHeight: 22.4,
    fontWeight: '500',
    paddingTop: 6,
  },
  showMoreText: {
    color: colors.purple,
    fontSize: 16,
    lineHeight: 22.4,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  showWrapper: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  arrowDownIcon: {
    height: 16,
    width: 16,
    marginLeft: 8,
    marginTop: 4,
    tintColor: colors.purple,
  },
  attendBtn: {
    // fontSize: 12,
    marginVertical: 28,
    marginHorizontal: 24,
  },
  settingIconContainer: {
    padding: 8,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    zIndex: 2,
    right: 0,
    margin: 12,
    marginHorizontal: 24,
    borderRadius: 50,
    top: statusBarHeight + 8,
  },
  unFollowContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 3,
    right: 26,
    top: statusBarHeight + 80,
    borderRadius: 8,
    padding: 16,
  },
  unFollowText: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 19.6,
    letterSpacing: 0.2,
    fontWeight: '600',
    marginLeft: 8,
  },
});
export default EventScreen;
