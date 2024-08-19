import { theming } from 'common/constants/theming';
import ExpandableText from 'components/shared/expandable_text';
import { DCTabs } from 'components/shared/tabs';
import { UserImage } from 'components/user_image';
import { Community } from 'data/api/community/interfaces';
import { Event } from 'data/api/event/interfaces';
import { User } from 'data/api/user/inerfaces';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { getImgePath } from 'data/api';
import { PostCard } from 'components/PostCard';

const viewabilityConfig = {
  waitForInteraction: true,
  viewAreaCoveragePercentThreshold: 40,
};

interface Props {
  posts: Amity.Post[];
  events: Event[];
  communities: Community[];
  onEndReached?: () => void;
  isLoading?: boolean;
  actions?: ReactNode;
  user: User;
  loadingMore?: boolean;
}

export function PrifleView({
  onEndReached,
  isLoading,
  events,
  communities,
  posts,
  user,
  actions,
  loadingMore,
}: Props) {
  const { t } = useTranslation();
  const [viewablesMap, setViewablesMap] = useState<Record<string, boolean>>({});

  const navigation = useNavigation();

  const TABS = [
    { text: t('posts'), containerStyle: { flex: 1 } },
    { text: t('communities_tab'), containerStyle: { flex: 1.6 } },
    {
      text: t('events_tab'),
      containerStyle: { flex: 1, borderBottomWidth: 3 },
    },
  ];

  const [showAbout, setShowAbout] = useState(false);
  const [currentTab, setCurrentTab] = useState(TABS[0].text);

  const flatData = useMemo(() => {
    if (currentTab === t('posts')) {
      return posts;
    }
    if (currentTab === t('events_tab')) {
      return events;
    }
    if (currentTab === t('communities_tab')) {
      return communities;
    }

    return [];
  }, [events, currentTab, communities, posts, t]);

  const onViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: ViewToken[];
      changed: ViewToken[];
    }) => {
      const map: Record<string, boolean> = {};
      for (let index = 0; index < viewableItems.length; index++) {
        const viewableItem = viewableItems[index];
        map[viewableItem.item.postId] = viewableItem.isViewable;
      }
      setViewablesMap(map);
    },
    [],
  );

  const emptyTitle = useMemo(() => {
    if (currentTab === t('posts')) {
      return t('no_records');
    }
    if (currentTab === t('events_tab')) {
      return t('no_upcoming_communities');
    }
    if (currentTab === t('communities_tab')) {
      return t('non_communities');
    }

    return '';
  }, [t, currentTab]);

  const renderItem = useCallback(
    ({ item }: any) => {
      switch (currentTab) {
        case t('posts'):
          return (
            <PostCard
              post={item}
              user={user}
              inView={viewablesMap[item.postId] ?? false}
              navigation={navigation}
            />
          );
        case t('communities_tab'):
          return <View style={{ paddingHorizontal: 16 }}></View>;
        case t('events_tab'):
          return <View style={{ paddingHorizontal: 16 }}></View>;
        default:
          break;
      }
    },
    [currentTab, navigation, t, user, viewablesMap],
  );

  const aboutText = user.about ?? '';

  return (
    <FlatList
      onEndReached={onEndReached}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      data={flatData}
      ListHeaderComponent={
        <View style={styles.infoHeader}>
          <View style={styles.profile}>
            <UserImage
              userImage={getImgePath(user.userImage)}
              style={styles.image}
            />
            <View style={styles.profileData}>
              <Text numberOfLines={1} style={styles.userName}>
                {user?.userName}
              </Text>
              {user?.location && (
                <Text numberOfLines={1} style={styles.userAdress}>
                  {user.location.location}
                </Text>
              )}
              <ScrollView
                style={{ height: 24 }}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled={user.individualStyles.length > 3}>
                {user.individualStyles.map((tag: string, idx: number) => {
                  return (
                    <View style={styles.tagItem} key={idx}>
                      <Text style={styles.tagItemText}>{tag}</Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
          <View>
            <Text style={styles.roles}>{user.userRole}</Text>

            {aboutText.length > 0 && (
              <>
                <ExpandableText
                  expand={showAbout}
                  cutLength={100}
                  style={styles.aboutUser}>
                  {aboutText}
                </ExpandableText>
                {aboutText.length > 100 && (
                  <TouchableOpacity
                    onPress={() => setShowAbout(v => !v)}
                    style={styles.showWrapper}>
                    <Text style={styles.showMoreText}>
                      {!showAbout ? t('show_more') : t('show_less')}
                    </Text>
                    <View style={{ justifyContent: 'center' }}>
                      <Text>{t('more')}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </>
            )}
            <View style={styles.profileBottom}>{actions}</View>
          </View>

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
      renderItem={renderItem}
      ListEmptyComponent={
        <View style={{ marginTop: 90 }}>
          {isLoading ? (
            <ActivityIndicator size={'large'} />
          ) : (
            <Text style={styles.emptyText}>{emptyTitle}</Text>
          )}
        </View>
      }
      ListFooterComponent={
        loadingMore ? <ActivityIndicator size={'large'} /> : undefined
      }
      keyExtractor={(item, index) =>
        item?.postId ?? item?.id ?? index.toString()
      }
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      scrollEventThrottle={400}
    />
  );
}

const styles = StyleSheet.create({
  tagItem: {
    height: 24,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 4,
    borderWidth: 1,
    borderColor: theming.colors.gray300,
  },
  tagItemText: {
    color: theming.colors.purple,
    fontSize: 12,
    letterSpacing: 0.2,
  },

  infoHeader: {
    backgroundColor: theming.colors.white,
    paddingHorizontal: theming.spacing.MD,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theming.spacing.MD,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginRight: theming.spacing.MD,
  },
  profileData: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 18,
    color: theming.colors.textPrimary,
    marginBottom: 4,
    fontFamily: theming.fonts.latoRegular,
  },
  userAdress: {
    fontSize: 14,
    color: theming.colors.gray700,
    marginBottom: theming.spacing.SM,
    letterSpacing: 0.2,
    fontFamily: theming.fonts.latoRegular,
  },

  roles: {
    fontSize: 14,
    color: theming.colors.black,
    marginBottom: 4,
    fontWeight: '600',
    letterSpacing: 0.2,
    fontFamily: theming.fonts.latoRegular,
  },
  aboutUser: {
    marginBottom: theming.spacing.MD,
    fontSize: 14,
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular,
    letterSpacing: 0.2,
  },
  showMoreText: {
    color: theming.colors.purple,
    fontSize: 14,
    lineHeight: 22.4,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  showWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  arrowDownIcon: {
    height: 14,
    width: 14,
    marginTop: 2,
    tintColor: theming.colors.purple,
  },

  actionBtn: {
    flex: 1,
    marginHorizontal: 0,
    paddingVertical: 8,
  },

  tabText: {
    lineHeight: 22,
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: theming.fonts.latoRegular,
    fontSize: 16,
    color: theming.colors.gray500,
  },
  profileBottom: {
    marginTop: 12,
    marginBottom: theming.spacing.LG,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theming.spacing.SM,
  },
});
