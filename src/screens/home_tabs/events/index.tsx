import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { theming } from 'common/constants/theming';
import { LocationIcon } from 'components/icons/location';
import { DCInput } from 'components/shared/input';
import { SearchIcon } from 'components/icons/search';
import { useDCStore } from 'store';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PlusBigIcon } from 'components/icons/plusBig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabScreenProps } from 'screens/interfaces';
import { DCTabs } from 'components/shared/tabs';
import { useTranslation } from 'react-i18next';
import { FilterComponent } from 'components/shared/filter';
import { EventItem } from 'components/shared/event_item';

export function EventsScreen({ navigation }: TabScreenProps<'events'>) {
  const { t } = useTranslation();
  const TABS = [
    { text: t('upcoming'), containerStyle: { flex: 1 } },
    { text: t('attending'), containerStyle: { flex: 1 } },
    { text: t('managing'), containerStyle: { flex: 1 } },
    { text: t('passed'), containerStyle: { flex: 1 } },
  ];
  const [currentTab, setCurrentTab] = useState(TABS[0].text);

  return (
    <SafeAreaView edges={['top']} style={styles.root}>
      <View style={styles.events}>
        <View style={styles.eventsLocation}>
          <LocationIcon width={16} height={16} />
          <Text style={styles.eventsLocationTitle}>
            San Francisco, California
          </Text>
        </View>

        <View style={styles.communitiesSearch}>
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
        <View style={styles.infoHeader}>
          <DCTabs
            textStyle={styles.tabText}
            itemStyle={{ alignItems: 'center', paddingHorizontal: 20 }}
            scrollEnabled={true}
            data={TABS}
            currentTab={currentTab}
            onPressTab={setCurrentTab}
          />
        </View>
        <FilterComponent
          title="978 communities found"
          containerStyle={{ marginBottom: theming.spacing.LG }}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          data={[1, 2, 3]}
          renderItem={() => (
            <EventItem click={() => navigation.navigate('event')} />
          )}
          ListFooterComponent={
            false ? <ActivityIndicator size={'large'} /> : undefined
          }
          scrollEventThrottle={500}
        />
      </View>
    </SafeAreaView>
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

  tabText: {
    lineHeight: 22,
    textTransform: 'capitalize',
  },
  infoHeader: {
    backgroundColor: theming.colors.white,
  },
});
