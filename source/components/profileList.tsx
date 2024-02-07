import {
  ActivityIndicator,
  FlatList,
  Image,
  LayoutAnimation,
  ScrollView,
  Share,
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
import {isAndroid} from '../utils/constants';

const viewabilityConfig = {
  waitForInteraction: true,
  viewAreaCoveragePercentThreshold: 40,
};

interface Props {
  user: any;
  onEndReached?: () => void;
  posts: Amity.InternalPost[];
  isLoading: boolean;
  actions: React.ReactNode;
  headerActions?: React.ReactNode;
  isCurrentUser: boolean;
  loadingMore: boolean;
}

export function ProfileList({
  user,
  onEndReached,
  posts,
  isLoading,
  actions,
  headerActions,
  isCurrentUser,
  loadingMore,
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
  const [showAbout, setShowAbout] = useState(false);
  const [viewablesMap, setViewablesMap] = useState<Record<string, boolean>>({});

  const rolesString = roles.reduce((acc, next) => {
    const role = getUserRole(next.title);
    return (acc += acc === '' ? role : `, ${role}`);
  }, '');

  const individualStyles = user?.individualStyles ?? [];

  const renderItem = useCallback(
    ({item}: any) => {
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
            <View style={{paddingHorizontal: 16}}>
              <CommunityCard
                containerStyle={{marginTop: 8, marginBottom: 0}}
                item={item}
                isProfileScreen
              />
            </View>
          );
        case t('events_tab'):
          return (
            <View style={{paddingHorizontal: 16}}>
              <EventCard
                containerStyle={{marginTop: 8, marginBottom: 0}}
                item={item}
              />
            </View>
          );
        default:
          break;
      }
    },
    [currentTab, isCurrentUser, isFocused, navigation, t, user, viewablesMap],
  );

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
  const onPressShare = async () => {
    try {
      const result = await Share.share({
        title: `${user?.userName}`,
        message: isAndroid
          ? `https://danceconnect.online/user/${user?.id}`
          : user?.userName,
        url: `https://danceconnect.online/user/${user?.id}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('result', result);
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const renderAbout = () => {
    return (
      <>
        <Text style={styles.aboutUser}>
          {user?.about?.length > 100 && !showAbout
            ? `${user?.about?.slice(0, 100)}...`
            : user?.about}
        </Text>
        {user?.about?.length > 40 && (
          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setShowAbout(v => !v);
            }}
            style={styles.showWrapper}>
            <Text style={styles.showMoreText}>
              {!showAbout ? t('show_more') : t('show_less')}
            </Text>
            <View style={{justifyContent: 'center'}}>
              <Image
                source={{uri: 'downlight'}}
                style={[
                  styles.arrowDownIcon,
                  {
                    transform: [{rotate: showAbout ? '180deg' : '0deg'}],
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <FlatList
      bounces={false}
      onEndReached={currentTab === t('posts') ? onEndReached : undefined}
      showsVerticalScrollIndicator={false}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        flex: 1,
        backgroundColor: !flatData?.length
          ? colors.white
          : currentTab !== t('posts')
          ? colors.white
          : colors.gray200,
      }}
      data={flatData}
      ListHeaderComponent={
        <View style={{backgroundColor: colors.white}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onPressShare}>
              <Image
                source={{uri: 'share'}}
                style={{width: 28, height: 28, tintColor: colors.black}}
              />
            </TouchableOpacity>
            {headerActions}
          </View>
          <View style={styles.profile}>
            <FastImage
              source={
                user.userImage
                  ? {
                      uri: apiUrl + user?.userImage,
                      cache: FastImage.cacheControl.immutable,
                      priority: FastImage.priority.high,
                    }
                  : defaultProfile
              }
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
          {user?.about?.length > 0 && renderAbout()}

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
      ListEmptyComponent={
        <View style={{marginTop: 90}}>
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
    fontFamily: 'Lato-Bold',
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
    fontFamily: 'Lato-Bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userAdress: {
    fontSize: 14,
    color: colors.gray700,
    marginBottom: 8,
    fontFamily: 'Lato-Regular',
    letterSpacing: 0.2,
  },

  roles: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.black,
    marginBottom: 4,
    fontFamily: 'Lato-Bold',
    letterSpacing: 0.2,
  },
  aboutUser: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Lato-Regular',
    letterSpacing: 0.2,
  },
  showMoreText: {
    color: colors.purple,
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
    tintColor: colors.purple,
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
    lineHeight: 22,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: 'Lato-Regular',
    fontSize: 16,

    color: colors.gray500,
  },
});
