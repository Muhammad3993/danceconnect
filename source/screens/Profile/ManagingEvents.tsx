import React, {useCallback, useEffect} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import {isAndroid} from '../../utils/constants';
import {ScrollView} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import useEvents from '../../hooks/useEvents';
import SkeletonEventCard from '../../components/skeleton/eventCard-Skeleton';
import EventCard from '../../components/eventCard';
import sortBy from 'lodash.sortby';

const ManagingEvents = () => {
  const {managingEventsAndPassed, isLoadManaging, getManagingEvents} =
    useEvents();
  const {t} = useTranslation();
  const lengthEmptyEvents = new Array(3).fill('');
  const navigation = useNavigation();
  useEffect(() => {
    getManagingEvents();
  }, []);
  const header = () => {
    return (
      <RN.TouchableOpacity
        style={styles.headerWrapper}
        onPress={() => navigation.goBack()}>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        </RN.View>
        <RN.Text style={styles.headerText}>{t('manage_events_title')}</RN.Text>
      </RN.TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    return (
      <RN.View style={styles.emptyContainer}>
        {isLoadManaging &&
          lengthEmptyEvents.map(() => {
            return (
              <>
                <RN.View style={{marginVertical: 8}}>
                  <SkeletonEventCard />
                </RN.View>
              </>
            );
          })}
        {!isLoadManaging && (
          <RN.Text style={styles.emptyText}>{t('no_manage_events')}</RN.Text>
        )}
      </RN.View>
    );
  };
  const renderItem = useCallback((item: any) => {
    return <EventCard item={item} key={item.id} />;
  }, []);
  return (
    <RN.SafeAreaView style={styles.container}>
      {header()}
      <ScrollView style={{paddingTop: 24}}>
        {managingEventsAndPassed?.length > 0 &&
          sortBy(managingEventsAndPassed, 'eventDate.startDate')
            ?.map((item: any) => {
              return (
                <RN.View style={styles.flatList}>{renderItem(item)}</RN.View>
              );
            })
            .reverse()}
        {!managingEventsAndPassed?.length && renderEmpty()}
        <RN.View style={{paddingBottom: 60}} />
      </ScrollView>
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flatList: {
    flex: 1,
    // paddingVertical: 24,
    marginHorizontal: isAndroid ? 14 : 0,
  },
  backIcon: {
    height: 16,
    width: 19,
  },
  headerWrapper: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  headerText: {
    color: colors.textPrimary,
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Lato-Regular',
    paddingLeft: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },

  emptyText: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    padding: 16,
  },
});
export default ManagingEvents;
