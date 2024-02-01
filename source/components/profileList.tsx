import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {apiUrl} from '../api/serverRequests';
import {defaultProfile} from '../utils/images';

import colors from '../utils/colors';
import {getUserRole} from '../utils/helpers';
import {Tab} from './tab';
// import {PostCard} from '../screens/Profile/ui/PostCard';
import {useTranslation} from 'react-i18next';
import CommunityCard from './communityCard';
import EventCard from './eventCard';
import usePeople from '../hooks/usePeople';
import {PostCard} from './PostCard';
import {useIsFocused, useNavigation} from '@react-navigation/native';

const viewabilityConfig = {
  waitForInteraction: true,
  viewAreaCoveragePercentThreshold: 19,
};

interface Props {
  user: any;
  onEndReached?: () => void;
  posts: Amity.InternalPost[];
  isLoading: boolean;
  actions: React.ReactNode;
  headerActions?: React.ReactNode;
  isCurrentUser: boolean;
}

export function ProfileList({
  user,
  onEndReached,
  posts,
  isLoading,
  actions,
  headerActions,
  isCurrentUser,
}: Props) {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const roles = user?.userRole ?? [];
  const {t} = useTranslation();
  const {
    getEventsByUserId,
    eventsByUser,
    communitiesByUser,
    getCommunitiesByUserId,
  } = usePeople();
  const TABS = [
    {text: t('posts'), containerStyle: {flex: 1}},
    {text: t('communities_tab'), containerStyle: {flex: 1.6}},
    {
      text: t('events_tab'),
      containerStyle: {flex: 1, borderBottomWidth: 3},
    },
  ];
  const [currentTab, setCurrentTab] = useState(TABS[0].text);
  const [viewablesMap, setViewablesMap] = useState<Record<string, boolean>>({});

  const rolesString = roles.reduce((acc, next) => {
    const role = getUserRole(next.title);
    return (acc += acc === '' ? role : `, ${role}`);
  }, '');

  const individualStyles = user?.individualStyles ?? [];

  const renderItem = ({item}: any) => {
    switch (currentTab) {
      case t('posts'):
        return (
          <PostCard
            isFocused={isFocused}
            canEdit={isCurrentUser}
            post={item}
            user={user}
            inView={viewablesMap[item.postId] ?? false}
            navigation={navigation}
          />
        );
      case t('communities_tab'):
        return (
          <View style={{paddingTop: 12}}>
            <CommunityCard item={item} isProfileScreen />
          </View>
        );
      case t('events_tab'):
        return (
          <View style={{paddingTop: 12}}>
            <EventCard item={item} />
          </View>
        );
      default:
        break;
    }
  };

  const flatData = useMemo(() => {
    if (currentTab === t('posts')) {
      return posts;
    }
    if (currentTab === t('events_tab')) {
      return eventsByUser;
    }
    if (currentTab === t('communities_tab')) {
      return communitiesByUser;
    }

    return [];
  }, [communitiesByUser, currentTab, eventsByUser, posts, t]);

  const emptyTitle = useMemo(() => {
    if (currentTab === t('posts')) {
      return 'There are no records yet';
    }
    if (currentTab === t('events_tab')) {
      return t('no_upcoming_communities');
    }
    if (currentTab === t('communities_tab')) {
      return t('non_communities');
    }

    return '';
  }, [t, currentTab]);

  useEffect(() => {
    getEventsByUserId(user.id);
    getCommunitiesByUserId(user.id);
  }, [user.id]);

  const onViewableItemsChanged = useCallback(
    ({viewableItems}: {viewableItems: ViewToken[]; changed: ViewToken[]}) => {
      const map = {};

      for (let index = 0; index < viewableItems.length; index++) {
        const viewableItem = viewableItems[index];
        map[viewableItem.item.postId] = viewableItem.isViewable;
      }

      setViewablesMap(map);
    },
    [],
  );

  return (
    <FlatList
      bounces={false}
      onEndReached={onEndReached}
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor: !flatData?.length ? colors.white : colors.gray200,
      }}
      data={flatData}
      ListHeaderComponent={
        <View style={{backgroundColor: colors.white}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => {}}>
              <Image
                source={{uri: 'share'}}
                style={{width: 28, height: 28, tintColor: colors.black}}
              />
            </TouchableOpacity>
            {headerActions}
          </View>
          <View style={styles.profile}>
            <FastImage
              source={{
                uri: apiUrl + user?.userImage,
                cache: FastImage.cacheControl.immutable,
                priority: FastImage.priority.high,
              }}
              defaultSource={defaultProfile}
              style={styles.image}
            />
            <View style={styles.profileData}>
              <Text numberOfLines={1} style={styles.userName}>
                {user?.userName}
              </Text>
              <Text numberOfLines={1} style={styles.userAdress}>
                {user?.userCountry}
              </Text>
              <ScrollView
                style={{height: 24}}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled={individualStyles.length > 3}>
                {individualStyles.map((tag: string, idx: number) => {
                  return (
                    <View style={styles.tagItem} key={idx}>
                      <Text style={styles.tagItemText}>{tag}</Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
          <Text style={styles.roles}>{rolesString}</Text>
          <View style={styles.actions}>{actions}</View>

          <Tab
            textStyle={styles.tabText}
            itemStyle={{alignItems: 'center'}}
            containerStyle={styles.tabContainer}
            scrollEnabled={false}
            data={TABS}
            // currentTab={'Posts'}
            currentTab={currentTab}
            onPressTab={setCurrentTab}
          />
        </View>
      }
      renderItem={renderItem}
      // renderItem={({item}) => <PostCard post={item} user={user} />}
      ListEmptyComponent={
        <View style={{marginTop: 80}}>
          {isLoading ? (
            <ActivityIndicator size={'large'} />
          ) : (
            <Text style={styles.emptyText}>{emptyTitle}</Text>
          )}
        </View>
      }
      // keyExtractor={({postId}) => postId}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      scrollEventThrottle={200}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  tagItem: {
    height: 24,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 4,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  tagItemText: {
    color: colors.purple,
    fontSize: 12,
    fontFamily: 'Mulish-Bold',
    letterSpacing: 0.2,
  },

  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileData: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Mulish-Bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userAdress: {
    fontSize: 14,
    color: colors.gray700,
    marginBottom: 8,
    fontFamily: 'Mulish-Regular',
    letterSpacing: 0.2,
  },

  roles: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.black,
    marginBottom: 4,
    fontFamily: 'Mulish-Bold',
    letterSpacing: 0.2,
  },

  actions: {
    marginTop: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  actionBtn: {
    flex: 1,
    marginHorizontal: 0,
    paddingVertical: 8,
  },

  tabContainer: {
    paddingHorizontal: 16,
  },
  tabText: {
    fontFamily: 'Mulish-Bold',
    lineHeight: 22,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: 'Mulish-Regular',
    fontSize: 16,

    color: colors.gray500,
  },
});
