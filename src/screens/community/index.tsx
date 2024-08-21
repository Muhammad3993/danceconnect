import { theming } from 'common/constants/theming';
import { images } from 'common/resources/images';
import { ArrowLeftIcon } from 'components/icons/arrowLeft';
import { EditIconSvg } from 'components/icons/editIcon';
import { LocationIcon } from 'components/icons/location';
import { SettingIcon } from 'components/icons/settingIcon';
import { ShareIcon } from 'components/icons/shareIcon';
import { DCButton } from 'components/shared/button';
import { DCRoundIcon } from 'components/shared/round_icon';
import { DCLine } from 'components/shared/line';
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
import { RightArrowIcon } from 'components/icons/rightArrow';
import {
  useGetCommunity,
  useToggleFollowCommunity,
} from 'data/hooks/community';
import { MessageIcon } from 'components/icons/message';
import { StackScreenProps } from 'screens/interfaces';
import { UserImage } from 'components/user_image';
import { useDCStore } from 'store';
import ExpandableText from 'components/shared/expandable_text';
import { SCREEN_WIDTH } from 'common/constants';
import { LoaderView } from 'components/shared/loader_view';
import FastImage from 'react-native-fast-image';
import { getImgePath } from 'data/api';

export function CommunityScreen({
  route,
  navigation,
}: StackScreenProps<'community'>) {
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
              <DCRoundIcon
                icon={<ArrowLeftIcon fill={theming.colors.white} />}
              />
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
                icon={<LocationIcon />}
                iconBoxStyle={{
                  width: 44,
                  height: 44,
                  backgroundColor: theming.colors.transparentPurple,
                }}
              />
              <View style={styles.eventRowBox}>
                <Text style={styles.eventDate}>
                  {community?.creator.location?.location}
                </Text>
                <View style={styles.eventMaps}>
                  <Text style={styles.eventMapsTitle}>{t('maps')}</Text>
                  <ArrowLeftIcon
                    fill={theming.colors.purple}
                    style={{ transform: [{ rotate: '180deg' }] }}
                  />
                </View>
              </View>
            </View>

            <View style={styles.eventRow}>
              <UserImage
                userImage={getImgePath(community?.creator.userImage)}
                style={styles.eventOrganizerAvatar}
              />
              <View>
                <Text
                  style={[styles.eventDate, { fontSize: theming.spacing.MD }]}>
                  {community?.creator.userName}
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
              containerStyle={{ marginBottom: theming.spacing.LG }}>
              {t('write_to_chat')}
            </DCButton>
          ) : (
            <DCButton
              onPress={toggleFollow}
              variant="secondary"
              containerStyle={{ marginBottom: theming.spacing.LG }}>
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
  backgroundImage: {
    width: '100%',
    height: 340,
    position: 'relative',
    marginBottom: 30,
    backgroundColor: theming.colors.gray100,
  },
  eventTop: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theming.spacing.LG,
    position: 'absolute',
    top: 0,
    width: SCREEN_WIDTH,
    zIndex: 1,
  },
  eventTopRight: {
    flexDirection: 'row',
    gap: theming.spacing.SM,
  },
  eventBoxes: {
    width: '100%',
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: theming.spacing.LG,
    position: 'absolute',
    bottom: -12,
    zIndex: 1,
  },
  eventBox: {
    borderWidth: 1,
    borderColor: theming.colors.purple,
    backgroundColor: theming.colors.white,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  eventBoxActive: {
    borderWidth: 1,
    borderColor: theming.colors.purple,
    backgroundColor: theming.colors.purple,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  eventBoxTitle: {
    color: theming.colors.purple,
    fontWeight: '700',
    fontSize: 14,
    position: 'relative',
    top: -1,
    fontFamily: theming.fonts.latoRegular,
  },
  eventBoxTitleActive: {
    color: theming.colors.white,
    fontWeight: '700',
    fontSize: 14,
    position: 'relative',
    top: -1,
    fontFamily: theming.fonts.latoRegular,
  },
  eventBody: {
    paddingHorizontal: theming.spacing.LG,
  },
  eventTitle: {
    fontSize: theming.spacing.LG,
    color: theming.colors.textPrimary,
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
    gap: theming.spacing.SM,
  },
  eventAvatar: {
    width: 36,
    height: '100%',
  },
  eventPeopleTitle: {
    color: theming.colors.textPrimary,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: theming.fonts.latoRegular,
  },
  eventDate: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.textPrimary,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.gray700,
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
    color: theming.colors.purple,
    fontSize: theming.spacing.MD,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
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
    fontSize: theming.spacing.MD,
    fontWeight: '500',
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.gray800,
    marginVertical: theming.spacing.SM,
  },
  eventBodyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventBodyBtnTitle: {
    color: theming.colors.purple,
    fontWeight: '700',
  },
  container: {
    paddingHorizontal: theming.spacing.LG,
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
    backgroundColor: theming.colors.white,
    paddingHorizontal: theming.spacing.MD,
    paddingVertical: theming.spacing.SM,
  },
  modalBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalBoxClose: {
    borderWidth: 1,
    borderColor: theming.colors.redError,
    borderRadius: 4,
    padding: 3,
  },
  modalBoxTitle: {
    color: theming.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});
