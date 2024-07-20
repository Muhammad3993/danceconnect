import { theming } from 'common/constants/theming';
import { CommunitiesIcon } from 'components/icons/communities';
import { DCButton } from 'components/shared/button';
import { EventItem } from 'components/shared/event_item';
import { DCRoundIcon } from 'components/shared/round_icon';
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
            all.length !== 0 ? (
            <View style={styles.homeEventsFree}>
              <DCRoundIcon 
                icon={<CommunitiesIcon active fill={theming.colors.white} />}
                iconBoxStyle={{
                  width: 44,
                  height: 44,
                  backgroundColor: theming.colors.purple,
                }}
              />
              <Text style={styles.homeEventsFreeTitle}>Join a community </Text>
              <Text style={styles.homeEventsFreeSubtitle}>to see and attend upcoming events that you interested in</Text>
              <View style={{marginTop: 15}}>
                <DCButton children="Search for a community" variant='primary' containerStyle={{paddingHorizontal: theming.spacing.MD, paddingVertical: 13}}   />
              </View>
            </View>) : (
              <>
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
    marginTop: 15
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
  homeEventsFree: {
    width: "100%",
    height: 236,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theming.colors.gray250,
    borderRadius: theming.spacing.SM,
    marginTop: 20,
  },
  homeEventsFreeTitle: {
    color: theming.colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: theming.fonts.latoRegular,
    marginTop: 7,
  },
  homeEventsFreeSubtitle: {
    width: "90%",
    color: theming.colors.gray700,
    fontWeight: "400",
    fontSize: 14,
    fontFamily: theming.fonts.latoRegular,
    marginTop: 3,
    textAlign: "center",
  },
});