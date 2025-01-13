import { ActivityIndicator, FlatList, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { CommunityItem } from 'components/shared/community_item';
import { DCTabs } from 'components/shared/tabs';
import { TabScreenProps } from 'screens/interfaces';
import useGetCommunities from 'data/hooks/community';
import { LoaderView } from 'components/shared/loader_view';
import { HeaderWithSearch } from 'components/header_with_search_and_location/HeaderWithSearch';
import { HeaderWithLocation } from 'components/header_with_search_and_location/HeaderWithLocation';
import { FilterComponent } from 'components/shared/filter';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export function CommunitiesScreen({
  navigation,
}: TabScreenProps<'communities'>) {
  const { styles, theme } = useStyles(styleSheet);

  const { t } = useTranslation();

  const TABS = [
    { text: t('all'), containerStyle: { flex: 1 } },
    { text: t('joined'), containerStyle: { flex: 1 } },
    { text: t('managing'), containerStyle: { flex: 1 } },
  ];

  const [currentTab, setCurrentTab] = useState(TABS[0].text);

  const { data, isPending } = useGetCommunities();

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.communities}>
        <HeaderWithLocation />
        <HeaderWithSearch
          placeholder={t('input_search_communities')}
          onPress={() => navigation.push('createCommunity', {})}
        />
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
        <FilterComponent
          title="978 communities found"
          containerStyle={{ marginBottom: theme.spacing.XS }}
        />
        {isPending ? (
          <LoaderView />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            data={data}
            renderItem={({ item }) => (
              <CommunityItem
                community={item}
                click={() => navigation.navigate('community', { id: item.id })}
              />
            )}
            // ListEmptyComponent={
            //   <View>
            //     <JoinCommunity title="Join a community " />
            //     <StartCommunity containerStyle={{ marginTop: 20 }} />
            //   </View>
            // }
            ListFooterComponent={
              false ? <ActivityIndicator size={'large'} /> : undefined
            }
            scrollEventThrottle={500}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styleSheet = createStyleSheet(theming => ({
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
    gap: theming.spacing.XS,
    marginTop: 10,
  },
  communitiesLocationTitle: {
    fontWeight: '700',
    fontSize: 16,
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.textPrimary,
  },
  communitiesPlus: {
    width: 40,
    height: 40,
    backgroundColor: theming.colors.secondary500,
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
    fontFamily: theming.fonts.latoRegular,
    fontSize: 16,
    color: theming.colors.gray500,
  },
}));
