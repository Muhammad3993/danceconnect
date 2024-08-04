import { StyleSheet, Text, Touchable, View } from 'react-native';
import React, { useState } from 'react';
import { theming } from 'common/constants/theming';
import { LocationIcon } from 'components/icons/location';
import { DCInput } from 'components/shared/input';
import { SearchIcon } from 'components/icons/search';
import { ArrowLeftIcon } from 'components/icons/arrowLeft';
import { EventsCardList } from 'components/events_cardlist';
import { useDCStore } from 'store';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { PlusBigIcon } from 'components/icons/plusBig';

export function EventsScreen() {
  const user = useDCStore.use.user();
  const [all, setAll] = useState<Amity.Post[]>([]);

  const navigation = useNavigation();
  return (
    <View style={styles.root}>
      <View style={styles.events}>
        <View style={styles.eventsLocation}>
          <LocationIcon width={16} height={16} />
          <Text style={styles.eventsLocationTitle}>
            San Francisco, California
          </Text>
        </View>

        <View style={styles.communitiesSearch}>
          <TouchableOpacity>
            <ArrowLeftIcon fill={theming.colors.textPrimary} />
          </TouchableOpacity>
          <DCInput
            leftIcon={<SearchIcon />}
            placeholder="Event name, dance style, plac."
            containerStyle={styles.communitiesInputContainer}
            inputStyle={styles.communitiesInput}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('createEvent')}
            style={styles.communitiesPlus}>
            <PlusBigIcon />
          </TouchableOpacity>
        </View>

        <EventsCardList all={all} communities={[]} events={[]} user={user} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
  events: {
    flex: 1,
    paddingHorizontal: theming.spacing.LG,
  },
  eventsLocation: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theming.spacing.SM,
    marginTop: 10,
  },
  eventsLocationTitle: {
    fontWeight: '700',
    fontSize: 16,
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.textPrimary,
  },
  communitiesPlus: {
    width: 48,
    height: 48,
    backgroundColor: theming.colors.purple,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  communitiesSearch: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    gap: 10,
  },
  communitiesInputContainer: {
    width: '87%',
    flex: 1,
  },
  communitiesInput: {
    padding: 0,
    borderWidth: 0,
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    height: 48,
  },
});
