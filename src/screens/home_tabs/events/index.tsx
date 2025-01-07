import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { theming } from 'common/constants/theming';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabScreenProps } from 'screens/interfaces';
import { DCTabs } from 'components/shared/tabs';
import { useTranslation } from 'react-i18next';
import { FilterComponent } from 'components/shared/filter';
import { EventItem } from 'components/shared/event_item';
import { HeaderWithSearch } from 'components/header_with_search_and_location/HeaderWithSearch';
import { HeaderWithLocation } from 'components/header_with_search_and_location/HeaderWithLocation';

export function EventsScreen({ navigation }: TabScreenProps<'events'>) {
  const { t } = useTranslation();
  const TABS = [t('upcoming'), t('attending'), t('managing'), t('passed')];
  const [currentTab, setCurrentTab] = useState(TABS[0]);

  return (
    <SafeAreaView edges={['top']} style={styles.root}>
      <View style={styles.events}>
        <HeaderWithLocation />
        <HeaderWithSearch
          placeholder={t('input_search_events')}
          onPress={() => navigation.push('createEvent')}
        />
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
  tabText: {
    lineHeight: 22,
    textTransform: 'capitalize',
  },
  infoHeader: {
    backgroundColor: theming.colors.white,
  },
});
