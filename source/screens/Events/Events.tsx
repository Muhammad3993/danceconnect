import React, {useEffect} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import useEvents from '../../hooks/useEvents';
import {Button} from '../../components/Button';
import EventCard from '../../components/eventCard';
import sotrtBy from 'lodash.sortby';

const EventsScreen = () => {
  const {getEvents, eventList} = useEvents();

  useEffect(() => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    getEvents();
    console.log('eventList', eventList);
  }, []);

  const footer = () => {
    return <Button title="refresh list" onPress={getEvents} disabled />;
  };
  const renderItem = (item: any) => {
    return <EventCard item={item?.item} key={item.index} />;
  };
  return (
    <RN.View style={styles.container}>
      <RN.FlatList
        showsVerticalScrollIndicator={false}
        data={sotrtBy(eventList, 'eventDate.startDate')}
        renderItem={renderItem}
        keyExtractor={(item, _index) => `${item}${_index}`}
        ListFooterComponent={footer()}
      />
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  nameContainer: {
    flexDirection: 'row',
  },
  name: {
    fontSize: 24,
    lineHeight: 28.8,
    fontWeight: '700',
    fontFamily: 'Mulish-Regular',
    color: colors.textPrimary,
    textAlign: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
});

export default EventsScreen;
