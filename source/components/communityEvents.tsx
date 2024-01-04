import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import EventCard from './eventCard';
import useEvents from '../hooks/useEvents';
import moment from 'moment';
import useRegistration from '../hooks/useRegistration';
import colors from '../utils/colors';
import {useTranslation} from 'react-i18next';

type props = {
  isAdmin: boolean;
  eventsIds: any;
};
const CommunityEvents = ({isAdmin, eventsIds}: props) => {
  const {eventsDataByCommunityId, loadingEvents, getEventByIdCommunity} =
    useEvents();
  const {t} = useTranslation();
  const TABS = [t('upcoming'), t('attending'), t('passed')];
  const [currentTab, setCurrentTab] = useState<string>(TABS[0]);
  const {userUid} = useRegistration();
  const onPressTab = (value: string) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setCurrentTab(value);
  };
  useEffect(() => {
    if (eventsIds?.length > 0) {
      getEventByIdCommunity(eventsIds);
    } else {
      getEventByIdCommunity([]);
    }
  }, [eventsIds]);
  const events = () => {
    switch (currentTab) {
      case TABS[0]:
        return (
          eventsDataByCommunityId?.filter(
            (item: {eventDate: {startDate: Date; endDate: Date}}) =>
              item?.eventDate?.endDate !== null
                ? moment(item?.eventDate?.endDate).format('YYYY-MM-DD') >=
                  moment(new Date()).format('YYYY-MM-DD')
                : moment(item?.eventDate?.startDate).format('YYYY-MM-DD') >=
                  moment(new Date()).format('YYYY-MM-DD'),
          ) ?? []
        );
      case TABS[1]:
        return (
          eventsDataByCommunityId?.filter((event: {attendedPeople: []}) =>
            event?.attendedPeople?.find(
              (u: {userUid: string}) => u?.userUid === userUid,
            ),
          ) ?? []
        );
      case TABS[2]:
        return (
          eventsDataByCommunityId?.filter((item: any) =>
            item?.eventDate?.endDate !== null
              ? moment(item?.eventDate?.endDate).format('YYYY-MM-DD') <
                moment(new Date()).format('YYYY-MM-DD')
              : moment(item?.eventDate?.startDate).format('YYYY-MM-DD') <
                moment(new Date()).format('YYYY-MM-DD'),
          ) ?? []
        );
      default:
        return (
          eventsDataByCommunityId?.filter(
            (item: {eventDate: {startDate: Date}}) =>
              moment(item?.eventDate?.startDate).format('YYYY-MM-DD') >=
              moment(new Date()).format('YYYY-MM-DD'),
          ) ?? []
        );
    }
  };
  const renderEmpty = () => {
    return (
      <RN.View style={styles.emptyEventsContainer}>
        {currentTab === TABS[2] && (
          <RN.Text style={styles.emptyText}>
            {isAdmin
              ? t('no_passed_communities_admin')
              : t('no_passed_communities')}
          </RN.Text>
        )}
        {currentTab === TABS[0] && (
          <RN.Text style={styles.emptyText}>
            {t('no_upcoming_communities')}
          </RN.Text>
        )}
        {currentTab === TABS[1] && (
          <RN.Text style={styles.emptyText}>
            {t('no_attend_communities')}
          </RN.Text>
        )}
      </RN.View>
    );
  };
  const renderLoading = () => {
    return <RN.ActivityIndicator size={'small'} color={colors.orange} />;
  };
  const renderTab = ({item}: any) => {
    if (isAdmin && item === t('attending')) {
      return null;
    }
    return (
      <RN.TouchableOpacity
        onPress={() => onPressTab(item)}
        style={[
          styles.itemTabContainer,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            borderBottomWidth: currentTab === item ? 3 : 0,
          },
        ]}>
        <RN.Text
          style={[
            styles.itemTabText,
            {
              color: currentTab === item ? colors.purple : colors.darkGray,
            },
          ]}>
          {item}
        </RN.Text>
      </RN.TouchableOpacity>
    );
  };
  return (
    <>
      {/* <RN.ScrollView
        style={styles.tabsWrapper}
        horizontal
        showsHorizontalScrollIndicator={false}> */}
      <RN.View style={styles.tabsWrapper}>
        <RN.FlatList
          data={TABS}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderTab}
          horizontal
        />
      </RN.View>
      {/* </RN.ScrollView> */}
      {eventsDataByCommunityId?.length > 0 &&
        !loadingEvents &&
        events()?.length > 0 &&
        events()?.map((item: any) => {
          if (item && item.id) {
            return <EventCard key={item?.id} item={item} />;
          }
        })}
      {loadingEvents && renderLoading()}
      {!events()?.length && renderEmpty()}
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
  tabsWrapper: {
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingTop: 18,
  },
  itemTabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.purple,
    alignSelf: 'center',
    marginBottom: -1,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  itemTabText: {
    fontSize: 16,
    lineHeight: 25.2,
    // letterSpacing: 0.2,
    paddingHorizontal: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
export default CommunityEvents;
