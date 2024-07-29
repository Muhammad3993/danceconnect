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
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { RightArrowIcon } from 'components/icons/rightArrow';
import { CommunityCardList } from './ui';

export function CommunityScreen() {
  const { t } = useTranslation();
  const [isActiveBox, setIsActiveBox] = useState(1);
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <ImageBackground
          source={images.homeImg1}
          style={styles.backgroundImage}>
          <View style={styles.eventTop}>
            <DCRoundIcon icon={<ArrowLeftIcon fill={theming.colors.white} />} />
            <View style={styles.eventTopRight}>
              <DCRoundIcon icon={<EditIconSvg />} />
              <DCRoundIcon icon={<SettingIcon />} />
              <DCRoundIcon icon={<ShareIcon />} />
            </View>
          </View>

          <View style={styles.eventBoxes}>
            <View
              style={
                isActiveBox !== 1 ? styles.eventBox : styles.eventBoxActive
              }>
              <Text
                style={
                  isActiveBox !== 1
                    ? styles.eventBoxTitle
                    : styles.eventBoxTitleActive
                }
                onPress={() => setIsActiveBox(1)}>
                Salsa
              </Text>
            </View>
            <View
              style={
                isActiveBox !== 2 ? styles.eventBox : styles.eventBoxActive
              }>
              <Text
                style={
                  isActiveBox !== 2
                    ? styles.eventBoxTitle
                    : styles.eventBoxTitleActive
                }
                onPress={() => setIsActiveBox(2)}>
                Bachata
              </Text>
            </View>
            <View
              style={
                isActiveBox !== 3 ? styles.eventBox : styles.eventBoxActive
              }>
              <Text
                style={
                  isActiveBox !== 3
                    ? styles.eventBoxTitle
                    : styles.eventBoxTitleActive
                }
                onPress={() => setIsActiveBox(3)}>
                Kizomba
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.eventBody}>
          <Text style={styles.eventTitle}>Latin Dance Community</Text>
          <Text style={styles.eventDescription}>
            Our community created for dancers who are passionate about salsa,
            bachata, and kizomba. We bring together individuals from all walks
            of life who share a deep love for Latin music and the exhilarating
            art of dance.
          </Text>

          <View style={styles.eventBodyBtn}>
            <Text style={styles.eventBodyBtnTitle}>Show More</Text>
            <RightArrowIcon style={{ transform: [{ rotate: '90deg' }] }} />
          </View>

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
                <Text style={styles.eventDate}>New York, New York</Text>
                <View style={styles.eventMaps}>
                  <Text style={styles.eventMapsTitle}>Maps</Text>
                  <ArrowLeftIcon
                    fill={theming.colors.purple}
                    style={{ transform: [{ rotate: '180deg' }] }}
                  />
                </View>
              </View>
            </View>

            <View style={styles.eventRow}>
              <Image
                source={images.eventAvatar}
                style={styles.eventOrganizerAvatar}
              />
              <View>
                <Text
                  style={[styles.eventDate, { fontSize: theming.spacing.MD }]}>
                  World of Dance
                </Text>
                <Text style={styles.eventTime}>Organizer</Text>
              </View>
            </View>
            <View style={styles.eventPeople}>
              <View style={styles.eventPeopleLeft}>
                <Image source={images.eventAvatar} style={styles.eventAvatar} />
                <Text style={styles.eventPeopleTitle}>+ 1 going</Text>
              </View>
            </View>
          </View>
          <DCButton>{t('create_event')}</DCButton>
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
});