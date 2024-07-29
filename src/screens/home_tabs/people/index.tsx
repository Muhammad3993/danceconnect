import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { theming } from 'common/constants/theming';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LocationIcon } from 'components/icons/location';
import { DCInput } from 'components/shared/input';
import { SearchIcon } from 'components/icons/search';
import { t } from 'i18next';
import { FilterComponent } from 'components/shared/filter';
import { PeopleItem } from './ui';

export function PeopleScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.eventsLocation}>
        <LocationIcon width={16} height={16} />
        <Text style={styles.eventsLocationTitle}>
          San Francisco, California
        </Text>
      </View>

      <View style={styles.communitiesSearch}>
        <DCInput
          leftIcon={<SearchIcon />}
          placeholder={t('name')}
          containerStyle={styles.communitiesInputContainer}
          inputStyle={styles.communitiesInput}
        />
      </View>

      <ScrollView style={styles.container}>
        <FilterComponent
          title="978 people found"
          containerStyle={{
            marginTop: 0,
            marginBottom: 20,
          }}
        />
        <View style={styles.messageBody}>
          <PeopleItem />
          <PeopleItem />
          <PeopleItem />
          <PeopleItem />
          <PeopleItem />
          <PeopleItem />
          <PeopleItem />
          <PeopleItem />
          <PeopleItem />
          <PeopleItem />
          <PeopleItem />
          <PeopleItem />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
  container: {
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
  communitiesSearch: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: theming.spacing.LG,
  },
  communitiesInputContainer: {
    width: '100%',
  },
  communitiesInput: {
    padding: 0,
    borderWidth: 0,
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    height: 48,
  },
  messageBody: {
    gap: theming.spacing.SM,
  },
});
