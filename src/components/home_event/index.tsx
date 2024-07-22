import { theming } from 'common/constants/theming';
import { RightArrowIcon } from 'components/icons/rightArrow';
import { EventItem } from 'components/shared/event_item';
import { HomeItem } from 'components/shared/home_item';
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
import { ScrollView } from 'react-native-gesture-handler';

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

export function HomeEvent({
  onEndReached,
  isLoading,
  events,
  communities,
  all,
  loadingMore,
}: Props) {
  const { t } = useTranslation();

  const TABS = [
    { text: t('all'), containerStyle: { flex: .7 } },
    { text: t('festival'), containerStyle: { flex: 1 } },
    {
        text: t('competitions'),
        containerStyle: { flex: 1.6 },
    },    
    {
        text: t('class'),
        containerStyle: { flex: .8, },
    },
    {
        text: t('party'),
        containerStyle: { flex: .8, borderBottomWidth: 3 },
    },
  ];

  const [currentTab, setCurrentTab] = useState(TABS[0].text);

  const flatData = useMemo(() => {
    if (currentTab === t('all')) {
        return all;
    }
    if (currentTab === t('competitions')) {
        return events;
    }
    if (currentTab === t('festival')) {
        return communities;
    }    
    if (currentTab === t('class')) {
        return communities;
    }
    if (currentTab === t('party')) {
        return communities;
    }

    return [];
  }, [events, currentTab, communities, all, t]);

  const emptyTitle = useMemo(() => {
    if (currentTab === t('all')) {
      return t('no all');
    }
    if (currentTab === t('competitions')) {
      return t('no competitions');
    }
    if (currentTab === t('festival')) {
      return t('no festival');
    }    
    if (currentTab === t('class')) {
      return t('no class');
    }
    if (currentTab === t('party')) {
        return t('no party');
    }

    return '';
  }, [t, currentTab]);

  return (
    <FlatList
      bounces={false}
      onEndReached={onEndReached}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      data={flatData}
      ListHeaderComponent={
        <>
          <View style={styles.homeTop}>
            <Text style={styles.homeTitle}>You might be interested</Text>
            <DCRoundIcon
              icon={<RightArrowIcon />}
              iconBoxStyle={{
                width: 28,
                height: 28,
                backgroundColor: theming.colors.lightPurple,
              }}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HomeItem />
            <HomeItem />
          </ScrollView>

          <StartCommunity />

          <Text style={styles.homeEventsTitle}>Your upcoming events</Text>

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
        </>
      }
      renderItem={() => null}
      ListEmptyComponent={
        <View>
          {isLoading ? (
            <ActivityIndicator size={'large'} />
          ) : (
            false ? (
            <>
              <JoinCommunity  />
            </>) : (
              <>
                <EventItem />
                <EventItem />
                <EventItem />
                <EventItem />
              </>
            )
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
    textTransform: "capitalize"
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: 'Lato-Regular',
    fontSize: 16,

    color: theming.colors.gray500,
  },
  homeTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  homeTitle: {
    fontSize: theming.spacing.LG,
    fontWeight: '700',
    color: theming.colors.textPrimary,
  },
  homeEventsTitle: {
    color: theming.colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
    marginTop: 30
  },
});