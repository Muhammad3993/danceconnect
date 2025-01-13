import { PrifleView } from 'components/profile_view';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatListProps,
  ListRenderItem,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TabScreenProps } from 'screens/interfaces';
import { useDCStore } from 'store';

import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { PlusSquareIcon } from 'components/icons/plusSquare';
import { SettingIcon } from 'components/icons/settingIcon';
import { ShareIcon } from 'components/icons/shareIcon';
import { DCBottomSheet } from 'components/shared/bottom_sheet';
import { DCButton } from 'components/shared/button';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileSettings } from './ui/settings';
import { EditFillIcon } from 'components/icons/editFIll';
import { UserImage } from 'components/user_image';
import { getImgePath } from 'data/api';
import ExpandableText from 'components/shared/expandable_text';
import { DCTabs } from 'components/shared/tabs';
import { TagsList } from 'components/tags_list';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export function ProfileScreen({ navigation }: TabScreenProps<'profile'>) {
  const user = useDCStore.use.user();
  const { t } = useTranslation();
  const { styles, theme } = useStyles(styleSheet);

  const [viewablesMap, setViewablesMap] = useState<Record<string, boolean>>({});
  const [showAbout, setShowAbout] = useState(false);

  const aboutText = user?.about ?? '';

  const TABS = [
    { text: t('posts'), containerStyle: { flex: 1 } },
    { text: t('communities_tab'), containerStyle: { flex: 1.6 } },
    {
      text: t('events_tab'),
      containerStyle: { flex: 1, borderBottomWidth: 3 },
    },
  ];
  const [currentTab, setCurrentTab] = useState(TABS[0].text);
  const settingsSheet = useRef<BottomSheetModal>(null);

  const presentModal = useCallback(() => {
    settingsSheet.current?.present();
  }, []);

  const closeModal = useCallback(() => {
    settingsSheet.current?.close();
  }, []);

  const createPost = useCallback(() => {
    navigation.navigate('createPost', {
      targetType: 'user',
      targetId: user?.id ?? '',
    });
  }, [navigation, user]);

  const flatData = useMemo(() => {
    if (currentTab === t('posts')) {
      return [];
    }
    if (currentTab === t('events_tab')) {
      return [];
    }
    if (currentTab === t('communities_tab')) {
      return [];
    }

    return [];
  }, [currentTab, t]);

  const onViewableItemsChanged: NonNullable<
    FlatListProps<{
      postId?: string;
    }>['onViewableItemsChanged']
  > = useCallback(({ viewableItems }) => {
    const map: Record<string, boolean> = {};
    for (let index = 0; index < viewableItems.length; index++) {
      const viewableItem = viewableItems[index];
      if (viewableItem.item.postId) {
        map[viewableItem.item.postId] = viewableItem.isViewable;
      }
    }
    setViewablesMap(map);
  }, []);

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

  const renderItem: ListRenderItem<any> = useCallback(
    ({ item }) => {
      switch (currentTab) {
        case t('posts'):
          return null;

        case t('communities_tab'):
          return <View style={{ paddingHorizontal: 16 }}></View>;
        case t('events_tab'):
          return <View style={{ paddingHorizontal: 16 }}></View>;
        default:
          return null;
      }
    },
    [currentTab, navigation, t, user, viewablesMap],
  );

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView edges={['top']} style={styles.root}>
      <View style={styles.profileTop}>
        <TouchableOpacity onPress={presentModal}>
          <SettingIcon stroke={theme.colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <ShareIcon stroke={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <PrifleView
        emptyTitle={emptyTitle}
        onViewableItemsChanged={onViewableItemsChanged}
        renderItem={renderItem}
        // isLoading={isLoading}
        // loadingMore={isloadingMore}
        onEndReached={() => {}}
        data={flatData}
        headerComponent={
          <>
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
                  <TagsList list={user.individualStyles} shouldSlice={false} />
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
              <View style={styles.profileBottom}>
                <DCButton
                  containerStyle={{ flex: 1 }}
                  size="medium"
                  onPress={createPost}
                  children={t('add_post')}
                  leftIcon={<PlusSquareIcon />}
                />
                <DCButton
                  containerStyle={{ flex: 1 }}
                  children={t('edit_profile')}
                  leftIcon={<EditFillIcon />}
                  textStyle={{ color: theme.colors.secondary500 }}
                  variant="secondary"
                  onPress={() => navigation.navigate('editProfile')}
                />
              </View>
            </View>

            <DCTabs
              textStyle={styles.tabText}
              itemStyle={{ alignItems: 'center' }}
              scrollEnabled={false}
              data={TABS}
              currentTab={currentTab}
              onPressTab={setCurrentTab}
            />
          </>
        }
      />
      <DCBottomSheet snapPoints={['70%']} ref={settingsSheet}>
        <BottomSheetView>
          <ProfileSettings close={closeModal} navigation={navigation} />
        </BottomSheetView>
      </DCBottomSheet>
    </SafeAreaView>
  );
}

const styleSheet = createStyleSheet(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.white,
    position: 'relative',
  },
  profileTop: {
    flexDirection: 'row-reverse',
    alignContent: 'center',
    gap: 10,
    paddingHorizontal: theme.spacing.MD,
    marginTop: 10,
  },
  profileTopIcon: {
    width: 44,
    height: 44,
    backgroundColor: theme.colors.shadow3,
  },

  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.MD,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginRight: theme.spacing.MD,
  },
  profileData: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 18,
    color: theme.colors.textPrimary,
    marginBottom: 4,
    fontFamily: theme.fonts.latoRegular,
    fontWeight: '600',
  },
  userAdress: {
    fontSize: 14,
    color: theme.colors.gray700,
    marginBottom: theme.spacing.XS,
    letterSpacing: 0.2,
    fontFamily: theme.fonts.latoRegular,
  },

  roles: {
    fontSize: 14,
    color: theme.colors.black,
    marginBottom: 4,
    fontWeight: '600',
    letterSpacing: 0.2,
    fontFamily: theme.fonts.latoRegular,
  },
  aboutUser: {
    marginBottom: theme.spacing.MD,
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.latoRegular,
    letterSpacing: 0.2,
  },
  showMoreText: {
    color: theme.colors.secondary500,
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
    tintColor: theme.colors.secondary500,
  },

  actionBtn: {
    flex: 1,
    marginHorizontal: 0,
    paddingVertical: 8,
  },

  tabText: {
    lineHeight: 22,
  },

  profileBottom: {
    marginTop: 12,
    marginBottom: theme.spacing.LG,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.XS,
  },
}));
