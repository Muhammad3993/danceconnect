import { useNavigation } from '@react-navigation/native';
import { theming } from 'common/constants/theming';
import { EventItem } from 'components/shared/event_item';
import { JoinCommunity } from 'components/shared/join_community';
import { DCTabs } from 'components/shared/tabs';
import { Community } from 'data/api/community/interfaces';
import { Event } from 'data/api/event/interfaces';
import { User } from 'data/api/user/inerfaces';
import React, { ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

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

export function CommunityCardList({
  onEndReached,
  isLoading,
  events,
  all,
  loadingMore,
}: Props) {
  const { t } = useTranslation();

  const navigation = useNavigation();

  const TABS = [
    { text: t('upcoming events'), containerStyle: { flex: 1 } },
    { text: t('passed'), containerStyle: { flex: 1 } },
  ];

  const [currentTab, setCurrentTab] = useState(TABS[0].text);

  const flatData = useMemo(() => {
    if (currentTab === t('upcoming events')) {
      return all;
    }
    if (currentTab === t('passed')) {
      return events;
    }
    return [];
  }, []);

  return (
    <View style={{ position: 'relative', flex: 1 }}>
      <FlatList
        bounces={false}
        onEndReached={onEndReached}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        data={flatData}
        ListHeaderComponent={
          <>
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
          </>
        }
        renderItem={() => null}
        ListEmptyComponent={
          <View>
            {isLoading ? (
              <ActivityIndicator size={'large'} />
            ) : (
              (currentTab === t('upcoming events') && (
                <View style={styles.eventWrapper}>
                  <EventItem click={() => navigation.navigate('event')} />
                </View>
              )) ||
              (currentTab === t('passed') && (
                <>
                  <JoinCommunity title="Create Your First Event" />
                </>
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
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontFamily: 'Lato-Regular',
    fontSize: 16,

    color: theming.colors.gray500,
  },
  eventWrapper: {
    marginTop: 15,
    gap: 15,
  },
});
