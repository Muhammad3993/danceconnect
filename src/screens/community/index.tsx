import { images } from '@common/resources/images';
import { ArrowLeftIcon } from '@components/icons/arrowLeft';
import { EditIconSvg } from '@components/icons/editIcon';
import { SettingIcon } from '@components/icons/settingIcon';
import { ShareIcon } from '@components/icons/shareIcon';
import { DCButton } from '@components/shared/button';
import { DCRoundIcon } from '@components/shared/round_icon';
import { DCLine } from '@components/shared/line';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { RightArrowIcon } from '@components/icons/rightArrow';
import {
  useGetCommunity,
  useToggleFollowCommunity,
} from '@data/hooks/community';
import { MessageIcon } from '@components/icons/message';
import { StackScreenProps } from '@screens/interfaces';
import { UserImage } from '@components/user_image';
import { useDCStore } from '@store';
import ExpandableText from '@components/shared/expandable_text';
import { SCREEN_WIDTH } from '@common/constants';
import { LoaderView } from '@components/shared/loader_view';
import FastImage from 'react-native-fast-image';
import { getImgePath } from '@data/api';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export function CommunityScreen({
  route,
  navigation,
}: StackScreenProps<'community'>) {
  const { styles, theme } = useStyles(styleSheet);
  const { t } = useTranslation();
  const [isActiveBox, setIsActiveBox] = useState(0);
  const [isShowDescriptions, setIsShowDescriptions] = useState(false);
  const user = useDCStore.use.user();
  const handleDescriptionToggle = () => {
    setIsShowDescriptions(!isShowDescriptions);
  };

  const { id } = route.params;

  const { data: community, isPending } = useGetCommunity(id);

  // UnFollowing
  const unFollowMutation = useToggleFollowCommunity();

  const toggleFollow = () => {
    if (!community) {
      return;
    }
    unFollowMutation.mutate(community);
  };

  const goToChat = async () => {
    if (!community) {
      return;
    }

    navigation.navigate('chat', { channelId: community.channelId });
  };

  const isOwner = user?.id === community?.creator.id;

  const onPressShare = async () => {
    if (!community) {
      return;
    }
    await Share.share({
      title: community.title ?? '',
      message:
        Platform.OS == 'android'
          ? `https://danceconnect.online/community/${community.id}`
          : `${community.title}`,
      url: `https://danceconnect.online/community/${community.id}`,
    });
  };

  if (isPending || !community) {
    return <LoaderView />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <View style={styles.backgroundImage}>
          <View style={styles.eventTop}>
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.pop();
                }
                navigation.navigate('homeTabs');
              }}>
              <DCRoundIcon icon={<ArrowLeftIcon fill={theme.colors.white} />} />
            </TouchableOpacity>

            <View style={styles.eventTopRight}>
              {isOwner && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.push('createCommunity', { community })
                  }>
                  <DCRoundIcon icon={<EditIconSvg />} />
                </TouchableOpacity>
              )}
              <DCRoundIcon icon={<SettingIcon />} />
              <TouchableOpacity onPress={onPressShare}>
                <DCRoundIcon icon={<ShareIcon />} />
              </TouchableOpacity>
            </View>
          </View>

          {community?.images.length > 0 && (
            <FlatList
              pagingEnabled
              renderItem={({ item }) => (
                <FastImage
                  resizeMode="cover"
                  style={{ width: SCREEN_WIDTH, height: '100%' }}
                  source={{ uri: getImgePath(item) }}
                />
              )}
              data={community?.images}
              horizontal
              style={{ flex: 1 }}
            />
          )}
          <View style={styles.eventBoxes}>
            {community?.categories.map((category, i) => (
              <View
                style={
                  isActiveBox !== i ? styles.eventBox : styles.eventBoxActive
                }>
                <Text
                  style={
                    isActiveBox !== i
                      ? styles.eventBoxTitle
                      : styles.eventBoxTitleActive
                  }
                  onPress={() => setIsActiveBox(i)}>
                  {category}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.eventBody}>
          <Text style={styles.eventTitle}>{community?.title}</Text>
          <ExpandableText
            expand={isShowDescriptions}
            style={styles.eventDescription}>
            {community?.description}
          </ExpandableText>

          {community?.description?.length > 100 && (
            <TouchableOpacity
              style={styles.eventBodyBtn}
              onPress={handleDescriptionToggle}>
              <Text style={styles.eventBodyBtnTitle}>{t('show_more')}</Text>
              <RightArrowIcon
                style={
                  isShowDescriptions
                    ? { transform: [{ rotate: '-90deg' }] }
                    : { transform: [{ rotate: '90deg' }] }
                }
              />
            </TouchableOpacity>
          )}

          <DCLine containerStyle={{ marginTop: 15 }} />

          <View style={styles.eventColumn}>
            <View style={styles.eventRow}>
              <DCRoundIcon
                icon={
                  <Image
                    style={{ width: 16, height: 16 }}
                    tintColor={theme.colors.secondary500}
                    source={images.icon.locationPin}
                  />
                }
                iconBoxStyle={{
                  width: 44,
                  height: 44,
                  backgroundColor: theme.colors.transparentPurple,
                }}
              />
              <View style={styles.eventRowBox}>
                <Text style={styles.eventDate}>
                  {community?.creator.location?.location}
                </Text>
                <View style={styles.eventMaps}>
                  <Text style={styles.eventMapsTitle}>{t('maps')}</Text>
                  <ArrowLeftIcon
                    fill={theme.colors.secondary500}
                    style={{ transform: [{ rotate: '180deg' }] }}
                  />
                </View>
              </View>
            </View>

            <View style={styles.eventRow}>
              <UserImage
                size={44}
                imageUrl={getImgePath(community?.creator.userImage)}
                style={styles.eventOrganizerAvatar}
              />
              <View>
                <Text
                  style={[styles.eventDate, { fontSize: theme.spacing.MD }]}>
                  {community?.creator.fullName}
                </Text>
                <Text style={styles.eventTime}>{t('organizer')}</Text>
              </View>
            </View>
            <View style={styles.eventPeople}>
              <View style={styles.eventPeopleLeft}>
                <Image source={images.eventAvatar} style={styles.eventAvatar} />
                <Text style={styles.eventPeopleTitle}>
                  + {community?.followers.length} {t('going')}
                </Text>
              </View>
            </View>
          </View>
          {community?.isFollowing ? (
            <DCButton
              leftIcon={<MessageIcon />}
              onPress={goToChat}
              variant="secondary"
              containerStyle={{ marginBottom: theme.spacing.LG }}>
              {t('write_to_chat')}
            </DCButton>
          ) : (
            <DCButton
              onPress={toggleFollow}
              variant="secondary"
              containerStyle={{ marginBottom: theme.spacing.LG }}>
              {t('join')}
            </DCButton>
          )}
          {isOwner && <DCButton>{t('create_event')}</DCButton>}
        </View>
        {/* <View style={styles.container}>
          <CommunityCardList all={[]} communities={[]} events={[]} />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styleSheet = createStyleSheet(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  backgroundImage: {
    width: '100%',
    height: 340,
    position: 'relative',
    marginBottom: 30,
    backgroundColor: theme.colors.gray100,
  },
  eventTop: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.LG,
    position: 'absolute',
    top: 0,
    width: SCREEN_WIDTH,
    zIndex: 1,
  },
  eventTopRight: {
    flexDirection: 'row',
    gap: theme.spacing.XS,
  },
  eventBoxes: {
    width: '100%',
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: theme.spacing.LG,
    position: 'absolute',
    bottom: -12,
    zIndex: 1,
  },
  eventBox: {
    borderWidth: 1,
    borderColor: theme.colors.secondary500,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  eventBoxActive: {
    borderWidth: 1,
    borderColor: theme.colors.secondary500,
    backgroundColor: theme.colors.secondary500,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  eventBoxTitle: {
    color: theme.colors.secondary500,
    fontWeight: '700',
    fontSize: 14,
    position: 'relative',
    top: -1,
    fontFamily: theme.fonts.latoRegular,
  },
  eventBoxTitleActive: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 14,
    position: 'relative',
    top: -1,
    fontFamily: theme.fonts.latoRegular,
  },
  eventBody: {
    paddingHorizontal: theme.spacing.LG,
  },
  eventTitle: {
    fontSize: theme.spacing.LG,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  eventPeople: {
    width: '100%',
    height: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventPeopleLeft: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.XS,
  },
  eventAvatar: {
    width: 36,
    height: '100%',
  },
  eventPeopleTitle: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: theme.fonts.latoRegular,
  },
  eventDate: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: theme.fonts.latoRegular,
    color: theme.colors.textPrimary,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: theme.fonts.latoRegular,
    color: theme.colors.gray700,
  },
  eventRow: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventRowBox: {
    width: '84%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventMaps: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventMapsTitle: {
    color: theme.colors.secondary500,
    fontSize: theme.spacing.MD,
    fontWeight: '700',
    fontFamily: theme.fonts.latoRegular,
  },
  eventOrganizerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 50,
  },
  eventColumn: {
    marginVertical: 15,
    gap: 12,
  },
  eventDescription: {
    fontSize: theme.spacing.MD,
    fontWeight: '500',
    fontFamily: theme.fonts.latoRegular,
    color: theme.colors.gray800,
    marginVertical: theme.spacing.XS,
  },
  eventBodyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventBodyBtnTitle: {
    color: theme.colors.secondary500,
    fontWeight: '700',
  },
  container: {
    paddingHorizontal: theme.spacing.LG,
    paddingBottom: 10,
    marginTop: 20,
  },
  modalBox: {
    position: 'absolute',
    top: '110%',
    right: '50%',
    borderRadius: 8,
    borderTopRightRadius: 0,
    width: '280%',
    height: 'auto',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.MD,
    paddingVertical: theme.spacing.XS,
  },
  modalBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalBoxClose: {
    borderWidth: 1,
    borderColor: theme.colors.error,
    borderRadius: 4,
    padding: 3,
  },
  modalBoxTitle: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
}));
