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

const EventScreen = () => {
  const routeProps = useRoute();
  const navigation = useNavigation();
  const {data}: any = routeProps.params;

  const [displayedData, setDisplayedData] = useState();
  const {userById, getUser} = useProfile();
  const [images, setImages] = useState([]);
  const [openingDescription, setOpeningDescription] = useState(false);
  const [desc, setDesc] = useState();
  const {userUid} = useRegistration();

  const {loadingAttend, attendEvent, eventList} = useEvents();
  const [loading, setLoading] = useState(false);
  const isPassedEvent =
    moment(data.eventDate?.startDate).format('YYYY-MM-DD') <
    moment(new Date()).format('YYYY-MM-DD');
  const isJoined =
    displayedData?.attendedPeople?.find(
      (user: any) => user.userUid === userUid,
    ) ?? false;
  console.log(displayedData);

  const onPressShowText = () => {
    setOpeningDescription(true);
    setDesc(displayedData?.description);
  };

  useEffect(() => {
    // RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    const onValueChange = database()
      .ref(`events/${data.eventUid}`)
      .on('value', snapshot => {
        setDisplayedData(snapshot.val());
        // console.log(snapshot.val());
        // const imgs = snapshot.val()?.images;
        setImages(snapshot.val()?.images);
        setDesc(
          snapshot.val()?.description?.length > 170
            ? snapshot.val()?.description?.slice(0, 140) + '...'
            : snapshot.val()?.description,
        );
        // getEvents();
        // getEventById(snapshot.val()?.events);
      });

    return () =>
      database().ref(`events/${data.eventUid}`).off('value', onValueChange);
  }, [data.eventUid]);
  //   console.log('userById', userById, displayedData.creatorUid);
  useEffect(() => {
    getUser(displayedData?.creatorUid);
  }, [displayedData?.creatorUid]);

  //   useMemo(() => {
  //     if (loadingAttend) {
  //       setLoading(true);
  //     } else {
  //       setLoading(false);
  //     }
  //   }, [loadingAttend]);
  const onPressAttend = () => {
    attendEvent({
      communityUid: displayedData?.communityUid,
      userUid: userUid,
      eventUid: displayedData?.eventUid,
    });
  };

  const header = () => {
    return (
      <>
        <RN.TouchableOpacity
          style={styles.backIconContainer}
          onPress={() => navigation.goBack()}>
          <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        </RN.TouchableOpacity>
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
          {displayedData?.categories?.map((item: string) => {
            return (
              <RN.View style={styles.tagItem}>
                <RN.Text style={{color: colors.white}}>{item}</RN.Text>
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
        <RN.View style={styles.calendarWrapper}>
          <RN.Image source={{uri: 'calendar'}} style={styles.calendarIcon} />
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
        </RN.View>
      </RN.View>
    );
  };
  const renderOrganizer = () => {
    return (
      <RN.View style={styles.organizerContainer}>
        <RN.View style={{flexDirection: 'row'}}>
          <RN.Image
            source={
              userById?.auth_data
                ? {uri: userById?.auth_data?.photoURL}
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
        <RN.TouchableOpacity
          style={isPassedEvent ? styles.contactBtnDisabled : styles.contactBtn}
          disabled={isPassedEvent}>
          <RN.Text
            style={[
              styles.contactText,
              {color: isPassedEvent ? colors.darkGray : colors.purple},
            ]}>
            Contact
          </RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    );
  };
  const renderDescription = () => {
    return (
      <RN.View style={styles.descWrapper}>
        <RN.Text style={styles.aboutText}>About this event</RN.Text>
        <RN.Text style={styles.titleDesc}>{desc}</RN.Text>
        {!openingDescription && desc?.length > 40 && (
          <RN.TouchableOpacity
            onPress={onPressShowText}
            style={styles.showWrapper}>
            <RN.Text style={styles.showMoreText}>Show more</RN.Text>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Image
                source={{uri: 'downlight'}}
                style={styles.arrowDownIcon}
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
    // return (
    //   <RN.View>
    //     {isJoined ? (
    //       <RN.View style={styles.joinedContainer}>
    //         <RN.View style={{justifyContent: 'center'}}>
    //           <RN.Image
    //             source={{uri: 'tick'}}
    //             style={{height: 18, width: 18}}
    //           />
    //         </RN.View>
    //         <RN.Text style={styles.joinedText}>{'Going'}</RN.Text>
    //       </RN.View>
    //     ) : (
    //       <Button
    //         title="Attend"
    //         disabled={!isPassedEvent}
    //         isLoading={loading}
    //         onPress={onPressAttend}
    //         buttonStyle={styles.attendBtn}
    //       />
    //     )}
    //   </RN.View>
    // );
  };
  return (
    <RN.ScrollView style={styles.container}>
      {header()}
      <Carousel items={images} />
      {renderTitle()}
      {renderEventDate()}
      {renderOrganizer()}
      {!isJoined && renderAttendBtn()}
      {renderDescription()}
      {/* {renderTitle()}
      {!isAdmin ? (
        <RN.View style={styles.btnJoin}>
          <Button
            onPress={onPressJoin}
            iconName={isJoined && 'chat'}
            disabled
            // isLoading={loadingFollow}
            buttonStyle={isJoined && styles.btnMessage}
            title={isJoined ? 'Message Community' : 'Join Community'}
          />
        </RN.View>
      ) : (
        <RN.View style={styles.btnJoin}>
          <Button
            onPress={() =>
              navigation.navigate('CreateEvent', {communityUid: data.id})
            }
            disabled
            // isLoading={isLoadingWithFollow}
            title={'Create Event'}
          />
        </RN.View>
      )}
      {eventsDataById?.length > 0 && renderTabs()}
      {renderEvents()} */}
    </RN.ScrollView>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    height: 50,
    width: 50,
    borderRadius: 100,
    marginRight: 16,
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
    marginVertical: 40,
  },
  eventDateText: {
    color: colors.textPrimary,
    fontWeight: '700',
    lineHeight: 25.2,
    letterSpacing: 0.2,
    fontSize: 18,
  },
  calendarIcon: {
    height: 20,
    width: 20,
    tintColor: colors.purple,
  },
  calendarWrapper: {
    padding: 16,
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
    top: 24,
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
    backgroundColor: colors.purple,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 4,
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
});
export default EventScreen;
