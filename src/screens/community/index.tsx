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
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { RightArrowIcon } from 'components/icons/rightArrow';
import { CommunityCardList } from './ui';
import {
  useGetCommunity,
  useToggleFollowCommunity,
} from 'data/hooks/community';
import { MessageIcon } from 'components/icons/message';
import { CloseIcon } from 'components/icons/close';
import { StackScreenProps } from 'screens/interfaces';
import { UserImage } from 'components/user_image';
import { useDCStore } from 'store';
import ExpandableText from 'components/shared/expandable_text';

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

  const { data: community } = useGetCommunity(id);

  // UnFollowing
  const unFollowMutation = useToggleFollowCommunity();

  const toggleFollow = () => {
    if (!community) {
      return;
    }
    unFollowMutation.mutate(community);
  };

  const goToChat = () => {
    if (!community) {
      return;
    }
    navigation.navigate('chat', { channelId: community.channelId });
  };

  const isOwner = user?.id === community?.creator.id;

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <ImageBackground
          source={images.homeImg1}
          style={styles.backgroundImage}>
          <View style={styles.eventTop}>
            <TouchableOpacity onPress={() => navigation.pop()}>
              <DCRoundIcon
                icon={<ArrowLeftIcon fill={theming.colors.white} />}
              />
            </TouchableOpacity>

            <View style={styles.eventTopRight}>
              <DCRoundIcon icon={<EditIconSvg />} />
              <DCRoundIcon icon={<SettingIcon />} />
              {/* {community?.isFollowing ? (
                <View style={{ position: 'relative' }}>
                  <TouchableOpacity onPress={handleOpenModal}>
                    <DCRoundIcon
                      icon={<MessageIcon stroke={theming.colors.white} />}
                    />
                  </TouchableOpacity>
                  {isOpenModal ? (
                    <View style={styles.modalBox}>
                      <View style={styles.modalBoxRow}>
                        <TouchableOpacity
                          style={styles.modalBoxClose}
                          onPress={handleOpenModal}>
                          <CloseIcon
                            width={10}
                            height={10}
                            stroke={theming.colors.redError}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleUnFollow}>
                          <Text style={styles.modalBoxTitle}>Unfollow</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    ''
                  )}
                </View>
              ) : (
                ''
              )} */}
              <DCRoundIcon icon={<ShareIcon />} />
            </View>
          </View>

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
        </ImageBackground>

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
                userImage={community?.creator.userImage}
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
        <View style={styles.container}>
          <CommunityCardList all={[]} communities={[]} events={[]} />
        </View>
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
  },
  eventTop: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theming.spacing.LG,
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
