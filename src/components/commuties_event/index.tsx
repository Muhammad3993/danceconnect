import { theming } from 'common/constants/theming';
import { CommunitiesIcon } from 'components/icons/communities';
import { DCButton } from 'components/shared/button';
import { CommunityItem } from 'components/shared/community_item';
import { EventItem } from 'components/shared/event_item';
import { JoinCommunity } from 'components/shared/join_community';
import { DCRoundIcon } from 'components/shared/round_icon';
import { StartCommunity } from 'components/shared/start_community';
import { DCTabs } from 'components/shared/tabs';
import { Community } from 'data/api/community/interfaces';
import { Event } from 'data/api/event/interfaces';
import { User } from 'data/api/user/inerfaces';
import React, { ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface Props {
  all: Amity.InternalPost[];
  events: Event[];
  communities: Community[];
  onEndReached?: () => void;
  isLoading?: boolean;
  actions?: ReactNode;
  user: User;
  loadingMore?: boolean;
}

export function CommunitiesEvent({
  onEndReached,
  isLoading,
  events,
  communities,
  all,
  loadingMore,
}: Props) {
  const { t } = useTranslation();

  const TABS = [
    { text: t('all'), containerStyle: { flex: 1 } },
    { text: t('joined'), containerStyle: { flex: 1 } },
    {
      text: t('managing'),
      containerStyle: { flex: 1 },
    },
  ];

  const [currentTab, setCurrentTab] = useState(TABS[0].text);

  const flatData = useMemo(() => {
    if (currentTab === t('all')) {
      return all;
    }
    if (currentTab === t('joined')) {
      return events;
    }
    if (currentTab === t('managing')) {
      return communities;
    }

    return [];
  }, [events, currentTab, communities, all, t]);

  //   const emptyTitle = useMemo(() => {
  //     if (currentTab === t('all')) {
  //       return t('no all');
  //     }
  //     if (currentTab === t('joined')) {
  //       return t('no competitions');
  //     }
  //     if (currentTab === t('festival')) {
  //       return t('no festival');
  //     }
  //     if (currentTab === t('class')) {
  //       return t('no class');
  //     }
  //     if (currentTab === t('party')) {
  //         return t('no party');
  //     }

  //     return '';
  //   }, [t, currentTab]);

  return (
    <FlatList
      bounces={false}
      onEndReached={onEndReached}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      data={flatData}
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
      renderItem={() => null}
      ListEmptyComponent={
        <View>
          {isLoading ? (
            <ActivityIndicator size={'large'} />
          ) : (
            (currentTab === t('all') && (
              <>
                <CommunityItem />
                <CommunityItem />
                <CommunityItem />
                <CommunityItem />
              </>
            )) ||
            (currentTab === t('joined') && (
              <>
                <JoinCommunity />
              </>
            )) ||
            (currentTab === t('managing') && (
              <View style={{ marginTop: 20 }}>
                <StartCommunity />
              </View>
            ))
          )}
        </View>
      }
      ListFooterComponent={
        loadingMore ? <ActivityIndicator size={'large'} /> : undefined
      }
      keyExtractor={(item, index) =>
        item?.postId ?? item?.id ?? index.toString()
      }
      scrollEventThrottle={500}
    />
  );
}

const styles = StyleSheet.create({
  infoHeader: {
    backgroundColor: theming.colors.white,
    marginTop: 15,
    // paddingHorizontal: theming.spacing.MD,
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
