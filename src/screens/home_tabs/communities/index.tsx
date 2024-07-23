import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { theming } from 'common/constants/theming';
import { LocationIcon } from 'components/icons/location';
import { RightArrowIcon } from 'components/icons/rightArrow';
import { DCInput } from 'components/shared/input';
import { PlusBigIcon } from 'components/icons/plusBig';
import { SearchIcon } from 'components/icons/search';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native-gesture-handler';
import { JoinCommunity } from 'components/shared/join_community';
import { StartCommunity } from 'components/shared/start_community';
import { CommunityItem } from 'components/shared/community_item';
import { DCTabs } from 'components/shared/tabs';

export function CommunitiesScreen() {
  const { t } = useTranslation();

  const TABS = [
    { text: t('all'), containerStyle: { flex: 1 } },
    { text: t('joined'), containerStyle: { flex: 1 } },
    { text: t('managing'), containerStyle: { flex: 1 } },
  ];

  const [currentTab, setCurrentTab] = useState(TABS[0].text);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.communities}>
        <View style={styles.communitiesLocation}>
          <LocationIcon width={16} height={16} />
          <Text style={styles.communitiesLocationTitle}>
            San Francisco, California
          </Text>
          <RightArrowIcon style={{ transform: [{ rotate: '90deg' }] }} />
        </View>

        <View style={styles.communitiesSearch}>
          <DCInput
            leftIcon={<SearchIcon />}
            placeholder="Community name, dance style"
            containerStyle={styles.communitiesInputContainer}
            inputStyle={styles.communitiesInput}
          />
          <View style={styles.communitiesPlus}>
            <PlusBigIcon />
          </View>
        </View>

        <View style={{ position: 'relative', flex: 1 }}>
          <FlatList
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            data={[]}
            ListHeaderComponent={
              <View style={styles.infoHeader}>
                <DCTabs
                  textStyle={styles.tabText}
                  itemStyle={{ alignItems: 'center' }}
                  scrollEnabled={false}
                  data={TABS}
                  currentTab={currentTab}
                  onPressTab={setCurrentTab}
                />
              </View>
            }
            renderItem={() => <CommunityItem />}
            ListEmptyComponent={
              <View>
                <JoinCommunity />
                <StartCommunity />
              </View>
            }
            ListFooterComponent={
              false ? <ActivityIndicator size={'large'} /> : undefined
            }
            scrollEventThrottle={500}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
  communities: {
    flex: 1,
    paddingHorizontal: theming.spacing.LG,
  },
  communitiesLocation: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theming.spacing.SM,
    marginTop: 10,
  },
  communitiesLocationTitle: {
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
    marginTop: 15,
  },
  communitiesInputContainer: {
    width: '82%',
  },
  communitiesInput: {
    padding: 0,
    borderWidth: 0,
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    height: 48,
  },

  infoHeader: {
    backgroundColor: theming.colors.white,
    marginTop: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  tabText: {
    lineHeight: 22,
    textTransform: 'capitalize',
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: 'Lato-Regular',
    fontSize: 16,

    color: theming.colors.gray500,
  },
});
